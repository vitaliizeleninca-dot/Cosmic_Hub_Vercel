import { useState } from "react";
import { Lock } from "lucide-react";

interface PasswordModalProps {
  isOpen: boolean;
  onSubmit: (password: string) => void;
  onCancel: () => void;
  errorMessage?: string;
}

export default function PasswordModal({
  isOpen,
  onSubmit,
  onCancel,
  errorMessage,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSubmit(password);
    setPassword("");
  };

  const handleCancel = () => {
    setPassword("");
    onCancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-cosmic-dark border border-cosmic-purple/50 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-cosmic-purple/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-cosmic-purple" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-cosmic-purple mb-2">
            Welcome to Cosmic Hub
          </h2>

          <p className="text-center text-gray-400 mb-6">
            Enter the password to access the Cosmic Hub
          </p>

          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-cosmic-dark border border-cosmic-purple/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cosmic-purple transition"
              autoFocus
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-gray-100 hover:border-gray-400 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-cosmic-purple text-white rounded-lg hover:bg-cosmic-purple/80 transition font-medium"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
