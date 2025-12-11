import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleNFTCollection } from "./routes/nft-collection";
import { handleYouTubeDuration } from "./routes/youtube-duration";
import { handleOpenSeaCollection } from "./routes/opensea-collection";
import menuRouter from "./routes/menu";
import cmsConfigRouter from "./routes/cms-config";
import sendMessageRouter from "./routes/send-message";
import getLinksRouter from "./routes/get-links";
import saveLinkRouter from "./routes/save-link";

// CORS configuration for separate frontend/backend deployment
const corsOptions = {
  origin: process.env.FRONTEND_URL || [
    "http://localhost:8080",
    "http://localhost:5173",
    /\.vercel\.app$/,
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/nft-collection", handleNFTCollection);
  app.get("/api/youtube-duration", handleYouTubeDuration);
  app.get("/api/opensea-collection", handleOpenSeaCollection);
  app.use("/", menuRouter);
  app.use("/", cmsConfigRouter);
  app.use("/", sendMessageRouter);
  app.use("/", getLinksRouter);
  app.use("/", saveLinkRouter);

  return app;
}
