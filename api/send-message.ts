import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs20.x"
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, visitorEmail } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: "Message exceeds 500 characters" });
    }

    const messageData = {
      email: visitorEmail || "noreply@cosmic-hub.com",
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Send via Formspree (free form submission service)
    try {
      const formData = new URLSearchParams();
      formData.append("email", messageData.email);
      formData.append("message", messageData.message);
      formData.append("timestamp", messageData.timestamp);

      const formspreeResponse = await fetch(
        "https://formspree.io/f/xyzqwerty",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!formspreeResponse.ok) {
        console.warn("Formspree submission status:", formspreeResponse.status);
      }
    } catch (error) {
      console.error("Email service error:", error);
    }

    return res.status(200).json({
      success: true,
      message: "Message received",
    });
  } catch (error) {
    console.error("Error processing message:", error);
    return res.status(500).json({
      error: "Failed to process message",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
