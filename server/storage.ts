import { 
  type User, type InsertUser, type UpsertUser,
  type Building, type InsertBuilding,
  type Flat, type InsertFlat,
  type Resident, type InsertResident,
  type FeePayment, type InsertFeePayment,
  type MaintenanceRequest, type InsertMaintenanceRequest,
  type ContactRequest, type InsertContactRequest,
  type BlogPost, type InsertBlogPost
} from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Helper function to create scrypt hash (same as auth.ts)
async function createScryptHash(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Replit Auth methods (required by blueprint)
  upsertUser(user: UpsertUser): Promise<User>;
  // Admin user management methods
  getUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;

  // Building methods
  getBuildings(): Promise<Building[]>;
  getBuilding(id: string): Promise<Building | undefined>;
  createBuilding(building: InsertBuilding): Promise<Building>;
  updateBuilding(id: string, building: Partial<InsertBuilding>): Promise<Building | undefined>;
  deleteBuilding(id: string): Promise<boolean>;

  // Flat methods
  getFlats(): Promise<Flat[]>;
  getFlatsByBuilding(buildingId: string): Promise<Flat[]>;
  getFlat(id: string): Promise<Flat | undefined>;
  createFlat(flat: InsertFlat): Promise<Flat>;
  updateFlat(id: string, flat: Partial<InsertFlat>): Promise<Flat | undefined>;
  deleteFlat(id: string): Promise<boolean>;

  // Resident methods
  getResidents(): Promise<Resident[]>;
  getResident(id: string): Promise<Resident | undefined>;
  createResident(resident: InsertResident): Promise<Resident>;
  updateResident(id: string, resident: Partial<InsertResident>): Promise<Resident | undefined>;
  deleteResident(id: string): Promise<boolean>;

  // Fee Payment methods
  getFeePayments(): Promise<FeePayment[]>;
  getFeePaymentsByFlat(flatId: string): Promise<FeePayment[]>;
  createFeePayment(payment: InsertFeePayment): Promise<FeePayment>;
  updateFeePayment(id: string, payment: Partial<InsertFeePayment>): Promise<FeePayment | undefined>;

  // Maintenance Request methods
  getMaintenanceRequests(): Promise<MaintenanceRequest[]>;
  getMaintenanceRequest(id: string): Promise<MaintenanceRequest | undefined>;
  createMaintenanceRequest(request: InsertMaintenanceRequest): Promise<MaintenanceRequest>;
  updateMaintenanceRequest(id: string, request: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest | undefined>;

  // Contact Request methods
  getContactRequests(): Promise<ContactRequest[]>;
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  updateContactRequest(id: string, request: Partial<InsertContactRequest>): Promise<ContactRequest | undefined>;

  // Blog Post methods
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  // Session store for authentication
  public sessionStore: session.Store;
  
  private users: Map<string, User> = new Map();
  private buildings: Map<string, Building> = new Map();
  private flats: Map<string, Flat> = new Map();
  private residents: Map<string, Resident> = new Map();
  private feePayments: Map<string, FeePayment> = new Map();
  private maintenanceRequests: Map<string, MaintenanceRequest> = new Map();
  private contactRequests: Map<string, ContactRequest> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();

  constructor() {
    // Initialize memory store for sessions
    this.sessionStore = new (session as any).MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
    
    // Initialize async seeding - don't await to avoid blocking
    this.initializeData().catch(console.error);
  }

  private async initializeData() {
    await this.seedDataAsync();
  }

  private async seedDataAsync() {
    // Create sample admin user with proper scrypt hash 
    // Password: "admin123" - using actual scrypt hash generation
    const adminId = randomUUID();
    const adminScryptHash = await createScryptHash("admin123");
    
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: adminScryptHash,
      role: "admin",
      email: "admin@alqyonetim.com.tr",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create sample buildings
    const building1Id = randomUUID();
    const building2Id = randomUUID();
    
    this.buildings.set(building1Id, {
      id: building1Id,
      name: "Güneş Residans",
      address: "Melikgazi, Kayseri",
      totalFlats: 24,
      monthlyFee: "850.00",
      managerId: adminId,
      createdAt: new Date()
    });

    this.buildings.set(building2Id, {
      id: building2Id,
      name: "Kayseri Plaza",
      address: "Kocasinan, Kayseri",
      totalFlats: 48,
      monthlyFee: "1200.00",
      managerId: adminId,
      createdAt: new Date()
    });

    // Create sample residents
    const resident1Id = randomUUID();
    const resident2Id = randomUUID();
    
    this.residents.set(resident1Id, {
      id: resident1Id,
      name: "Ahmet Yılmaz",
      email: "ahmet@email.com",
      phone: "+90 532 123 45 67",
      createdAt: new Date()
    });

    this.residents.set(resident2Id, {
      id: resident2Id,
      name: "Fatma Demir",
      email: "fatma@email.com",
      phone: "+90 543 987 65 43",
      createdAt: new Date()
    });

    // Create sample flats
    const flat1Id = randomUUID();
    const flat2Id = randomUUID();
    
    this.flats.set(flat1Id, {
      id: flat1Id,
      buildingId: building1Id,
      flatNumber: "12",
      block: "A",
      size: 120,
      residentId: resident1Id,
      createdAt: new Date()
    });

    this.flats.set(flat2Id, {
      id: flat2Id,
      buildingId: building2Id,
      flatNumber: "8",
      block: "B",
      size: 95,
      residentId: resident2Id,
      createdAt: new Date()
    });

    // Create sample maintenance requests
    const maintenanceId = randomUUID();
    this.maintenanceRequests.set(maintenanceId, {
      id: maintenanceId,
      flatId: flat1Id,
      description: "Banyo muslugu arızalı",
      status: "pending",
      priority: "high",
      createdAt: new Date(),
      resolvedAt: null
    });

    // Create sample blog posts
    const blogId1 = randomUUID();
    const blogId2 = randomUUID();
    
    this.blogPosts.set(blogId1, {
      id: blogId1,
      title: "Kayseri'de Bina Yönetimi: Güvenilir ve Profesyonel Hizmetler",
      content: "Bina yönetimi konusunda uzman ekibimizle...",
      excerpt: "Kayseri'de profesyonel bina yönetimi hizmetleri hakkında bilgiler",
      category: "Yönetim",
      published: true,
      createdAt: new Date()
    });

    this.blogPosts.set(blogId2, {
      id: blogId2,
      title: "Aidat Toplama ve Finansal Yönetim",
      content: "Bina yönetiminde finansal süreçler...",
      excerpt: "Aidat toplama ve finansal raporlama hakkında detaylar",
      category: "Muhasebe",
      published: true,
      createdAt: new Date()
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      username: insertUser.username || null,
      password: insertUser.password || null,
      role: insertUser.role || "user",
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Replit Auth required method - upsert user by ID
  async upsertUser(upsertUser: UpsertUser): Promise<User> {
    const existingUser = this.users.get(upsertUser.id!);
    
    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        username: upsertUser.username ?? existingUser.username,
        password: upsertUser.password ?? existingUser.password,
        role: upsertUser.role ?? existingUser.role,
        email: upsertUser.email ?? existingUser.email,
        firstName: upsertUser.firstName ?? existingUser.firstName,
        lastName: upsertUser.lastName ?? existingUser.lastName,
        profileImageUrl: upsertUser.profileImageUrl ?? existingUser.profileImageUrl,
        updatedAt: new Date()
      };
      this.users.set(upsertUser.id!, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const newUser: User = {
        id: upsertUser.id!,
        username: upsertUser.username ?? null,
        password: upsertUser.password ?? null,
        role: upsertUser.role ?? "user",
        email: upsertUser.email ?? null,
        firstName: upsertUser.firstName ?? null,
        lastName: upsertUser.lastName ?? null,
        profileImageUrl: upsertUser.profileImageUrl ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(upsertUser.id!, newUser);
      return newUser;
    }
  }

  // Admin user management methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Building methods
  async getBuildings(): Promise<Building[]> {
    return Array.from(this.buildings.values());
  }

  async getBuilding(id: string): Promise<Building | undefined> {
    return this.buildings.get(id);
  }

  async createBuilding(insertBuilding: InsertBuilding): Promise<Building> {
    const id = randomUUID();
    const building: Building = { 
      ...insertBuilding, 
      id, 
      createdAt: new Date(),
      managerId: insertBuilding.managerId || null
    };
    this.buildings.set(id, building);
    return building;
  }

  async updateBuilding(id: string, updates: Partial<InsertBuilding>): Promise<Building | undefined> {
    const building = this.buildings.get(id);
    if (!building) return undefined;
    
    const updated = { ...building, ...updates };
    this.buildings.set(id, updated);
    return updated;
  }

  async deleteBuilding(id: string): Promise<boolean> {
    return this.buildings.delete(id);
  }

  // Flat methods
  async getFlats(): Promise<Flat[]> {
    return Array.from(this.flats.values());
  }

  async getFlatsByBuilding(buildingId: string): Promise<Flat[]> {
    return Array.from(this.flats.values()).filter(flat => flat.buildingId === buildingId);
  }

  async getFlat(id: string): Promise<Flat | undefined> {
    return this.flats.get(id);
  }

  async createFlat(insertFlat: InsertFlat): Promise<Flat> {
    const id = randomUUID();
    const flat: Flat = { 
      ...insertFlat, 
      id, 
      createdAt: new Date(),
      size: insertFlat.size || null,
      block: insertFlat.block || null,
      residentId: insertFlat.residentId || null
    };
    this.flats.set(id, flat);
    return flat;
  }

  async updateFlat(id: string, updates: Partial<InsertFlat>): Promise<Flat | undefined> {
    const flat = this.flats.get(id);
    if (!flat) return undefined;
    
    const updated = { ...flat, ...updates };
    this.flats.set(id, updated);
    return updated;
  }

  async deleteFlat(id: string): Promise<boolean> {
    return this.flats.delete(id);
  }

  // Resident methods
  async getResidents(): Promise<Resident[]> {
    return Array.from(this.residents.values());
  }

  async getResident(id: string): Promise<Resident | undefined> {
    return this.residents.get(id);
  }

  async createResident(insertResident: InsertResident): Promise<Resident> {
    const id = randomUUID();
    const resident: Resident = { 
      ...insertResident, 
      id, 
      createdAt: new Date(),
      email: insertResident.email || null,
      phone: insertResident.phone || null
    };
    this.residents.set(id, resident);
    return resident;
  }

  async updateResident(id: string, updates: Partial<InsertResident>): Promise<Resident | undefined> {
    const resident = this.residents.get(id);
    if (!resident) return undefined;
    
    const updated = { ...resident, ...updates };
    this.residents.set(id, updated);
    return updated;
  }

  async deleteResident(id: string): Promise<boolean> {
    return this.residents.delete(id);
  }

  // Fee Payment methods
  async getFeePayments(): Promise<FeePayment[]> {
    return Array.from(this.feePayments.values());
  }

  async getFeePaymentsByFlat(flatId: string): Promise<FeePayment[]> {
    return Array.from(this.feePayments.values()).filter(payment => payment.flatId === flatId);
  }

  async createFeePayment(insertPayment: InsertFeePayment): Promise<FeePayment> {
    const id = randomUUID();
    const payment: FeePayment = { 
      ...insertPayment, 
      id, 
      createdAt: new Date(),
      isPaid: insertPayment.isPaid || false,
      paidAt: insertPayment.paidAt || null
    };
    this.feePayments.set(id, payment);
    return payment;
  }

  async updateFeePayment(id: string, updates: Partial<InsertFeePayment>): Promise<FeePayment | undefined> {
    const payment = this.feePayments.get(id);
    if (!payment) return undefined;
    
    const updated = { ...payment, ...updates };
    this.feePayments.set(id, updated);
    return updated;
  }

  // Maintenance Request methods
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    return Array.from(this.maintenanceRequests.values());
  }

  async getMaintenanceRequest(id: string): Promise<MaintenanceRequest | undefined> {
    return this.maintenanceRequests.get(id);
  }

  async createMaintenanceRequest(insertRequest: InsertMaintenanceRequest): Promise<MaintenanceRequest> {
    const id = randomUUID();
    const request: MaintenanceRequest = { 
      ...insertRequest, 
      id, 
      createdAt: new Date(),
      resolvedAt: null,
      status: insertRequest.status || "pending",
      priority: insertRequest.priority || "medium"
    };
    this.maintenanceRequests.set(id, request);
    return request;
  }

  async updateMaintenanceRequest(id: string, updates: Partial<InsertMaintenanceRequest>): Promise<MaintenanceRequest | undefined> {
    const request = this.maintenanceRequests.get(id);
    if (!request) return undefined;
    
    const updated = { ...request, ...updates };
    this.maintenanceRequests.set(id, updated);
    return updated;
  }

  // Contact Request methods
  async getContactRequests(): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values());
  }

  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = randomUUID();
    const request: ContactRequest = { 
      ...insertRequest, 
      id, 
      createdAt: new Date(),
      phone: insertRequest.phone || null,
      serviceType: insertRequest.serviceType || null,
      status: insertRequest.status || "new"
    };
    this.contactRequests.set(id, request);
    return request;
  }

  async updateContactRequest(id: string, updates: Partial<InsertContactRequest>): Promise<ContactRequest | undefined> {
    const request = this.contactRequests.get(id);
    if (!request) return undefined;
    
    const updated = { ...request, ...updates };
    this.contactRequests.set(id, updated);
    return updated;
  }

  // Blog Post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(post => post.published);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = { 
      ...insertPost, 
      id, 
      createdAt: new Date(),
      published: insertPost.published || false,
      excerpt: insertPost.excerpt || null,
      category: insertPost.category || null
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updated = { ...post, ...updates };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
}

export const storage = new MemStorage();
