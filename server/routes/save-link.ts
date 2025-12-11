import { Router } from "express";
import type { Request, Response } from "express";
import {
  getLinksFromGitHub,
  saveLinksToGitHub,
  deduplicateLinks,
  sortLinksByDate,
} from "../lib/github-client";

interface SaveLinkRequest extends Request {
  body: {
    url: string;
  };
}

const router = Router();

router.post("/api/save-link", async (req: SaveLinkRequest, res: Response): Promise<void> => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      res.status(400).json({
        success: false,
        error: "URL is required and must be a string",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      res.status(400).json({
        success: false,
        error: "Invalid URL format",
      });
      return;
    }

    // Get current links from GitHub
    const linksData = await getLinksFromGitHub();

    // Add new link with current timestamp
    const newLink = {
      url,
      date: new Date().toISOString(),
    };

    linksData.links.push(newLink);

    // Remove duplicates and sort
    linksData.links = deduplicateLinks(linksData.links);
    linksData.links = sortLinksByDate(linksData.links);

    // Save back to GitHub
    const success = await saveLinksToGitHub(linksData);

    if (!success) {
      res.status(500).json({
        success: false,
        error: "Failed to save link to GitHub",
      });
      return;
    }

    res.json({
      success: true,
      message: "Link saved successfully",
      link: newLink,
      links: linksData.links,
    });
  } catch (error) {
    console.error("Error in POST /api/save-link:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save link",
    });
  }
});

export default router;
