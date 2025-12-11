import type { VercelRequest, VercelResponse } from "@vercel/node";

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
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid 'url' query parameter",
      });
    }

    let fullUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = `https://${url}`;
    }

    const isOpenSea = fullUrl.includes("opensea.io");
    const isObjkt = fullUrl.includes("objkt.com");

    if (!isOpenSea && !isObjkt) {
      return res.status(400).json({
        success: false,
        error: "URL must be from OpenSea (opensea.io) or Objkt (objkt.com)",
      });
    }

    if (isOpenSea) {
      return await handleOpenSeaUrl(fullUrl, res);
    } else if (isObjkt) {
      return await handleObjktUrl(fullUrl, res);
    }
  } catch (error) {
    console.error("Error in collection endpoint:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

async function handleOpenSeaUrl(
  fullUrl: string,
  res: VercelResponse
): Promise<VercelResponse> {
  try {
    let collectionSlug: string | null = null;

    const collectionMatch = fullUrl.match(
      /opensea\.io\/collection\/([a-z0-9\-]+)/i
    );
    if (collectionMatch) {
      collectionSlug = collectionMatch[1];
    }

    if (!collectionSlug) {
      const itemMatch = fullUrl.match(
        /opensea\.io\/(?:assets\/)?(?:[a-z-]+\/)?(?:0x[a-f0-9]+|ethereum)?\/(\d+)/i
      );
      if (itemMatch) {
        try {
          const pageResponse = await fetch(fullUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; Cosmic-Hub/1.0)",
            },
          });

          if (pageResponse.ok) {
            const html = await pageResponse.text();
            const ogImageMatch = html.match(
              /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
            );

            if (ogImageMatch && ogImageMatch[1]) {
              return res.status(200).json({
                success: true,
                imageUrl: ogImageMatch[1],
                collectionUrl: fullUrl,
              });
            }
          }
        } catch (pageErr) {
          console.warn("Could not fetch OpenSea item page:", pageErr);
        }

        return res.status(200).json({
          success: true,
          imageUrl: null,
          collectionUrl: fullUrl,
        });
      }

      try {
        const pageResponse = await fetch(fullUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Cosmic-Hub/1.0)",
          },
        });

        if (pageResponse.ok) {
          const html = await pageResponse.text();
          const ogImageMatch = html.match(
            /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
          );

          if (ogImageMatch && ogImageMatch[1]) {
            return res.status(200).json({
              success: true,
              imageUrl: ogImageMatch[1],
              collectionUrl: fullUrl,
            });
          }
        }
      } catch (pageErr) {
        console.warn("Could not fetch OpenSea page:", pageErr);
      }

      return res.status(200).json({
        success: true,
        imageUrl: null,
        collectionUrl: fullUrl,
      });
    }

    try {
      const apiUrl = `https://api.opensea.io/api/v2/collections/${collectionSlug}`;

      const response = await fetch(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Cosmic-Hub/1.0)",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.image_url || data.imageUrl || null;

        if (imageUrl) {
          return res.status(200).json({
            success: true,
            imageUrl,
            collectionUrl: fullUrl,
            collectionName: data.name || collectionSlug,
          });
        }
      }
    } catch (apiErr) {
      console.warn(
        "OpenSea API not available, trying og:image fallback:",
        apiErr
      );
    }

    const pageResponse = await fetch(fullUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Cosmic-Hub/1.0)",
      },
    });

    if (pageResponse.ok) {
      const html = await pageResponse.text();
      const ogImageMatch = html.match(
        /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
      );

      if (ogImageMatch && ogImageMatch[1]) {
        return res.status(200).json({
          success: true,
          imageUrl: ogImageMatch[1],
          collectionUrl: fullUrl,
        });
      }
    }

    return res.status(200).json({
      success: true,
      imageUrl: null,
      collectionUrl: fullUrl,
      collectionName: collectionSlug,
    });
  } catch (error) {
    console.error("Error fetching OpenSea data:", error);
    return res.status(200).json({
      success: true,
      imageUrl: null,
      collectionUrl: fullUrl,
    });
  }
}

async function handleObjktUrl(
  fullUrl: string,
  res: VercelResponse
): Promise<VercelResponse> {
  try {
    const contractMatch = fullUrl.match(
      /objkt\.com\/collections\/([a-zA-Z0-9]+)/i
    );
    if (!contractMatch) {
      return res.status(400).json({
        success: false,
        error: "Invalid Objkt collection URL format",
      });
    }

    const contractAddress = contractMatch[1];
    let imageUrl: string | null = null;

    try {
      const apiUrl = `https://api.objkt.com/v3/tokens?contract=${contractAddress}&limit=10`;

      const response = await fetch(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Cosmic-Hub/1.0)",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const tokens = Array.isArray(data) ? data : data.tokens || [];

        for (const token of tokens) {
          let uri = token.display_uri || token.thumbnail_uri || token.media;

          if (uri) {
            if (uri.startsWith("ipfs://")) {
              uri = `https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`;
            }
            imageUrl = uri;
            break;
          }
        }
      }
    } catch (apiErr) {
      console.warn("Objkt API v3 failed:", apiErr);
    }

    if (!imageUrl) {
      try {
        const pageResponse = await fetch(fullUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Cosmic-Hub/1.0)",
          },
        });

        if (pageResponse.ok) {
          const html = await pageResponse.text();
          const ogImageMatch = html.match(
            /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
          );

          if (ogImageMatch && ogImageMatch[1]) {
            imageUrl = ogImageMatch[1];
          }
        }
      } catch (pageErr) {
        console.warn("Could not fetch Objkt page:", pageErr);
      }
    }

    return res.status(200).json({
      success: true,
      imageUrl: imageUrl || null,
      collectionUrl: fullUrl,
      collectionName: contractAddress,
    });
  } catch (error) {
    console.error("Error fetching Objkt data:", error);
    const contractMatch = fullUrl.match(
      /objkt\.com\/collections\/([a-zA-Z0-9]+)/i
    );
    return res.status(200).json({
      success: true,
      imageUrl: null,
      collectionUrl: fullUrl,
      collectionName: contractMatch ? contractMatch[1] : "Tezos Collection",
    });
  }
}
