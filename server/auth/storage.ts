import type { User } from "@shared/models/auth";
import { users } from "@shared/models/auth";
import { eq } from "drizzle-orm";
import { db } from "../db";

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: any): Promise<User>;
}

class MemoryAuthStorage implements IAuthStorage {
  private users: Map<string, User> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  async upsertUser(userData: any): Promise<User> {
    const id = userData.id || crypto.randomUUID();
    const existing = this.users.get(id);
    const user = {
      ...existing,
      ...userData,
      id,
      updatedAt: new Date(),
      createdAt: existing?.createdAt || new Date(),
    } as User;
    this.users.set(id, user);
    return user;
  }
}

class DatabaseAuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: any): Promise<User> {
    // Encontrar por ID
    const existingById = userData.id ? await this.getUser(userData.id) : null;

    if (existingById) {
      const [updated] = await db
        .update(users)
        .set({ ...userData, updatedAt: new Date() })
        .where(eq(users.id, userData.id))
        .returning();
      return updated;
    }

    // Se não encontrou por ID, tenta por email
    if (userData.email) {
      const existingByEmail = await this.getUserByEmail(userData.email);
      if (existingByEmail) {
        const [updated] = await db
          .update(users)
          .set({ ...userData, id: existingByEmail.id, updatedAt: new Date() })
          .where(eq(users.id, existingByEmail.id))
          .returning();
        return updated;
      }
    }

    // Cria novo utilizador
    const id = userData.id || crypto.randomUUID();
    const [created] = await db
      .insert(users)
      .values({ ...userData, id, createdAt: new Date(), updatedAt: new Date() })
      .returning();
    return created;
  }
}

export const authStorage: IAuthStorage = process.env.DATABASE_URL
  ? new DatabaseAuthStorage()
  : new MemoryAuthStorage();
