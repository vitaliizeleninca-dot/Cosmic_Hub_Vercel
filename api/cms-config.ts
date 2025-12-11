import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs20.x"
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return res.status(200).json({
    backend: {
      name: "github",
      repo: "vitaliizeleninca-dot/Cosmic-Inspirations-website-project",
      branch: "main",
      auth_endpoint: "api/auth",
      auth_scope: "repo",
    },
    media_folder: "public/uploads",
    public_path: "/uploads",
    publish_mode: "editorial_workflow",
    display_url: "https://www.alphaross.com",
    show_preview_links: true,
    collections: [
      {
        name: "menu",
        label: "Menu Content",
        folder: "data",
        create: false,
        files: [
          {
            name: "menu",
            label: "Menu Items",
            file: "data/menu.yml",
            fields: [
              {
                label: "Podcast Videos",
                name: "podcast_videos",
                widget: "list",
                fields: [
                  { label: "Title", name: "title", widget: "string" },
                  {
                    label: "YouTube URL",
                    name: "youtube_url",
                    widget: "string",
                  },
                  {
                    label: "Active",
                    name: "active",
                    widget: "boolean",
                    default: true,
                  },
                ],
              },
              {
                label: "Cosmic Ambient Videos",
                name: "cosmic_ambient_videos",
                widget: "list",
                fields: [
                  { label: "Title", name: "title", widget: "string" },
                  {
                    label: "YouTube URL",
                    name: "youtube_url",
                    widget: "string",
                  },
                  {
                    label: "Active",
                    name: "active",
                    widget: "boolean",
                    default: true,
                  },
                ],
              },
              {
                label: "Feel Cosmos Videos",
                name: "feel_cosmos_videos",
                widget: "list",
                fields: [
                  { label: "Title", name: "title", widget: "string" },
                  {
                    label: "YouTube URL",
                    name: "youtube_url",
                    widget: "string",
                  },
                  {
                    label: "Active",
                    name: "active",
                    widget: "boolean",
                    default: true,
                  },
                ],
              },
              {
                label: "NFT Collections Videos",
                name: "nft_videos",
                widget: "list",
                fields: [
                  { label: "Title", name: "title", widget: "string" },
                  {
                    label: "YouTube URL",
                    name: "youtube_url",
                    widget: "string",
                  },
                  {
                    label: "Active",
                    name: "active",
                    widget: "boolean",
                    default: true,
                  },
                ],
              },
              {
                label: "NFT Collections (Grid)",
                name: "nft_collections",
                widget: "list",
                fields: [
                  { label: "Collection Name", name: "name", widget: "string" },
                  { label: "Collection URL", name: "url", widget: "string" },
                  {
                    label: "Image URL",
                    name: "image_url",
                    widget: "string",
                    required: false,
                  },
                  {
                    label: "Active",
                    name: "active",
                    widget: "boolean",
                    default: true,
                  },
                ],
              },
              {
                label: "Social Links",
                name: "social_links",
                widget: "object",
                fields: [
                  {
                    label: "Twitter",
                    name: "twitter",
                    widget: "string",
                    required: false,
                  },
                  {
                    label: "YouTube",
                    name: "youtube",
                    widget: "string",
                    required: false,
                  },
                  {
                    label: "Threads",
                    name: "threads",
                    widget: "string",
                    required: false,
                  },
                  {
                    label: "Facebook",
                    name: "facebook",
                    widget: "string",
                    required: false,
                  },
                  {
                    label: "Telegram",
                    name: "telegram",
                    widget: "string",
                    required: false,
                  },
                  {
                    label: "TikTok",
                    name: "tiktok",
                    widget: "string",
                    required: false,
                  },
                  {
                    label: "Discord",
                    name: "discord",
                    widget: "string",
                    required: false,
                  },
                  {
                    label: "LinkedIn",
                    name: "linkedin",
                    widget: "string",
                    required: false,
                  },
                  {
                    label: "Contra",
                    name: "contra",
                    widget: "string",
                    required: false,
                  },
                  {
                    label: "Webbie",
                    name: "webbie",
                    widget: "string",
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
}
