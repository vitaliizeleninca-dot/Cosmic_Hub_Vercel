import { X } from "lucide-react";

interface HeroModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export default function HeroModal({
  isOpen,
  title,
  content,
  onClose,
}: HeroModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-cosmic-dark border border-cosmic-purple/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-cosmic-purple/20 bg-cosmic-dark">
          <h2 className="text-2xl font-bold text-cosmic-purple">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
