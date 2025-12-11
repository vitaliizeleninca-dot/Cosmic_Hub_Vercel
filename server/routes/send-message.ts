import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

interface MessageData {
  visitorEmail?: string;
  message: string;
  timestamp: string;
}

router.post("/api/send-message", async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, visitorEmail } = req.body as MessageData;

    if (!message || !message.trim()) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    if (message.length > 500) {
      res.status(400).json({ error: "Message exceeds 500 characters" });
      return;
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
        },
      );

      if (!formspreeResponse.ok) {
        console.warn("Formspree submission status:", formspreeResponse.status);
        // Don't fail - Formspree might have rate limits
      }
    } catch (error) {
      // Silently fail - email service not critical
      console.error("Email service error:", error);
    }

    res.status(200).json({
      success: true,
      message: "Message received",
    });
    return;
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({
      error: "Failed to process message",
      details: error instanceof Error ? error.message : "Unknown error",
    });
    return;
  }
});

export default router;
