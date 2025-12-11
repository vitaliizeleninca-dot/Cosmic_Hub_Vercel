import { Router } from "express";
import { getLinksFromGitHub, sortLinksByDate } from "../lib/github-client";

const router = Router();

router.get("/api/get-links", async (_req, res) => {
  try {
    const linksData = await getLinksFromGitHub();
    const sortedLinks = sortLinksByDate(linksData.links);
    res.json({ links: sortedLinks, success: true });
  } catch (error) {
    console.error("Error in GET /api/get-links:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch links",
      links: [],
    });
  }
});

export default router;
