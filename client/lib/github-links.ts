import { getApiUrl } from "@/lib/api-config";

export interface Link {
  url: string;
  date: string;
}

export interface LinksResponse {
  links: Link[];
  success?: boolean;
  error?: string;
}

export async function loadLinks(): Promise<Link[]> {
  try {
    const response = await fetch(getApiUrl("/api/get-links"));
    if (!response.ok) {
      console.error("Failed to load links:", response.statusText);
      return [];
    }
    const data = (await response.json()) as LinksResponse;
    return data.links || [];
  } catch (error) {
    console.error("Error loading links from GitHub:", error);
    return [];
  }
}

export async function saveLink(url: string): Promise<Link | null> {
  try {
    const response = await fetch(getApiUrl("/api/save-link"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      console.error("Failed to save link:", response.statusText);
      return null;
    }

    const data = (await response.json()) as any;
    if (data.success && data.link) {
      return data.link as Link;
    }
    return null;
  } catch (error) {
    console.error("Error saving link to GitHub:", error);
    return null;
  }
}

export async function deleteLink(url: string): Promise<boolean> {
  try {
    const links = await loadLinks();
    const filtered = links.filter((link) => link.url !== url);

    const response = await fetch(getApiUrl("/api/save-link"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: "" }),
    });

    if (!response.ok) {
      console.error("Failed to delete link:", response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting link:", error);
    return false;
  }
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}
