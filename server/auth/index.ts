import type { Express, RequestHandler } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { authStorage } from "./storage";

export { authStorage };
export type { IAuthStorage } from "./storage";

export function getSession() {
  const MemoryStoreSession = MemoryStore(session);
  return session({
    secret: process.env.SESSION_SECRET || "local-dev-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({ checkPeriod: 86400000 }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL:
            process.env.NODE_ENV === "production"
              ? "https://beanbase.up.railway.app/api/auth/google/callback"
              : "http://localhost:5000/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await authStorage.upsertUser({
              id: `google_${profile.id}`,
              email: profile.emails?.[0]?.value,
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              profileImageUrl: profile.photos?.[0]?.value,
              provider: "google",
              providerId: profile.id,
              emailVerified: true,
            });
            done(null, user);
          } catch (err) {
            done(err);
          }
        },
      ),
    );
  }

  // Local Strategy (email/password)
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await authStorage.getUserByEmail(email);
          if (!user || !user.password) {
            return done(null, false, {
              message: "Email ou password incorretos",
            });
          }
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            return done(null, false, {
              message: "Email ou password incorretos",
            });
          }
          done(null, user);
        } catch (err) {
          done(err);
        }
      },
    ),
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await authStorage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
};

export function registerAuthRoutes(app: Express) {
  // Google OAuth
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => res.redirect("/"),
  );

  // Email/Password - Registo
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email e password são obrigatórios" });
      }
      const existing = await authStorage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email já registado" });
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = await authStorage.upsertUser({
        email,
        firstName,
        lastName,
        password: hashed,
        provider: "local",
        emailVerified: false,
      });
      req.login(user, (err) => {
        if (err)
          return res.status(500).json({ message: "Erro ao fazer login" });
        res.json(user);
      });
    } catch (err) {
      res.status(500).json({ message: "Erro interno" });
    }
  });

  // Email/Password - Login
  app.post(
    "/api/auth/login",
    passport.authenticate("local", { failWithError: true }),
    (err: any, req: any, res: any, next: any) => {
      res.status(401).json({ message: err.message || "Credenciais inválidas" });
    },
  );

  // Utilizador atual
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated())
      return res.status(401).json({ message: "Unauthorized" });
    res.json(req.user);
  });

  // Logout
  app.get("/api/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
  });
}
