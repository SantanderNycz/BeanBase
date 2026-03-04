import type { Express, RequestHandler } from "express";
import session from "express-session";
import { authStorage } from "./storage";

export function getSession() {
  return session({
    secret: process.env.SESSION_SECRET || "local-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // false para HTTP local
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  });
}

export async function setupAuth(app: Express) {
  app.use(getSession());
  // Cria utilizador mock para desenvolvimento local
  await authStorage.upsertUser({
    id: "local-dev-user",
    email: "dev@local.com",
    firstName: "Dev",
    lastName: "User",
    profileImageUrl: null,
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  // Mock de utilizador autenticado para desenvolvimento local
  (req as any).user = { claims: { sub: "local-dev-user" } };
  next();
};
