import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdminRole, hashPassword } from "./auth";
import { z } from "zod";
import { 
  insertContactRequestSchema,
  insertBuildingSchema,
  insertFlatSchema,
  insertResidentSchema,
  insertFeePaymentSchema,
  insertMaintenanceRequestSchema,
  insertBlogPostSchema,
  insertUserSchema,
  type User
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup (Replit Auth integration)
  await setupAuth(app);

  // API routes (auth routes are handled in auth.ts setupAuth)
  // Contact requests
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactRequestSchema.parse(req.body);
      const contact = await storage.createContactRequest(contactData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact request data" });
    }
  });

  app.get("/api/contact", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const contacts = await storage.getContactRequests();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact requests" });
    }
  });

  // Buildings
  app.get("/api/buildings", async (req, res) => {
    try {
      const buildings = await storage.getBuildings();
      res.json(buildings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch buildings" });
    }
  });

  app.post("/api/buildings", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const buildingData = insertBuildingSchema.parse(req.body);
      const building = await storage.createBuilding(buildingData);
      res.json(building);
    } catch (error) {
      res.status(400).json({ error: "Invalid building data" });
    }
  });

  app.get("/api/buildings/:id", async (req, res) => {
    try {
      const building = await storage.getBuilding(req.params.id);
      if (!building) {
        return res.status(404).json({ error: "Building not found" });
      }
      res.json(building);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch building" });
    }
  });

  app.put("/api/buildings/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const updates = insertBuildingSchema.partial().parse(req.body);
      const building = await storage.updateBuilding(req.params.id, updates);
      if (!building) {
        return res.status(404).json({ error: "Building not found" });
      }
      res.json(building);
    } catch (error) {
      res.status(400).json({ error: "Invalid building data" });
    }
  });

  app.delete("/api/buildings/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const deleted = await storage.deleteBuilding(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Building not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete building" });
    }
  });

  // Flats
  app.get("/api/flats", async (req, res) => {
    try {
      const { buildingId } = req.query;
      const flats = buildingId 
        ? await storage.getFlatsByBuilding(buildingId as string)
        : await storage.getFlats();
      res.json(flats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flats" });
    }
  });

  app.post("/api/flats", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const flatData = insertFlatSchema.parse(req.body);
      const flat = await storage.createFlat(flatData);
      res.json(flat);
    } catch (error) {
      res.status(400).json({ error: "Invalid flat data" });
    }
  });

  app.get("/api/flats/:id", async (req, res) => {
    try {
      const flat = await storage.getFlat(req.params.id);
      if (!flat) {
        return res.status(404).json({ error: "Flat not found" });
      }
      res.json(flat);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flat" });
    }
  });

  app.put("/api/flats/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const updates = insertFlatSchema.partial().parse(req.body);
      const flat = await storage.updateFlat(req.params.id, updates);
      if (!flat) {
        return res.status(404).json({ error: "Flat not found" });
      }
      res.json(flat);
    } catch (error) {
      res.status(400).json({ error: "Invalid flat data" });
    }
  });

  app.delete("/api/flats/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const deleted = await storage.deleteFlat(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Flat not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete flat" });
    }
  });

  // Residents
  app.get("/api/residents", async (req, res) => {
    try {
      const residents = await storage.getResidents();
      res.json(residents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch residents" });
    }
  });

  app.post("/api/residents", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const residentData = insertResidentSchema.parse(req.body);
      const resident = await storage.createResident(residentData);
      res.json(resident);
    } catch (error) {
      console.error("Validation error:", error);
      if (error instanceof Error && 'issues' in error) {
        res.status(400).json({ 
          error: "Invalid resident data", 
          details: (error as any).issues.map((issue: any) => issue.message)
        });
      } else {
        res.status(400).json({ error: "Invalid resident data" });
      }
    }
  });

  app.get("/api/residents/:id", async (req, res) => {
    try {
      const resident = await storage.getResident(req.params.id);
      if (!resident) {
        return res.status(404).json({ error: "Resident not found" });
      }
      res.json(resident);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resident" });
    }
  });

  app.put("/api/residents/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const updates = insertResidentSchema.partial().parse(req.body);
      const resident = await storage.updateResident(req.params.id, updates);
      if (!resident) {
        return res.status(404).json({ error: "Resident not found" });
      }
      res.json(resident);
    } catch (error) {
      res.status(400).json({ error: "Invalid resident data" });
    }
  });

  app.delete("/api/residents/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const deleted = await storage.deleteResident(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Resident not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete resident" });
    }
  });

  // Fee payments
  app.get("/api/fee-payments", async (req, res) => {
    try {
      const { flatId } = req.query;
      const payments = flatId 
        ? await storage.getFeePaymentsByFlat(flatId as string)
        : await storage.getFeePayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fee payments" });
    }
  });

  app.post("/api/fee-payments", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const paymentData = insertFeePaymentSchema.parse(req.body);
      const payment = await storage.createFeePayment(paymentData);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: "Invalid payment data" });
    }
  });

  app.put("/api/fee-payments/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const rawUpdates = req.body;
      // Handle paidAt field conversion from string to Date
      const updates: any = {};
      
      if (rawUpdates.flatId !== undefined) updates.flatId = rawUpdates.flatId;
      if (rawUpdates.amount !== undefined) updates.amount = rawUpdates.amount;
      if (rawUpdates.month !== undefined) updates.month = rawUpdates.month;
      if (rawUpdates.year !== undefined) updates.year = rawUpdates.year;
      if (rawUpdates.isPaid !== undefined) updates.isPaid = rawUpdates.isPaid;
      if (rawUpdates.paidAt !== undefined) {
        updates.paidAt = rawUpdates.paidAt === null ? null : new Date(rawUpdates.paidAt);
      }
      
      const payment = await storage.updateFeePayment(req.params.id, updates);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: "Invalid payment data" });
    }
  });

  // Maintenance requests
  app.get("/api/maintenance-requests", async (req, res) => {
    try {
      const requests = await storage.getMaintenanceRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance requests" });
    }
  });

  app.post("/api/maintenance-requests", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const requestData = insertMaintenanceRequestSchema.parse(req.body);
      const request = await storage.createMaintenanceRequest(requestData);
      res.json(request);
    } catch (error) {
      res.status(400).json({ error: "Invalid maintenance request data" });
    }
  });

  app.get("/api/maintenance-requests/:id", async (req, res) => {
    try {
      const request = await storage.getMaintenanceRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: "Maintenance request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance request" });
    }
  });

  app.put("/api/maintenance-requests/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const updates = insertMaintenanceRequestSchema.partial().parse(req.body);
      const request = await storage.updateMaintenanceRequest(req.params.id, updates);
      if (!request) {
        return res.status(404).json({ error: "Maintenance request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(400).json({ error: "Invalid maintenance request data" });
    }
  });

  // Admin User Management (admin-only endpoints)
  app.get("/api/admin/users", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const users = await storage.getUsers();
      // Return sanitized users without password hashes
      const sanitizedUsers = users.map((user: User) => {
        const { password, ...publicUser } = user;
        return publicUser;
      });
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const validatedData = insertUserSchema.omit({ id: true }).parse(req.body);
      const { username, password, role = "user", firstName, lastName, email } = validatedData;
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = await storage.createUser({
        username,
        password: await hashPassword(password),
        role,
        firstName,
        lastName,
        email
      });

      // Return sanitized user without password hash
      const { password: _, ...publicUser } = user;
      res.status(201).json(publicUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Invalid user data", 
          details: error.issues.map((issue: z.ZodIssue) => issue.message)
        });
      } else {
        res.status(400).json({ error: "Failed to create user" });
      }
    }
  });

  app.put("/api/admin/users/:id/password", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const { password } = z.object({ password: z.string().min(6) }).parse(req.body);
      const userId = req.params.id;
      
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.upsertUser({
        id: userId,
        password: await hashPassword(password)
      });
      
      // Return sanitized user without password hash
      const { password: _, ...publicUser } = updatedUser;
      res.json(publicUser);
    } catch (error) {
      res.status(400).json({ error: "Failed to update password" });
    }
  });

  app.delete("/api/admin/users/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const userId = req.params.id;
      const currentUser = req.user as User;
      
      // Prevent admin from deleting themselves
      if (userId === currentUser.id) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      const deleted = await storage.deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Blog posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const { published } = req.query;
      const posts = published === "true" 
        ? await storage.getPublishedBlogPosts()
        : await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/blog-posts", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.put("/api/blog-posts/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const updates = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, updates);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });

  app.delete("/api/blog-posts/:id", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", isAuthenticated, isAdminRole, async (req, res) => {
    try {
      const buildings = await storage.getBuildings();
      const flats = await storage.getFlats();
      const feePayments = await storage.getFeePayments();
      const maintenanceRequests = await storage.getMaintenanceRequests();

      const totalFlats = flats.length;
      const paidFees = feePayments.filter(p => p.isPaid).length;
      const unpaidFees = feePayments.filter(p => !p.isPaid).length;
      const pendingMaintenance = maintenanceRequests.filter(r => r.status === 'pending').length;
      const paymentRate = totalFlats > 0 ? Math.round((paidFees / (paidFees + unpaidFees)) * 100) : 0;

      const stats = {
        totalBuildings: buildings.length,
        totalFlats,
        paymentRate,
        pendingMaintenance,
        totalRevenue: feePayments
          .filter(p => p.isPaid)
          .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
