import { useEffect, useState } from "react";
import {
  X,
  Youtube,
  Instagram,
  Facebook,
  Send,
  MessageCircle,
  Music,
  Linkedin,
  Briefcase,
} from "lucide-react";

const WebbieSocialIcon = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center font-bold text-lg ${className}`}>
    W
  </div>
);

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState([
    { name: "X", icon: X, url: "#", label: "X (Twitter)", storageKey: "twitter" },
    { name: "YouTube", icon: Youtube, url: "#", label: "YouTube", storageKey: "youtube" },
    { name: "Instagram", icon: Instagram, url: "#", label: "Instagram", storageKey: "instagram" },
    { name: "Threads", icon: MessageCircle, url: "#", label: "Threads", storageKey: "threads", isCustom: true },
    { name: "Facebook", icon: Facebook, url: "#", label: "Facebook", storageKey: "facebook" },
    { name: "Telegram", icon: Send, url: "#", label: "Telegram", storageKey: "telegram" },
    { name: "TikTok", icon: Music, url: "#", label: "TikTok", storageKey: "tiktok", isCustom: true },
    { name: "Discord", icon: MessageCircle, url: "#", label: "Discord", storageKey: "discord", isCustom: true },
    { name: "LinkedIn", icon: Linkedin, url: "#", label: "LinkedIn", storageKey: "linkedin", isCustom: true },
    { name: "Contra", icon: Briefcase, url: "#", label: "Contra", storageKey: "contra", isCustom: true },
    { name: "Webbie Social", icon: WebbieSocialIcon, url: "#", label: "Webbie Social", storageKey: "webbie", isCustom: true },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("social-links");
      const savedSocialLinks = saved ? JSON.parse(saved) : {};

      setSocialLinks(prevLinks =>
        prevLinks.map(link => ({
          ...link,
          url: savedSocialLinks[link.storageKey] || "#",
        }))
      );
    } catch (error) {
      console.error("Failed to load social links:", error);
    }
  }, []);

  return (
    <footer className="border-t border-cosmic-purple/20 bg-cosmic-dark/50 backdrop-blur-sm py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Icons Section */}
        <div className="flex flex-col items-center gap-8">
          {/* Circular Icon Grid */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              const isActive = social.url !== "#";
              return (
                <a
                  key={social.name}
                  href={social.url}
                  title={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-cosmic-purple/10 border border-cosmic-purple/30 hover:border-cosmic-purple hover:bg-cosmic-purple/20 hover:cosmic-glow cursor-pointer"
                      : "bg-cosmic-purple/5 border border-cosmic-purple/20 opacity-50 cursor-not-allowed"
                  }`}
                  aria-label={social.label}
                  onClick={(e) => {
                    if (!isActive) {
                      e.preventDefault();
                    }
                  }}
                >
                  <IconComponent className={`w-5 h-5 transition-colors duration-300 ${
                    isActive
                      ? "text-cosmic-purple group-hover:text-gray-100"
                      : "text-cosmic-purple/50"
                  }`} />
                  {isActive && (
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {social.label}
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-cosmic-purple/50 to-transparent" />

          {/* Footer Text */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              <p>
                © 2026 Cosmic Hub. Journey through the cosmos
                responsibly
              </p>
            </p>
            <p className="text-gray-500 text-xs mt-2">
              <p>Where art, music, and technology transcend reality</p>
              <p>
                Artistic reconstructions • Educational &amp; cultural
                purpose only • Historical tribute
              </p>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
