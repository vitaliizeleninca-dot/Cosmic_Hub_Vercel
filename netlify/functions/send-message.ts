import type { Handler } from "@netlify/functions";

const RECIPIENT_EMAIL = "vitalii.zelenin.ca@gmail.com";

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { message, visitorEmail } = JSON.parse(event.body || "{}");

    if (!message || !message.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    if (message.length > 500) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message exceeds 500 characters" }),
      };
    }

    // Send via Formspree (free, no authentication needed for simple form submissions)
    const formData = new FormData();
    formData.append("email", visitorEmail || "noreply@cosmic-hub.com");
    formData.append("message", message.trim());
    formData.append("timestamp", new Date().toISOString());

    const formspreeResponse = await fetch("https://formspree.io/f/xyzqwerty", {
      method: "POST",
      body: formData,
    });

    if (!formspreeResponse.ok) {
      console.error("Formspree error:", formspreeResponse.status);
      throw new Error("Failed to send message via Formspree");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Message sent successfully",
      }),
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to send message",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
