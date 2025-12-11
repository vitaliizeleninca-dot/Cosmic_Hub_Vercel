import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs20.x"
};

const SAMPLE_NFTS = [
  {
    id: "cosmic-1",
    tokenId: "1",
    name: "Cosmic Nebula #1",
    imageUrl:
      "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=1200&h=1200&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=100&h=100&fit=crop",
  },
  {
    id: "cosmic-2",
    tokenId: "2",
    name: "Stellar Horizon #2",
    imageUrl:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=1200&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=100&h=100&fit=crop",
  },
  {
    id: "cosmic-3",
    tokenId: "3",
    name: "Deep Space Void #3",
    imageUrl:
      "https://images.unsplash.com/photo-1462332420958-a05d1e7413e3?w=1200&h=1200&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1462332420958-a05d1e7413e3?w=100&h=100&fit=crop",
  },
  {
    id: "cosmic-4",
    tokenId: "4",
    name: "Galactic Core #4",
    imageUrl:
      "https://images.unsplash.com/photo-1462332420958-a05d1e7413e3?w=1200&h=1200&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1462332420958-a05d1e7413e3?w=100&h=100&fit=crop",
  },
  {
    id: "cosmic-5",
    tokenId: "5",
    name: "Nebula Dreams #5",
    imageUrl:
      "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=1200&h=1200&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=100&h=100&fit=crop",
  },
  {
    id: "cosmic-6",
    tokenId: "6",
    name: "Cosmic Dust #6",
    imageUrl:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=1200&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=100&h=100&fit=crop",
  },
  {
    id: "cosmic-7",
    tokenId: "7",
    name: "Stellar Lights #7",
    imageUrl:
      "https://images.unsplash.com/photo-1462332420958-a05d1e7413e3?w=1200&h=1200&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1462332420958-a05d1e7413e3?w=100&h=100&fit=crop",
  },
  {
    id: "cosmic-8",
    tokenId: "8",
    name: "Galaxy Genesis #8",
    imageUrl:
      "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=1200&h=1200&fit=crop",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=100&h=100&fit=crop",
  },
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const contractAddress = "KT1KS9HczgmgFuqkSSe3AeZsbu7eyH9MeRXZ";

    // Try to fetch from Objkt API
    try {
      const apiUrl = `https://api.objkt.com/v3/tokens?contract=${contractAddress}&limit=100`;

      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; Cosmic-Hub/1.0)",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const tokens = Array.isArray(data) ? data : data.tokens || [];

        const nfts = tokens
          .filter(
            (token: any) =>
              token.display_uri &&
              (token.display_uri.startsWith("http") ||
                token.display_uri.startsWith("ipfs://"))
          )
          .map((token: any, index: number) => ({
            id: `${token.token_id || index}-${token.contract}`,
            tokenId: token.token_id?.toString() || "",
            name: token.name || token.title || `Token #${token.token_id}`,
            imageUrl: token.display_uri.startsWith("ipfs://")
              ? `https://ipfs.io/ipfs/${token.display_uri.replace("ipfs://", "")}`
              : token.display_uri,
            thumbnailUrl: token.thumbnail_uri
              ? token.thumbnail_uri.startsWith("ipfs://")
                ? `https://ipfs.io/ipfs/${token.thumbnail_uri.replace("ipfs://", "")}`
                : token.thumbnail_uri
              : token.display_uri.startsWith("ipfs://")
                ? `https://ipfs.io/ipfs/${token.display_uri.replace("ipfs://", "")}`
                : token.display_uri,
          }))
          .slice(0, 100);

        if (nfts.length > 0) {
          return res
            .status(200)
            .json({ success: true, count: nfts.length, tokens: nfts });
        }
      }
    } catch (apiErr) {
      console.warn("Objkt API not available, using sample data:", apiErr);
    }

    // Fallback to sample data
    return res.status(200).json({
      success: true,
      count: SAMPLE_NFTS.length,
      tokens: SAMPLE_NFTS,
      note: "Using sample NFT data. To use real Objkt NFTs, ensure the API is accessible.",
    });
  } catch (error) {
    console.error("Error in NFT collection endpoint:", error);
    return res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch NFT collection",
    });
  }
}
