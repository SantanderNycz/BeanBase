import {
  coffeeShops,
  posts,
  comments,
  likes,
  favorites,
  users,
  type CoffeeShop,
  type InsertCoffeeShop,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type User,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { IAuthStorage, authStorage } from "./auth";

export interface IStorage extends IAuthStorage {
  // Coffee Shops
  getCoffeeShops(
    userId?: string,
  ): Promise<
    (CoffeeShop & { isFavorite?: boolean; favoritesCount?: number })[]
  >;
  getCoffeeShop(
    id: number,
    userId?: string,
  ): Promise<
    (CoffeeShop & { isFavorite?: boolean; favoritesCount?: number }) | undefined
  >;
  createCoffeeShop(shop: InsertCoffeeShop): Promise<CoffeeShop>;
  toggleFavoriteCoffeeShop(shopId: number, userId: string): Promise<boolean>;

  // Posts
  getPosts(options?: {
    coffeeShopId?: number;
    userId?: string;
    favoritesOnly?: boolean;
    currentUserId?: string;
  }): Promise<any[]>;
  createPost(post: InsertPost & { userId: string }): Promise<any>;
  toggleLikePost(postId: number, userId: string): Promise<boolean>;
  deletePost(postId: number, userId: string): Promise<void>;

  // Comments
  getComments(postId: number): Promise<any[]>;
  createComment(
    comment: InsertComment & { postId: number; userId: string },
  ): Promise<any>;
  deleteComment(commentId: number, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods delegated to authStorage
  async getUser(id: string): Promise<User | undefined> {
    return authStorage.getUser(id);
  }
  async upsertUser(user: any): Promise<User> {
    return authStorage.upsertUser(user);
  }

  // Coffee Shops
  async getCoffeeShops(userId?: string) {
    const shops = await db.select().from(coffeeShops);

    // In a real app, you'd use a more complex query with aggregations
    const shopsWithStats = await Promise.all(
      shops.map(async (shop) => {
        const shopFavorites = await db
          .select()
          .from(favorites)
          .where(eq(favorites.coffeeShopId, shop.id));
        const isFavorite = userId
          ? shopFavorites.some((f) => f.userId === userId)
          : false;
        return { ...shop, isFavorite, favoritesCount: shopFavorites.length };
      }),
    );

    return shopsWithStats;
  }

  async getCoffeeShop(id: number, userId?: string) {
    const [shop] = await db
      .select()
      .from(coffeeShops)
      .where(eq(coffeeShops.id, id));
    if (!shop) return undefined;

    const shopFavorites = await db
      .select()
      .from(favorites)
      .where(eq(favorites.coffeeShopId, shop.id));
    const isFavorite = userId
      ? shopFavorites.some((f) => f.userId === userId)
      : false;

    return { ...shop, isFavorite, favoritesCount: shopFavorites.length };
  }

  async createCoffeeShop(shop: InsertCoffeeShop) {
    const [newShop] = await db.insert(coffeeShops).values(shop).returning();
    return newShop;
  }

  async toggleFavoriteCoffeeShop(shopId: number, userId: string) {
    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.coffeeShopId, shopId), eq(favorites.userId, userId)),
      );

    if (existing.length > 0) {
      await db
        .delete(favorites)
        .where(
          and(eq(favorites.coffeeShopId, shopId), eq(favorites.userId, userId)),
        );
      return false;
    } else {
      await db.insert(favorites).values({ coffeeShopId: shopId, userId });
      return true;
    }
  }

  // Posts
  async getPosts(options?: {
    coffeeShopId?: number;
    userId?: string;
    favoritesOnly?: boolean;
    currentUserId?: string;
  }) {
    let query = db.select().from(posts).orderBy(desc(posts.createdAt));
    let basePosts = await query;

    if (options?.coffeeShopId) {
      basePosts = basePosts.filter(
        (p) => p.coffeeShopId === options.coffeeShopId,
      );
    }
    if (options?.userId) {
      basePosts = basePosts.filter((p) => p.userId === options.userId);
    }

    // Enhance posts with relations and stats
    const enhancedPosts = await Promise.all(
      basePosts.map(async (post) => {
        const [author] = await db
          .select()
          .from(users)
          .where(eq(users.id, post.userId));
        const [shop] = await db
          .select()
          .from(coffeeShops)
          .where(eq(coffeeShops.id, post.coffeeShopId));

        const postComments = await db
          .select()
          .from(comments)
          .where(eq(comments.postId, post.id));
        const postLikes = await db
          .select()
          .from(likes)
          .where(eq(likes.postId, post.id));

        const isLiked = options?.currentUserId
          ? postLikes.some((l) => l.userId === options.currentUserId)
          : false;

        return {
          ...post,
          author,
          coffeeShop: shop,
          commentsCount: postComments.length,
          likesCount: postLikes.length,
          isLiked,
        };
      }),
    );

    // Filter by favorites if requested
    if (options?.favoritesOnly && options?.currentUserId) {
      const userFavorites = await db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, options.currentUserId));
      const favoriteShopIds = userFavorites.map((f) => f.coffeeShopId);
      return enhancedPosts.filter((p) =>
        favoriteShopIds.includes(p.coffeeShopId),
      );
    }

    return enhancedPosts;
  }

  async createPost(post: InsertPost & { userId: string }) {
    const [newPost] = await db.insert(posts).values(post).returning();

    // Fetch relations for immediate return
    const [author] = await db
      .select()
      .from(users)
      .where(eq(users.id, newPost.userId));
    const [shop] = await db
      .select()
      .from(coffeeShops)
      .where(eq(coffeeShops.id, newPost.coffeeShopId));

    return {
      ...newPost,
      author,
      coffeeShop: shop,
      commentsCount: 0,
      likesCount: 0,
      isLiked: false,
    };
  }

  async toggleLikePost(postId: number, userId: string) {
    const existing = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));

    if (existing.length > 0) {
      await db
        .delete(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
      return false;
    } else {
      await db.insert(likes).values({ postId, userId });
      return true;
    }
  }

  async deletePost(postId: number, userId: string): Promise<void> {
    await db
      .delete(posts)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId)));
  }

  async deleteComment(commentId: number, userId: string): Promise<void> {
    await db
      .delete(comments)
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
  }

  // Comments
  async getComments(postId: number) {
    const postComments = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    const commentsWithAuthors = await Promise.all(
      postComments.map(async (comment) => {
        const [author] = await db
          .select()
          .from(users)
          .where(eq(users.id, comment.userId));
        return { ...comment, author };
      }),
    );

    return commentsWithAuthors;
  }

  async createComment(
    comment: InsertComment & { postId: number; userId: string },
  ) {
    const [newComment] = await db.insert(comments).values(comment).returning();
    const [author] = await db
      .select()
      .from(users)
      .where(eq(users.id, newComment.userId));
    return { ...newComment, author };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
}

