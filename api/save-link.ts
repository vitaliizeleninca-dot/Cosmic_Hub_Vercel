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

const makeGitHubRequest = async (
  path: string,
  method: string = "GET",
  body?: object
) => {
  const token = getGitHubAuth();
  const { owner, repo } = getRepoInfo();
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

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

async function saveLinksToGitHub(linksData: LinksData): Promise<boolean> {
  try {
    const content = Buffer.from(JSON.stringify(linksData, null, 2)).toString(
      "base64"
    );

    let sha: string | undefined;
    try {
      const currentFile = (await makeGitHubRequest("data/links.json")) as any;
      sha = currentFile.sha;
    } catch {
      // File doesn't exist yet
    }

    const payload: any = {
      message: `Update links: ${new Date().toISOString()}`,
      content,
    };

    if (sha) {
      payload.sha = sha;
    }

    await makeGitHubRequest("data/links.json", "PUT", payload);
    return true;
  } catch (error) {
    console.error("Error saving links to GitHub:", error);
    return false;
  }
}

function deduplicateLinks(links: LinksData["links"]): LinksData["links"] {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.url)) return false;
    seen.add(link.url);
    return true;
  });
}

function sortLinksByDate(links: LinksData["links"]): LinksData["links"] {
  return [...links].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.body || {};

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        error: "URL is required and must be a string",
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Invalid URL format",
      });
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
      return res.status(500).json({
        success: false,
        error: "Failed to save link to GitHub",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Link saved successfully",
      link: newLink,
      links: linksData.links,
    });
  } catch (error) {
    console.error("Error in POST /api/save-link:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to save link",
    });
  }
}
