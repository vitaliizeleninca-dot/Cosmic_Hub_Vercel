import type { VercelRequest, VercelResponse } from "@vercel/node";

interface LinksData {
  links: Array<{ url: string; date: string }>;
}

const getGitHubAuth = () => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }
  return token;
};

const getRepoInfo = () => {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!owner || !repo) {
    throw new Error(
      "GITHUB_OWNER and GITHUB_REPO environment variables are required"
    );
  }

  return { owner, repo };
};

const makeGitHubRequest = async (path: string) => {
  const token = getGitHubAuth();
  const { owner, repo } = getRepoInfo();
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${errorData}`);
  }

  return response.json();
};

async function getLinksFromGitHub(): Promise<LinksData> {
  try {
    const data = (await makeGitHubRequest("data/links.json")) as any;
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(content) as LinksData;
  } catch (error) {
    console.error("Error fetching links from GitHub:", error);
    return { links: [] };
  }
}

function sortLinksByDate(links: LinksData["links"]): LinksData["links"] {
  return [...links].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const linksData = await getLinksFromGitHub();
    const sortedLinks = sortLinksByDate(linksData.links);
    return res.status(200).json({ links: sortedLinks, success: true });
  } catch (error) {
    console.error("Error in GET /api/get-links:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch links",
      links: [],
    });
  }
}
