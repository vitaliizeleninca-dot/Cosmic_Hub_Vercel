import { useEffect, useState } from "react";

export default function AdminCMS() {
  const [status, setStatus] = useState<string>("Loading Decap CMS...");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const initializeCMS = async () => {
      try {
        // Load Decap CMS
        const cmsScript = document.createElement("script");
        cmsScript.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
        cmsScript.async = true;

        cmsScript.onload = () => {
          if (!mounted) return;

          setStatus("Configuring CMS...");

          // Wait for CMS to be available
          const waitForCMS = setInterval(() => {
            if (window.CMS) {
              clearInterval(waitForCMS);

              if (!mounted) return;

              try {
                // Initialize CMS with inline config
                window.CMS.init({
                  config: {
                    backend: {
                      name: "github",
                      repo: "vitaliizeleninca-dot/Cosmic-Inspirations-website-project",
                      branch: "main",
                      auth_endpoint: "api/auth",
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
                                  {
                                    label: "Title",
                                    name: "title",
                                    widget: "string",
                                  },
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
                                  {
                                    label: "Title",
                                    name: "title",
                                    widget: "string",
                                  },
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
                                  {
                                    label: "Title",
                                    name: "title",
                                    widget: "string",
                                  },
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
                                  {
                                    label: "Title",
                                    name: "title",
                                    widget: "string",
                                  },
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
                                  {
                                    label: "Collection Name",
                                    name: "name",
                                    widget: "string",
                                  },
                                  {
                                    label: "Collection URL",
                                    name: "url",
                                    widget: "string",
                                  },
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
                  },
                });

                setStatus("");
              } catch (err) {
                if (mounted) {
                  setError(
                    `Failed to initialize CMS: ${err instanceof Error ? err.message : "Unknown error"}`,
                  );
                  console.error("CMS initialization error:", err);
                }
              }
            }
          }, 100);

          // Timeout after 10 seconds
          const timeout = setTimeout(() => {
            clearInterval(waitForCMS);
            if (mounted) {
              setError("CMS failed to load. Please check console for details.");
            }
          }, 10000);

          return () => {
            clearInterval(waitForCMS);
            clearTimeout(timeout);
          };
        };

        cmsScript.onerror = () => {
          if (mounted) {
            setError("Failed to load Decap CMS library");
            console.error("Failed to load CMS script");
          }
        };

        document.body.appendChild(cmsScript);
      } catch (err) {
        if (mounted) {
          setError(
            `Setup error: ${err instanceof Error ? err.message : "Unknown error"}`,
          );
          console.error("CMS setup error:", err);
        }
      }
    };

    initializeCMS();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "500px" }}>
        {error ? (
          <>
            <div
              style={{
                fontSize: "32px",
                marginBottom: "16px",
                color: "#dc3545",
              }}
            >
              ⚠️
            </div>
            <h2 style={{ color: "#dc3545" }}>CMS Error</h2>
            <p style={{ color: "#666", marginBottom: "16px" }}>{error}</p>
            <p style={{ fontSize: "14px", color: "#999" }}>
              Check your browser console (F12) for more details.
            </p>
            <details style={{ marginTop: "20px", textAlign: "left" }}>
              <summary style={{ cursor: "pointer", color: "#666" }}>
                Troubleshooting Tips
              </summary>
              <ul style={{ fontSize: "12px", color: "#666" }}>
                <li>Ensure GitHub OAuth credentials are set</li>
                <li>Check that admin/config.yml is accessible</li>
                <li>Clear browser cache and reload</li>
                <li>Try in incognito/private mode</li>
                <li>Check Vercel deployment logs</li>
              </ul>
            </details>
          </>
        ) : status ? (
          <>
            <div
              style={{
                fontSize: "32px",
                marginBottom: "16px",
                animation: "spin 1s linear infinite",
              }}
            >
              ⚙️
            </div>
            <h2>Loading Decap CMS</h2>
            <p style={{ color: "#666" }}>{status}</p>
            <p style={{ fontSize: "12px", color: "#999", marginTop: "16px" }}>
              This may take a moment...
            </p>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </>
        ) : null}
      </div>
    </div>
  );
}

declare global {
  interface Window {
    CMS: any;
  }
}
