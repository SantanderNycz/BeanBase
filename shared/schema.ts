import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth";
import { users } from "./models/auth";

export const coffeeShops = pgTable("coffee_shops", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  coffeeShopId: integer("coffee_shop_id")
    .notNull()
    .references(() => coffeeShops.id),
  content: text("content").notNull(),
  photos: jsonb("photos").$type<string[]>(), // Array of up to 4 photo URLs
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const likes = pgTable(
  "likes",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.postId, table.userId] })],
);

export const favorites = pgTable(
  "favorites",
  {
    coffeeShopId: integer("coffee_shop_id")
      .notNull()
      .references(() => coffeeShops.id),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.coffeeShopId, table.userId] })],
);

// Relations
export const coffeeShopsRelations = relations(coffeeShops, ({ many }) => ({
  posts: many(posts),
  favorites: many(favorites),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  coffeeShop: one(coffeeShops, {
    fields: [posts.coffeeShopId],
    references: [coffeeShops.id],
  }),
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  favorites: many(favorites),
}));

// Base Schemas
export const insertCoffeeShopSchema = createInsertSchema(coffeeShops).omit({
  id: true,
  createdAt: true,
});
export const insertPostSchema = createInsertSchema(posts)
  .omit({ id: true, userId: true, createdAt: true })
  .extend({
    photos: z.array(z.string()).max(4).optional(),
  });
export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Types
export type CoffeeShop = typeof coffeeShops.$inferSelect;
export type InsertCoffeeShop = z.infer<typeof insertCoffeeShopSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Like = typeof likes.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;

export type CoffeeShopResponse = CoffeeShop & {
  isFavorite?: boolean;
  favoritesCount?: number;
};

export type PostResponse = Post & {
  author?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
  coffeeShop?: CoffeeShop;
  commentsCount?: number;
  likesCount?: number;
  isLiked?: boolean;
};

export type CommentResponse = Comment & {
  author?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
};
