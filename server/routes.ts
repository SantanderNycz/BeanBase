import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import {
  setupAuth,
  registerAuthRoutes,
  isAuthenticated,
  authStorage,
} from "./auth";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Coffee Shops API
  app.get(api.coffeeShops.list.path, async (req, res) => {
    const userId = (req.user as any)?.id;
    const shops = await storage.getCoffeeShops(userId);
    res.json(shops);
  });

  app.get(api.coffeeShops.get.path, async (req, res) => {
    const userId = (req.user as any)?.id;
    const shop = await storage.getCoffeeShop(Number(req.params.id), userId);
    if (!shop) {
      return res.status(404).json({ message: "Coffee shop not found" });
    }
    res.json(shop);
  });

  app.post(api.coffeeShops.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.coffeeShops.create.input.parse(req.body);
      const shop = await storage.createCoffeeShop(input);
      res.status(201).json(shop);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.post(
    api.coffeeShops.toggleFavorite.path,
    isAuthenticated,
    async (req, res) => {
      const userId = (req.user as any).id;
      const shopId = Number(req.params.id);
      const shop = await storage.getCoffeeShop(shopId);
      if (!shop) {
        return res.status(404).json({ message: "Coffee shop not found" });
      }
      const isFavorite = await storage.toggleFavoriteCoffeeShop(shopId, userId);
      res.json({ isFavorite });
    },
  );

  // Posts API
  app.get(api.posts.list.path, async (req, res) => {
    const userId = (req.user as any)?.id;
    try {
      const queryParams = api.posts.list.input?.parse(req.query) || {};
      const posts = await storage.getPosts({
        coffeeShopId: queryParams.coffeeShopId
          ? Number(queryParams.coffeeShopId)
          : undefined,
        userId: queryParams.userId,
        favoritesOnly: queryParams.favoritesOnly === "true",
        currentUserId: userId,
      });
      res.json(posts);
    } catch (err) {
      res.json(await storage.getPosts({ currentUserId: userId }));
    }
  });

  app.post(api.posts.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.posts.create.input.parse(req.body);
      const userId = (req.user as any).id;
      const shop = await storage.getCoffeeShop(input.coffeeShopId);
      if (!shop) {
        return res.status(400).json({ message: "Coffee shop not found" });
      }
      const post = await storage.createPost({ ...input, userId });
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.post(api.posts.toggleLike.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const postId = Number(req.params.id);
    try {
      const isLiked = await storage.toggleLikePost(postId, userId);
      if (isLiked) {
        const post = await storage.getPost(postId);
        if (post && post.userId !== userId) {
          await storage.createNotification({
            userId: post.userId,
            actorId: userId,
            type: "like",
            postId: String(postId),
          });
        }
      }
      res.json({ isLiked });
    } catch (err) {
      return res.status(404).json({ message: "Post not found" });
    }
  });

  app.delete("/api/posts/:id", isAuthenticated, async (req, res) => {
    const postId = Number(req.params.id);
    const userId = (req.user as any).id;
    try {
      await storage.deletePost(postId, userId);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ message: "Post not found" });
    }
  });

  app.delete(
    "/api/posts/:postId/comments/:id",
    isAuthenticated,
    async (req, res) => {
      const commentId = Number(req.params.id);
      const userId = (req.user as any).id;
      try {
        await storage.deleteComment(commentId, userId);
        res.status(204).send();
      } catch {
        res.status(404).json({ message: "Comment not found" });
      }
    },
  );

  // Comments API
  app.get(api.comments.list.path, async (req, res) => {
    const postId = Number(req.params.postId);
    const comments = await storage.getComments(postId);
    res.json(comments);
  });

  app.post(api.comments.create.path, isAuthenticated, async (req, res) => {
    try {
      const postId = Number(req.params.postId);
      const userId = (req.user as any).id;
      const input = api.comments.create.input.parse(req.body);
      const comment = await storage.createComment({ ...input, postId, userId });
      const post = await storage.getPost(postId);
      if (post && post.userId !== userId) {
        await storage.createNotification({
          userId: post.userId,
          actorId: userId,
          type: "comment",
          postId: String(postId),
        });
      }
      res.status(201).json(comment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  // Rotas de notificações:
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const notifs = await storage.getNotifications(userId);
    res.json(notifs);
  });

  app.post("/api/notifications/read", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    await storage.markNotificationsRead(userId);
    res.status(204).send();
  });

  app.get("/api/posts/:id", async (req, res) => {
    const postId = Number(req.params.id);
    const userId = (req.user as any)?.id;
    const post = await storage.getPost(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  // Profile
  app.patch("/api/auth/profile", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const { firstName, lastName, profileImageUrl } = req.body;
    const user = await authStorage.upsertUser({
      id: userId,
      firstName,
      lastName,
      profileImageUrl,
      updatedAt: new Date(),
    });
    res.json(user);
  });

  app.post(
    "/api/upload",
    isAuthenticated,
    upload.single("image"),
    async (req, res) => {
      try {
        if (!req.file)
          return res.status(400).json({ message: "No file uploaded" });
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "beanbase",
                transformation: [{ width: 800, crop: "limit" }],
              },
              (err, result) => (err ? reject(err) : resolve(result)),
            )
            .end(req.file!.buffer);
        });
        res.json({ url: result.secure_url });
      } catch (err) {
        res.status(500).json({ message: "Upload failed" });
      }
    },
  );

  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const shops = await storage.getCoffeeShops();
  if (shops.length === 0) {
    await storage.createCoffeeShop({
      name: "The Roasted Bean",
      description:
        "A cozy spot with the best artisan roasts in town. Perfect for working or relaxing.",
      address: "123 Main St, Anytown",
      imageUrl:
        "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
    });
    await storage.createCoffeeShop({
      name: "Espresso Express",
      description: "Quick, delicious coffee and pastries for people on the go.",
      address: "456 Market St, Anytown",
      imageUrl:
        "https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=800",
    });
    await storage.createCoffeeShop({
      name: "Central Perk",
      description:
        "A friendly neighborhood cafe with comfortable couches and live music on weekends.",
      address: "789 Park Ave, Anytown",
      imageUrl:
        "https://images.pexels.com/photos/1998920/pexels-photo-1998920.jpeg?auto=compress&cs=tinysrgb&w=800",
    });
  }
}
