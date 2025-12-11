import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBackground?: (imageUrl: string) => void;
}

export default function BackgroundModal({ isOpen, onClose, onSelectBackground }: BackgroundModalProps) {
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [activeBackgroundImages, setActiveBackgroundImages] = useState<boolean[]>([]);
  const [selectedWindowIndex, setSelectedWindowIndex] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("background-images");
      const savedImages = saved ? JSON.parse(saved) : Array(10).fill("");
      setBackgroundImages(savedImages);

      const savedActive = localStorage.getItem("background-images-active");
      const activeImages = savedActive ? JSON.parse(savedActive) : Array(10).fill(false);
      setActiveBackgroundImages(activeImages);
    } catch (error) {
      console.error("Failed to load background images:", error);
      setBackgroundImages(Array(10).fill(""));
      setActiveBackgroundImages(Array(10).fill(false));
    }
  }, [isOpen]);

  const updatePageBackground = (imageUrl: string) => {
    if (imageUrl) {
      document.documentElement.style.setProperty(
        "--bg-image-url",
        `url('${imageUrl}')`
      );
    }
  };

  const handleBackgroundSelect = (imageUrl: string) => {
    if (imageUrl) {
      updatePageBackground(imageUrl);
      onSelectBackground?.(imageUrl);
    }
  };

  const getActiveBackgrounds = () => {
    return backgroundImages
      .map((img, idx) => ({
        index: idx,
        image: img,
        isActive: activeBackgroundImages[idx],
      }))
      .filter((bg) => bg.isActive && bg.image);
  };

  const activeBackgrounds = getActiveBackgrounds();
  const currentBackground =
    selectedWindowIndex < activeBackgrounds.length
      ? activeBackgrounds[selectedWindowIndex]
      : null;

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
        aria-labelledby="modal-title"
      >
        <div className="bg-cosmic-dark/95 border border-cosmic-purple/30 rounded-2xl shadow-2xl cosmic-glow-lg w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-cosmic-purple/20 p-6 flex items-center justify-between">
            <h2
              id="modal-title"
              className="text-2xl font-bold text-cosmic-purple"
            >
              Choose Your Background
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
          <div className="flex-1 overflow-y-auto p-6">
            {activeBackgrounds.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-300 text-lg mb-4">No backgrounds available</p>
                  <p className="text-gray-400 text-sm">
                    Upload background images in the admin panel to see them here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Background Windows Tabs */}
                <div>
                  <h3 className="text-lg font-semibold text-cosmic-purple mb-4">
                    Background Windows ({activeBackgrounds.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {activeBackgrounds.map((bg, displayIdx) => (
                      <button
                        key={bg.index}
                        onClick={() => {
                          setSelectedWindowIndex(displayIdx);
                          handleBackgroundSelect(bg.image);
                        }}
                        className={`group relative aspect-square rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                          selectedWindowIndex === displayIdx
                            ? "border-cosmic-purple cosmic-glow scale-105"
                            : "border-cosmic-purple/40 hover:border-cosmic-purple/70"
                        }`}
                        title={`Window ${bg.index + 1}`}
                        aria-label={`Select Window ${bg.index + 1}`}
                      >
                        <img
                          src={bg.image}
                          alt={`Window ${bg.index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%235522ff' width='100' height='100'/%3E%3C/svg%3E";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-xs font-semibold text-cosmic-purple">
                            Window {bg.index + 1}
                          </span>
                        </div>
                        {selectedWindowIndex === displayIdx && (
                          <div className="absolute inset-0 border-2 border-cosmic-purple animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Preview */}
                {currentBackground && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-cosmic-purple">
                      Preview
                    </h3>
                    <div className="relative rounded-xl overflow-hidden border border-cosmic-purple/30 aspect-video max-h-96">
                      <img
                        src={currentBackground.image}
                        alt={`Window ${currentBackground.index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%235522ff' width='100' height='100'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-cosmic-purple font-semibold text-lg">
                          Window {currentBackground.index + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-cosmic-purple/20 p-4 sm:p-6 bg-cosmic-purple/5">
            <button
              onClick={onClose}
              className="w-full btn-cosmic"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
