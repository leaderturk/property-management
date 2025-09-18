// javascript_auth_all_persistance blueprint implementation
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

// Public user type (excludes sensitive fields like password)
export type PublicUser = Omit<SelectUser, 'password'>;

// Sanitizer function to remove sensitive fields from user object
function toPublicUser(user: SelectUser): PublicUser {
  const { password, ...publicUser } = user;
  return publicUser;
}

// Registration validation schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long")
});

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // SESSION_SECRET validation - enforce in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET is required in production environment");
    }
    console.warn("WARNING: SESSION_SECRET not set, using fallback (not secure for production)");
  }
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret || "insecure-fallback-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    // Security hardening for production
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true, // Prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "strict" // CSRF protection
    },
    name: "sessionId" // Don't reveal framework
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !user.password || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate request body using Zod
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validation.error.errors.map(e => e.message)
        });
      }

      const { username, password } = validation.data;

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // SECURITY: Always force role="user" for new registrations, ignore any client input
      const user = await storage.createUser({
        username,
        password: await hashPassword(password),
        role: "user", // Force user role - admin accounts must be created server-side
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // SECURITY: Return sanitized user without password hash
        res.status(201).json(toPublicUser(user));
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // SECURITY: Return sanitized user without password hash
    res.status(200).json(toPublicUser(req.user as SelectUser));
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    // SECURITY: Return sanitized user without password hash
    res.json(toPublicUser(req.user as SelectUser));
  });
}

// Authentication middleware
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Admin role middleware
export function isAdminRole(req: any, res: any, next: any) {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  return next();
}