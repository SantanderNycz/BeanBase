import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";

declare global {
  namespace Express {
    interface Request {
      user?: { claims: { sub: string } };
    }
  }
}

const setupAuth = (app: Express) => {
  app.use(
    session({
      secret: "local-dev-secret",
      resave: false,
      saveUninitialized: false,
    }),
  );
};

const registerAuthRoutes = (app: any) => {};

const isAuthenticated = (req: any, res: any, next: any) => {
  req.user = { claims: { sub: "local-dev-user" } };
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Setup Authentication First
  await setupAuth(app);
  registerAuthRoutes(app);

  // Rota de auth mock para desenvolvimento local
  app.get("/api/auth/user", (req: any, res) => {
    console.log("AUTH USER ROUTE HIT");
    res.json({
      id: "local-dev-user",
      email: "dev@local.com",
      firstName: "Dev",
      lastName: "User",
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  app.get("/api/logout", (req, res) => {
    res.redirect("/");
  });

  // Coffee Shops API
  app.get(api.coffeeShops.list.path, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
    const shops = await storage.getCoffeeShops(userId);
    res.json(shops);
  });

  app.get(api.coffeeShops.get.path, async (req, res) => {
    const userId = (req.user as any)?.claims?.sub;
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
      const userId = (req.user as any).claims.sub;
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
    const userId = (req.user as any)?.claims?.sub;
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
      res.json(await storage.getPosts({ currentUserId: userId })); // fallback
    }
  });

  app.post(api.posts.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.posts.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;

      // Basic validation for coffee shop existence
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
    const userId = (req.user as any).claims.sub;
    const postId = Number(req.params.id);

    try {
      const isLiked = await storage.toggleLikePost(postId, userId);
      res.json({ isLiked });
    } catch (err) {
      return res.status(404).json({ message: "Post not found" });
    }
  });

  app.delete("/api/posts/:id", isAuthenticated, async (req, res) => {
    const postId = Number(req.params.id);
    const userId = (req.user as any).claims.sub;
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
      const userId = (req.user as any).claims.sub;
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
      const userId = (req.user as any).claims.sub;
      const input = api.comments.create.input.parse(req.body);

      const comment = await storage.createComment({ ...input, postId, userId });
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

  // Seed Database (Call on startup)
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const shops = await storage.getCoffeeShops();
  if (shops.length === 0) {
    const shop1 = await storage.createCoffeeShop({
      name: "The Roasted Bean",
      description:
        "A cozy spot with the best artisan roasts in town. Perfect for working or relaxing.",
      address: "123 Main St, Anytown",
      imageUrl:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    });

    const shop2 = await storage.createCoffeeShop({
      name: "Espresso Express",
      description: "Quick, delicious coffee and pastries for people on the go.",
      address: "456 Market St, Anytown",
      imageUrl:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
    });

    const shop3 = await storage.createCoffeeShop({
      name: "Central Perk",
      description:
        "A friendly neighborhood cafe with comfortable couches and live music on weekends.",
      address: "789 Park Ave, Anytown",
      imageUrl:
        "https://images.unsplash.com/photo-1501339817309-1461ba14ce4c?auto=format&fit=crop&q=80&w=800",
    });
  }
}
