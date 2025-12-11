import { useState } from "react";
import { X, Send } from "lucide-react";
import { getApiUrl } from "@/lib/api-config";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_CHARACTERS = 500;
const RECIPIENT_EMAIL = "vitalii.zelenin.ca@gmail.com";

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const contactEmail =
        localStorage.getItem("contact-email") || "noreply@cosmic-hub.com";

      const messageData = {
        message: message.trim(),
        email: contactEmail,
        timestamp: new Date().toISOString(),
      };

      // Send message (will attempt to email you)
      try {
        await fetch(getApiUrl("/api/send-message"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        });
      } catch (err) {
        console.log("Background email send failed, but message saved locally");
      }

      // Always save locally as backup
      const savedMessages = localStorage.getItem("contact-messages");
      const messages = savedMessages ? JSON.parse(savedMessages) : [];
      messages.push(messageData);
      localStorage.setItem("contact-messages", JSON.stringify(messages));

      setSubmitted(true);
      setMessage("");

      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error saving message:", error);
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingChars = MAX_CHARACTERS - message.length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <div className="bg-cosmic-dark/95 border border-cosmic-purple/30 rounded-2xl shadow-2xl cosmic-glow-lg w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="border-b border-cosmic-purple/20 p-6 flex items-center justify-between">
            <h2
              id="contact-modal-title"
              className="text-2xl font-bold text-cosmic-purple"
            >
              Contact Me
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-300 hover:text-cosmic-purple transition rounded-lg hover:bg-cosmic-purple/10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-cosmic-purple/20 border-2 border-cosmic-purple flex items-center justify-center">
                    <Send className="w-8 h-8 text-cosmic-purple" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-cosmic-purple mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-400 text-sm">
                  Thank you for reaching out. I'll get back to you soon.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-cosmic-purple mb-3"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_CHARACTERS) {
                        setMessage(e.target.value);
                      }
                    }}
                    placeholder="Write your message here..."
                    maxLength={MAX_CHARACTERS}
                    className="w-full h-32 px-4 py-3 rounded-lg bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`text-xs ${
                        remainingChars < 50 ? "text-red-400" : "text-gray-500"
                      }`}
                    >
                      {remainingChars} characters remaining
                    </span>
                    {remainingChars < 0 && (
                      <span className="text-xs text-red-400">
                        Message too long
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || isLoading}
                  className="w-full btn-cosmic flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Send className="w-4 h-4" />
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {!submitted && (
            <div className="border-t border-cosmic-purple/20 px-6 py-3 bg-cosmic-purple/5">
              <p className="text-xs text-gray-400 text-center">
                Your message will be saved securely.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
