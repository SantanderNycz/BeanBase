import { type User, type UpsertUser } from "@shared/models/auth";

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class MemoryAuthStorage implements IAuthStorage {
  private users: Map<string, User> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user = { ...userData, updatedAt: new Date() } as User;
    this.users.set(user.id, user);
    return user;
  }
}

export const authStorage = new MemoryAuthStorage();
