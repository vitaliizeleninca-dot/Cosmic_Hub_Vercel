import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs20.x"
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { videoId } = req.query;

    if (!videoId || typeof videoId !== "string") {
      return res.status(400).json({ error: "Missing or invalid videoId" });
    }

    // Validate videoId format
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return res.status(400).json({ error: "Invalid videoId format" });
    }

    // Try to fetch video info from noembed.com (no API key required)
    try {
      const noembed = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
      );
      if (noembed.ok) {
        const data = await noembed.json();

        if (data.duration) {
          const minutes = Math.floor(data.duration / 60);
          const seconds = Math.floor(data.duration % 60);
          const formattedDuration = `${minutes}:${String(seconds).padStart(2, "0")}`;

          return res.status(200).json({
            success: true,
            videoId,
            duration: data.duration,
            formattedDuration,
            title: data.title || "Unknown",
          });
        }
      }
    } catch (e) {
      console.warn("noembed.com request failed:", e);
    }

    // Try YouTube oEmbed endpoint
    try {
      const oembed = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );

      if (oembed.ok) {
        const data = await oembed.json();
        const estimatedDuration = 300;
        const minutes = Math.floor(estimatedDuration / 60);
        const seconds = Math.floor(estimatedDuration % 60);

        return res.status(200).json({
          success: true,
          videoId,
          duration: estimatedDuration,
          formattedDuration: `${minutes}:${String(seconds).padStart(2, "0")}`,
          title: data.title || "Unknown",
          note: "Duration estimated (API limitation)",
        });
      }
    } catch (e) {
      console.warn("oEmbed request failed:", e);
    }

    // Fallback: return default
    return res.status(200).json({
      success: true,
      videoId,
      duration: 300,
      formattedDuration: "5:00",
      note: "Using default duration",
    });
  } catch (error) {
    console.error("Error fetching YouTube duration:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch video information",
    });
  }
}
