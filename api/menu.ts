import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface MenuItem {
  title: string;
  youtube_url: string;
  active: boolean;
}

interface NFTCollection {
  name: string;
  url: string;
  image_url: string;
  active: boolean;
}

interface SocialLinks {
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

interface MenuData {
  podcast_videos: MenuItem[];
  cosmic_ambient_videos: MenuItem[];
  feel_cosmos_videos: MenuItem[];
  nft_videos: MenuItem[];
  nft_collections: NFTCollection[];
  social_links: SocialLinks;
}

const getDefaultMenuData = (): MenuData => ({
  podcast_videos: [
    {
      title: "AI Art Podcast Episode 1",
      youtube_url: "https://www.youtube.com/embed/jgpJVI3tDT0",
      active: true,
    },
    {
      title: "AI Art Podcast Episode 2",
      youtube_url: "https://www.youtube.com/embed/1La4QzGeaaQ",
      active: true,
    },
    {
      title: "AI Art Podcast Episode 3",
      youtube_url: "https://www.youtube.com/embed/TqOneWeDtFI",
      active: true,
    },
    {
      title: "AI Art Podcast Episode 4",
      youtube_url: "https://www.youtube.com/embed/lFcSrYw-ARY",
      active: true,
    },
  ],
  cosmic_ambient_videos: [
    { title: "Cosmic Ambient 1", youtube_url: "", active: true },
    { title: "Cosmic Ambient 2", youtube_url: "", active: true },
    { title: "Cosmic Ambient 3", youtube_url: "", active: true },
    { title: "Cosmic Ambient 4", youtube_url: "", active: true },
  ],
  feel_cosmos_videos: [
    { title: "Feel the Cosmos 1", youtube_url: "", active: true },
    { title: "Feel the Cosmos 2", youtube_url: "", active: true },
    { title: "Feel the Cosmos 3", youtube_url: "", active: true },
    { title: "Feel the Cosmos 4", youtube_url: "", active: true },
  ],
  nft_videos: [
    { title: "NFT Collections Video 1", youtube_url: "", active: true },
    { title: "NFT Collections Video 2", youtube_url: "", active: true },
    { title: "NFT Collections Video 3", youtube_url: "", active: true },
    { title: "NFT Collections Video 4", youtube_url: "", active: true },
  ],
  nft_collections: [
    { name: "Collection 1", url: "", image_url: "", active: true },
    { name: "Collection 2", url: "", image_url: "", active: true },
    { name: "Collection 3", url: "", image_url: "", active: true },
    { name: "Collection 4", url: "", image_url: "", active: true },
    { name: "Collection 5", url: "", image_url: "", active: true },
    { name: "Collection 6", url: "", image_url: "", active: true },
  ],
  social_links: {
    twitter: "",
    youtube: "",
    threads: "",
    facebook: "",
    telegram: "",
    tiktok: "",
    discord: "",
    linkedin: "",
    contra: "",
    webbie: "",
  },
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Try to load from menu.json in public folder
    const jsonPath = path.join(process.cwd(), "public", "menu.json");
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, "utf-8");
      const data = JSON.parse(content) as MenuData;
      return res.status(200).json(data);
    }

    // Fallback to YAML if JSON doesn't exist
    const yamlPath = path.join(process.cwd(), "data", "menu.yml");
    if (fs.existsSync(yamlPath)) {
      const content = fs.readFileSync(yamlPath, "utf-8");
      const data = yaml.load(content) as MenuData;
      return res.status(200).json(data);
    }

    // Return default data if neither file exists
    return res.status(200).json(getDefaultMenuData());
  } catch (error) {
    console.error("Error loading menu data:", error);
    return res.status(200).json(getDefaultMenuData());
  }
}
