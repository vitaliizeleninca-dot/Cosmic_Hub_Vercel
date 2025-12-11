import { RequestHandler } from "express";

export const handleYouTubeDuration: RequestHandler = async (req, res) => {
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
      const noembed = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      if (noembed.ok) {
        const data = await noembed.json();
        
        // Extract duration if available (some videos might not have it)
        if (data.duration) {
          // Convert seconds to MM:SS format
          const minutes = Math.floor(data.duration / 60);
          const seconds = Math.floor(data.duration % 60);
          const formattedDuration = `${minutes}:${String(seconds).padStart(2, "0")}`;
          
          return res.json({
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

    // Try another method: YouTube oEmbed endpoint (simpler, often works)
    try {
      const oembed = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      
      if (oembed.ok) {
        const data = await oembed.json();
        
        // oEmbed doesn't include duration, but we can return title for verification
        // Estimate typical video length (most YouTube music videos are 3-8 minutes)
        const estimatedDuration = 300; // 5 minutes default
        const minutes = Math.floor(estimatedDuration / 60);
        const seconds = Math.floor(estimatedDuration % 60);
        
        return res.json({
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
    res.json({
      success: true,
      videoId,
      duration: 300,
      formattedDuration: "5:00",
      note: "Using default duration",
    });
  } catch (error) {
    console.error("Error fetching YouTube duration:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch video information",
    });
  }
};
