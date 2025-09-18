import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";

// Create the Express app for serverless deployment
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Set up the Express app with routes but without HTTP server
let appSetup: Promise<express.Express> | null = null;

async function setupApp() {
  if (!appSetup) {
    appSetup = (async () => {
      // Register all routes (this will set up auth and API endpoints)
      await registerRoutes(app);
      
      // Add error handling middleware
      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        
        res.status(status).json({ message });
        
        // Log error but don't throw in serverless environment
        console.error("Error:", err);
      });

      return app;
    })();
  }
  
  return appSetup;
}

// Export the serverless handler for Vercel
export default async function handler(req: Request, res: Response) {
  try {
    const app = await setupApp();
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}