export class MemoryStorage implements IStorage {
  private shops: any[] = [];
  private postsData: any[] = [];
  private commentsData: any[] = [];
  private likesData: any[] = [];
  private favoritesData: any[] = [];
  private usersData: any[] = [];
  private nextId = 1;

  async getUser(id: string) {
    return this.usersData.find((u) => u.id === id);
  }
  async upsertUser(user: any) {
    const existing = this.usersData.findIndex((u) => u.id === user.id);
    if (existing >= 0) this.usersData[existing] = user;
    else this.usersData.push(user);
    return user;
  }

  async getCoffeeShops(userId?: string) {
    return this.shops.map((shop) => ({
      ...shop,
      isFavorite: userId
        ? this.favoritesData.some(
            (f) => f.coffeeShopId === shop.id && f.userId === userId,
          )
        : false,
      favoritesCount: this.favoritesData.filter(
        (f) => f.coffeeShopId === shop.id,
      ).length,
    }));
  }

  async getCoffeeShop(id: number, userId?: string) {
    const shop = this.shops.find((s) => s.id === id);
    if (!shop) return undefined;
    return {
      ...shop,
      isFavorite: userId
        ? this.favoritesData.some(
            (f) => f.coffeeShopId === id && f.userId === userId,
          )
        : false,
      favoritesCount: this.favoritesData.filter((f) => f.coffeeShopId === id)
        .length,
    };
  }

