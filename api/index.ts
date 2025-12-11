import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs20.x"
};

// This file is kept for backwards compatibility
// All API routes are now in separate files in /api folder

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return res.status(200).json({
    message: "API is running",
    endpoints: [
      "/api/ping",
      "/api/demo",
      "/api/health",
      "/api/menu",
      "/api/get-links",
      "/api/save-link",
      "/api/send-message",
      "/api/nft-collection",
      "/api/youtube-duration",
      "/api/opensea-collection",
    ],
  });
}
