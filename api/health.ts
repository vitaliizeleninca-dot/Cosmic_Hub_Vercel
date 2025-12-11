import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs20.x"
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
