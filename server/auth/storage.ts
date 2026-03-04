import type { User } from "@shared/models/auth";

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
    // Se não tem ID, gera um
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

export const authStorage = new MemoryAuthStorage();
