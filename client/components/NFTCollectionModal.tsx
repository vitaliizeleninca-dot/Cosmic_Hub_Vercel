import { useState, useRef } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface NFTCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionUrl: string;
  collectionName?: string;
}

export default function NFTCollectionModal({
  isOpen,
  onClose,
  collectionUrl,
  collectionName = "NFT Collection",
}: NFTCollectionModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = async () => {
    if (!iframeContainerRef.current) return;

    try {
      if (!isFullscreen) {
        await iframeContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // Listen for fullscreen changes
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      setIsFullscreen(false);
    }
  };

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
        aria-labelledby="nft-modal-title"
        onFullscreenChange={handleFullscreenChange}
      >
        <div
          className={`bg-cosmic-dark/95 border border-cosmic-purple/30 rounded-2xl shadow-2xl cosmic-glow-lg flex flex-col overflow-hidden transition-all duration-300 ${
            isFullscreen
              ? "fixed inset-0 w-screen h-screen rounded-none"
              : "w-full max-w-6xl max-h-[90vh]"
          }`}
          ref={iframeContainerRef}
        >
          {/* Header */}
          <div className="border-b border-cosmic-purple/20 p-4 sm:p-6 flex items-center justify-between bg-cosmic-dark/50 backdrop-blur-sm sticky top-0 z-10">
            <h2
              id="nft-modal-title"
              className="text-lg sm:text-2xl font-bold text-cosmic-purple truncate"
            >
              {collectionName}
            </h2>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleFullscreen}
                className="p-2 text-gray-300 hover:text-cosmic-purple transition rounded-lg hover:bg-cosmic-purple/10"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-300 hover:text-cosmic-purple transition rounded-lg hover:bg-cosmic-purple/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Content - iFrame */}
          <div
            className={`flex-1 overflow-hidden ${
              isFullscreen ? "h-[calc(100vh-80px)]" : ""
            }`}
          >
            <iframe
              src={collectionUrl}
              title={collectionName}
              className="w-full h-full border-0"
              allow="payment;usb;autoplay;clipboard-read;clipboard-write"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-popups-to-escape-sandbox"
            />
          </div>

          {/* Footer Info */}
          {!isFullscreen && (
            <div className="border-t border-cosmic-purple/20 p-4 bg-cosmic-purple/5 text-xs sm:text-sm text-gray-400 flex items-center justify-between">
              <a
                href={collectionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cosmic-purple hover:text-cosmic-purple/80 transition truncate"
                title={collectionUrl}
              >
                {collectionUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