  async createCoffeeShop(shop: InsertCoffeeShop) {
    const newShop = { ...shop, id: this.nextId++ };
    this.shops.push(newShop);
    return newShop as CoffeeShop;
  }

  async toggleFavoriteCoffeeShop(shopId: number, userId: string) {
    const idx = this.favoritesData.findIndex(
      (f) => f.coffeeShopId === shopId && f.userId === userId,
    );
    if (idx >= 0) {
      this.favoritesData.splice(idx, 1);
      return false;
    }
    this.favoritesData.push({ coffeeShopId: shopId, userId });
    return true;
  }

  async getPosts(options?: {
    coffeeShopId?: number;
    userId?: string;
    favoritesOnly?: boolean;
    currentUserId?: string;
  }) {
    let result = [...this.postsData];
    if (options?.coffeeShopId)
      result = result.filter((p) => p.coffeeShopId === options.coffeeShopId);
    if (options?.userId)
      result = result.filter((p) => p.userId === options.userId);
    if (options?.favoritesOnly && options?.currentUserId) {
      const favShopIds = this.favoritesData
        .filter((f) => f.userId === options.currentUserId)
        .map((f) => f.coffeeShopId);
      result = result.filter((p) => favShopIds.includes(p.coffeeShopId));
    }
    return result.map((post) => ({
      ...post,
      author: this.usersData.find((u) => u.id === post.userId),
      coffeeShop: this.shops.find((s) => s.id === post.coffeeShopId),
      likesCount: this.likesData.filter((l) => l.postId === post.id).length,
      commentsCount: this.commentsData.filter((c) => c.postId === post.id)
        .length,
      isLiked: options?.currentUserId
        ? this.likesData.some(
            (l) => l.postId === post.id && l.userId === options.currentUserId,
          )
        : false,
    }));
  }

  async createPost(post: InsertPost & { userId: string }) {
    const newPost = { ...post, id: this.nextId++, createdAt: new Date() };
    this.postsData.push(newPost);
    return {
      ...newPost,
      author: this.usersData.find((u) => u.id === post.userId),
      coffeeShop: this.shops.find((s) => s.id === post.coffeeShopId),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
    };
  }

  async toggleLikePost(postId: number, userId: string) {
    const idx = this.likesData.findIndex(
      (l) => l.postId === postId && l.userId === userId,
    );
    if (idx >= 0) {
      this.likesData.splice(idx, 1);
      return false;
    }
    this.likesData.push({ postId, userId });
    return true;
  }

  async deletePost(postId: number, userId: string) {
    const idx = this.postsData.findIndex(
      (p) => p.id === postId && p.userId === userId,
    );
    if (idx === -1) throw new Error("Post not found");
    this.postsData.splice(idx, 1);
  }

  async deleteComment(commentId: number, userId: string) {
    const idx = this.commentsData.findIndex(
      (c) => c.id === commentId && c.userId === userId,
    );
    if (idx === -1) throw new Error("Comment not found");
    this.commentsData.splice(idx, 1);
  }

  async getComments(postId: number) {
    return this.commentsData
      .filter((c) => c.postId === postId)
      .map((c) => ({
        ...c,
        author: this.usersData.find((u) => u.id === c.userId),
      }));
  }

  async createComment(
    comment: InsertComment & { postId: number; userId: string },
  ) {
    const newComment = { ...comment, id: this.nextId++, createdAt: new Date() };
    this.commentsData.push(newComment);
    return {
      ...newComment,
      author: this.usersData.find((u) => u.id === comment.userId),
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.usersData.find((u) => u.email === email);
  }
}

export const storage = new MemoryStorage();
