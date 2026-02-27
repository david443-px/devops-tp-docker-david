/**
 * API Node.js (version sécurisée) - TP DevSecOps
 * Objectifs : pas de secrets en dur, validation d'entrée, rate limiting, headers sécurité, endpoint health.
 */

require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const app = express();

// ✅ Secret via variable d'environnement (pas dans le code)
const JWT_SECRET = process.env.JWT_SECRET;

// On refuse de démarrer si le secret est absent / trop faible
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be set and at least 32 characters");
  process.exit(1);
}

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS; // à définir dans GitHub Secrets / .env local

if (!ADMIN_PASS) {
  console.warn("WARNING: ADMIN_PASS is not set. Login will always fail until it is provided.");
}

app.use(helmet());
app.use(express.json({ limit: "10kb" })); // ✅ limiter la taille des requêtes

// ✅ Rate limiting sur /api/login (anti brute-force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts" }
});

app.post(
  "/api/login",
  loginLimiter,
  [
    body("username").isString().trim().notEmpty(),
    body("password").isString().notEmpty().isLength({ min: 8 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // ✅ Vérification simple via env (TP) — en prod on utiliserait une BDD + hash
    if (ADMIN_PASS && username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token });
    }

    return res.status(401).json({ error: "Invalid credentials" });
  }
);

// ✅ Endpoint de santé (pour Docker healthcheck)
app.get("/health", (_req, res) => res.json({ status: "OK" }));

// ❌ Pas de debug en production
if ((process.env.NODE_ENV || "production") !== "production") {
  app.get("/debug", (_req, res) => res.json({ message: "Debug mode" }));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Secure server running on port ${PORT}`));
