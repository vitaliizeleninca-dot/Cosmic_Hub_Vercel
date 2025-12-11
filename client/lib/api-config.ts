// API Configuration for separate frontend/backend deployment
// In production, set VITE_API_URL to your backend URL (e.g., https://your-backend.railway.app)
// In development, it defaults to empty string (same origin)

export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export function getApiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
