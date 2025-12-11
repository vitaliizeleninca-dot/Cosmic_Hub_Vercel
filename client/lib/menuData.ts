export interface MenuItem {
  title: string;
  youtube_url: string;
  active: boolean;
}

export interface NFTCollection {
  name: string;
  url: string;
  image_url: string;
  active: boolean;
}

export interface SocialLinks {
  twitter?: string;
  youtube?: string;
  threads?: string;
  facebook?: string;
  telegram?: string;
  tiktok?: string;
  discord?: string;
  linkedin?: string;
  contra?: string;
  webbie?: string;
}

export interface MenuData {
  podcast_videos: MenuItem[];
  cosmic_ambient_videos: MenuItem[];
  feel_cosmos_videos: MenuItem[];
  nft_videos: MenuItem[];
  nft_collections: NFTCollection[];
  social_links: SocialLinks;
}

// Simple YAML parser for our specific structure
function parseYaml(yaml: string): MenuData {
  try {
    const lines = yaml.split("\n").filter((l) => l.trim());
    let result: any = {
      podcast_videos: [],
      cosmic_ambient_videos: [],
      feel_cosmos_videos: [],
      nft_videos: [],
      nft_collections: [],
      social_links: {},
    };

    let currentSection = "";
    let currentItem: any = {};
    let currentList: any[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const indent = line.length - line.trimStart().length;

      // Section headers (no indent)
      if (indent === 0 && trimmed.endsWith(":")) {
        if (currentItem && currentList) {
          currentList.push(currentItem);
        }
        currentSection = trimmed.slice(0, -1);
        currentItem = {};
        currentList = result[currentSection] || [];
        if (Array.isArray(result[currentSection])) {
          result[currentSection] = currentList;
        }
        continue;
      }

      // List items (2 spaces)
      if (indent === 2 && trimmed.startsWith("- ")) {
        if (currentItem && Object.keys(currentItem).length > 0) {
          currentList.push(currentItem);
        }
        currentItem = {};
        const kv = trimmed.slice(2).split(":");
        const key = kv[0].trim();
        const value = kv.slice(1).join(":").trim();
        currentItem[key] = parseValue(value);
        continue;
      }

      // Object properties (4 spaces for list items, 2 spaces for objects)
      if ((indent === 4 || indent === 2) && trimmed.includes(":")) {
        const [key, ...valueParts] = trimmed.split(":");
        const value = valueParts.join(":").trim();
        currentItem[key.trim()] = parseValue(value);
      }
    }

    // Push last item
    if (currentItem && Object.keys(currentItem).length > 0) {
      if (Array.isArray(result[currentSection])) {
        currentList.push(currentItem);
        result[currentSection] = currentList;
      } else {
        result[currentSection] = currentItem;
      }
    }

    return result as MenuData;
  } catch (error) {
    console.error("Error parsing YAML:", error);
    return {
      podcast_videos: [],
      cosmic_ambient_videos: [],
      feel_cosmos_videos: [],
      nft_videos: [],
      nft_collections: [],
      social_links: {},
    };
  }
}

function parseValue(value: string): any {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === '""' || value === "''") return "";
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1);
  }
  return value;
}

// Use require for static import
let cachedMenuData: MenuData | null = null;

export async function loadMenuData(): Promise<MenuData> {
  // Return cached data if available
  if (cachedMenuData) {
    return cachedMenuData;
  }

  try {
    // Try to load from the static file
    const response = await fetch("/menu.json");
    if (response.ok) {
      cachedMenuData = await response.json();
      return cachedMenuData;
    }
  } catch (error) {
    console.error("Error loading menu data:", error);
  }

  // Return default/empty structure if loading fails
  return {
    podcast_videos: [],
    cosmic_ambient_videos: [],
    feel_cosmos_videos: [],
    nft_videos: [],
    nft_collections: [],
    social_links: {},
  };
}

export function clearMenuCache() {
  cachedMenuData = null;
}
