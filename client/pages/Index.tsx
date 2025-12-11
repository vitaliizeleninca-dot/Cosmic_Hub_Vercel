import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  SkipForward,
  Music,
  Podcast,
  Sparkles,
  Zap,
} from "lucide-react";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import PlaylistModal from "@/components/PlaylistModal";
import HeroModal from "@/components/HeroModal";
import { getApiUrl } from "@/lib/api-config";

const DEFAULT_COSMIC_VIDEOS = [
  "https://www.youtube.com/embed/jgpJVI3tDT0",
  "https://www.youtube.com/embed/1La4QzGeaaQ",
  "https://www.youtube.com/embed/TqOneWeDtFI",
  "https://www.youtube.com/embed/lFcSrYw-ARY",
];

const DEFAULT_PLAYLIST_VIDEOS = ["", "", "", ""];

export default function Index() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isContactEnabled, setIsContactEnabled] = useState(true);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [playlistType, setPlaylistType] = useState<"cosmic" | "feelCosmos">(
    "cosmic",
  );
  const [selectedBackground, setSelectedBackground] = useState<string>("");
  const [cosmicVideos, setCosmicVideos] = useState<string[]>(
    DEFAULT_COSMIC_VIDEOS,
  );
  const [playlistVideos, setPlaylistVideos] = useState<string[]>(
    DEFAULT_PLAYLIST_VIDEOS,
  );
  const [feelCosmosVideos, setFeelCosmosVideos] = useState<string[]>(
    DEFAULT_PLAYLIST_VIDEOS,
  );
  const [feelCosmosSongs, setFeelCosmosSongs] = useState<
    Array<{ title: string; url: string }>
  >([]);
  const [activeCosmicVideosList, setActiveCosmicVideosList] = useState<
    boolean[]
  >([true, true, true, true]);
  const [activePlaylistVideos, setActivePlaylistVideos] =
    useState<boolean>(true);
  const [activePlaylistSongs, setActivePlaylistSongs] = useState<boolean>(true);
  const [activeFeelCosmosVideosList, setActiveFeelCosmosVideosList] = useState<
    boolean[]
  >([true, true, true, true]);
  const [activeFeelCosmosSongs, setActiveFeelCosmosSongs] =
    useState<boolean>(true);
  const [podcastVideos, setPodcastVideos] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [activePodcastVideosList, setActivePodcastVideosList] = useState<
    boolean[]
  >([true, true, true, true]);
  const [nftVideos, setNftVideos] = useState<string[]>(["", "", "", ""]);
  const [activeNftVideosList, setActiveNftVideosList] = useState<boolean[]>([
    true,
    true,
    true,
    true,
  ]);
  const [nftCollections, setNftCollections] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [nftCollectionImages, setNftCollectionImages] = useState<
    (string | null)[]
  >([null, null, null, null, null, null]);
  const [nftCollectionCustomImages, setNftCollectionCustomImages] = useState<
    string[]
  >(["", "", "", "", "", ""]);
  const [nftCollectionNames, setNftCollectionNames] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [activeNftCollectionsList, setActiveNftCollectionsList] = useState<
    boolean[]
  >([true, true, true, true, true, true]);
  const [cosmicAmbientVideos, setCosmicAmbientVideos] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [activeCosmicAmbientVideosList, setActiveCosmicAmbientVideosList] =
    useState<boolean[]>([false, false, false, false]);
  const [aboutMeText, setAboutMeText] = useState<string>("");
  const [learnMoreText, setLearnMoreText] = useState<string>("");
  const [isAboutMeOpen, setIsAboutMeOpen] = useState<boolean>(false);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState<boolean>(false);
  const [isHeroModalsEnabled, setIsHeroModalsEnabled] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("cosmic-videos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only use non-empty URLs, fallback to defaults for empty ones
        const videos = parsed.map((url: string, index: number) =>
          url.trim() ? convertToEmbedUrl(url) : DEFAULT_COSMIC_VIDEOS[index],
        );
        setCosmicVideos(videos);
      } catch (e) {
        setCosmicVideos(DEFAULT_COSMIC_VIDEOS);
      }
    }

    const savedPlaylist = localStorage.getItem("playlist-videos");
    if (savedPlaylist) {
      try {
        const parsed = JSON.parse(savedPlaylist);
        const videos = parsed
          .map((url: string) => (url.trim() ? convertToEmbedUrl(url) : ""))
          .filter((url: string) => url);
        setPlaylistVideos(videos);
      } catch (e) {
        setPlaylistVideos(DEFAULT_PLAYLIST_VIDEOS);
      }
    }

    const savedFeelCosmosVideos = localStorage.getItem("feel-cosmos-videos");
    if (savedFeelCosmosVideos) {
      try {
        const parsed = JSON.parse(savedFeelCosmosVideos);
        const videos = parsed
          .map((url: string) => (url.trim() ? convertToEmbedUrl(url) : ""))
          .filter((url: string) => url);
        setFeelCosmosVideos(videos);
      } catch (e) {
        setFeelCosmosVideos(DEFAULT_PLAYLIST_VIDEOS);
      }
    }

    const savedFeelCosmosSongs = localStorage.getItem("feel-cosmos-songs");
    if (savedFeelCosmosSongs) {
      try {
        const parsed = JSON.parse(savedFeelCosmosSongs);
        setFeelCosmosSongs(parsed);
      } catch (e) {
        setFeelCosmosSongs([]);
      }
    }

    const savedCosmicVideosListActive = localStorage.getItem(
      "cosmic-videos-list-active",
    );
    if (savedCosmicVideosListActive) {
      setActiveCosmicVideosList(JSON.parse(savedCosmicVideosListActive));
    }

    const savedPlaylistVideosActive = localStorage.getItem(
      "playlist-videos-active",
    );
    if (savedPlaylistVideosActive) {
      setActivePlaylistVideos(JSON.parse(savedPlaylistVideosActive));
    }

    const savedPlaylistSongsActive = localStorage.getItem(
      "playlist-songs-active",
    );
    if (savedPlaylistSongsActive) {
      setActivePlaylistSongs(JSON.parse(savedPlaylistSongsActive));
    }

    const savedFeelCosmosVideosListActive = localStorage.getItem(
      "feel-cosmos-videos-list-active",
    );
    if (savedFeelCosmosVideosListActive) {
      setActiveFeelCosmosVideosList(
        JSON.parse(savedFeelCosmosVideosListActive),
      );
    }

    const savedFeelCosmosSongsActive = localStorage.getItem(
      "feel-cosmos-songs-active",
    );
    if (savedFeelCosmosSongsActive) {
      setActiveFeelCosmosSongs(JSON.parse(savedFeelCosmosSongsActive));
    }

    const savedPodcastVideos = localStorage.getItem("podcast-videos");
    if (savedPodcastVideos) {
      try {
        const parsed = JSON.parse(savedPodcastVideos);
        const videos = parsed.map((url: string) =>
          url.trim() ? convertToEmbedUrl(url) : "",
        );
        setPodcastVideos(videos);
      } catch (e) {
        setPodcastVideos(["", "", "", ""]);
      }
    }

    const savedPodcastVideosListActive = localStorage.getItem(
      "podcast-videos-list-active",
    );
    if (savedPodcastVideosListActive) {
      setActivePodcastVideosList(JSON.parse(savedPodcastVideosListActive));
    }

    const savedNftVideos = localStorage.getItem("nft-videos");
    if (savedNftVideos) {
      try {
        const parsed = JSON.parse(savedNftVideos);
        const videos = parsed.map((url: string) =>
          url.trim() ? convertToEmbedUrl(url) : "",
        );
        setNftVideos(videos);
      } catch (e) {
        setNftVideos(["", "", "", ""]);
      }
    }

    const savedNftVideosListActive = localStorage.getItem(
      "nft-videos-list-active",
    );
    if (savedNftVideosListActive) {
      setActiveNftVideosList(JSON.parse(savedNftVideosListActive));
    }

    const savedNftCollections = localStorage.getItem("nft-collections");
    if (savedNftCollections) {
      try {
        const parsed = JSON.parse(savedNftCollections);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNftCollections(parsed);
        }
      } catch (e) {
        // Keep default values
      }
    }

    const savedNftCollectionCustomImages = localStorage.getItem(
      "nft-collection-custom-images",
    );
    if (savedNftCollectionCustomImages) {
      try {
        const parsed = JSON.parse(savedNftCollectionCustomImages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNftCollectionCustomImages(parsed);
        }
      } catch (e) {
        // Keep default values
      }
    }

    const savedActiveNftCollectionsList = localStorage.getItem(
      "nft-collections-list-active",
    );
    if (savedActiveNftCollectionsList) {
      setActiveNftCollectionsList(JSON.parse(savedActiveNftCollectionsList));
    }

    const savedNftCollectionNames = localStorage.getItem(
      "nft-collection-names",
    );
    if (savedNftCollectionNames) {
      try {
        const parsed = JSON.parse(savedNftCollectionNames);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNftCollectionNames(parsed);
        }
      } catch (e) {
        // Keep default values
      }
    }

    const savedCosmicAmbientVideos = localStorage.getItem(
      "cosmic-ambient-videos",
    );
    if (savedCosmicAmbientVideos) {
      try {
        const parsed = JSON.parse(savedCosmicAmbientVideos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const videos = parsed.map((url: string) =>
            url.trim() ? convertToEmbedUrl(url) : "",
          );
          setCosmicAmbientVideos(videos);
        }
      } catch (e) {
        // Keep default values
      }
    }

    const savedCosmicAmbientActiveList = localStorage.getItem(
      "cosmic-ambient-videos-list-active",
    );
    if (savedCosmicAmbientActiveList) {
      setActiveCosmicAmbientVideosList(
        JSON.parse(savedCosmicAmbientActiveList),
      );
    }

    const savedBg = localStorage.getItem("selected-background");
    if (savedBg) {
      setSelectedBackground(savedBg);
    }

    const savedContactEnabled = localStorage.getItem("contact-enabled");
    if (savedContactEnabled !== null) {
      setIsContactEnabled(savedContactEnabled !== "false");
    }

    const savedAboutMe = localStorage.getItem("hero-about-me-text");
    if (savedAboutMe) {
      setAboutMeText(savedAboutMe);
    }

    const savedLearnMore = localStorage.getItem("hero-learn-more-text");
    if (savedLearnMore) {
      setLearnMoreText(savedLearnMore);
    }

    const savedHeroModalsEnabled = localStorage.getItem("hero-modals-enabled");
    if (savedHeroModalsEnabled !== null) {
      setIsHeroModalsEnabled(savedHeroModalsEnabled !== "false");
    }
  }, []);

  useEffect(() => {
    const fetchCollectionImages = async () => {
      const images: (string | null)[] = [];

      for (const url of nftCollections) {
        if (!url) {
          images.push(null);
          continue;
        }

        try {
          const response = await fetch(
            getApiUrl(`/api/opensea-collection?url=${encodeURIComponent(url)}`),
          );
          if (response.ok) {
            const data = await response.json();
            images.push(data.imageUrl || null);
          } else {
            images.push(null);
          }
        } catch (error) {
          console.error("Error fetching collection image:", error);
          images.push(null);
        }
      }

      setNftCollectionImages(images);
    };

    fetchCollectionImages();
  }, [nftCollections]);

  useEffect(() => {
    if (selectedBackground) {
      document.documentElement.style.setProperty(
        "--bg-image-url",
        `url('${selectedBackground}')`,
      );
      document.documentElement.style.backgroundImage = `url('${selectedBackground}')`;
      document.documentElement.style.backgroundSize = "cover";
      document.documentElement.style.backgroundPosition = "center";
      document.documentElement.style.backgroundAttachment = "fixed";
    } else {
      // Clear background when none selected
      document.documentElement.style.backgroundImage = "none";
      document.documentElement.style.setProperty("--bg-image-url", "none");
    }
  }, [selectedBackground]);

  const convertToEmbedUrl = (url: string): string => {
    if (!url) return "";

    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{10,12})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{10,12})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    return url;
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-cosmic-purple/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
            aria-label="Go to admin panel"
          >
            <Sparkles className="w-8 h-8 text-cosmic-purple animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cosmic-purple to-cosmic-violet bg-clip-text text-transparent">
              Cosmic Hub
            </h1>
          </button>
          <nav className="hidden sm:flex items-center gap-8">
            <a
              href="#podcast"
              className="text-sm text-gray-300 hover:text-cosmic-purple transition"
            >
              AI Art Podcast
            </a>
            <a
              href="#music"
              className="text-sm text-gray-300 hover:text-cosmic-purple transition"
            >
              Cosmic Ambient
            </a>
            <a
              href="#experience"
              className="text-sm text-gray-300 hover:text-cosmic-purple transition"
            >
              Feel the Cosmos
            </a>
            <a
              href="#nft"
              className="text-sm text-gray-300 hover:text-cosmic-purple transition"
            >
              NFT Collections
            </a>
            <a
              href="#my-ai-tools"
              className="text-sm text-gray-300 hover:text-cosmic-purple transition"
            >
              My AI Tools
            </a>
          </nav>
          <div
            className={`flex items-center gap-4 transition-opacity duration-300 ${!isContactEnabled ? "opacity-40" : ""}`}
          >
            <div className="w-px h-6 bg-cosmic-purple/20" />
            <button
              onClick={() => isContactEnabled && setIsContactModalOpen(true)}
              disabled={!isContactEnabled}
              className={`hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isContactEnabled
                  ? "text-cosmic-dark bg-gradient-to-r from-cosmic-purple to-cosmic-violet hover:from-cosmic-violet hover:to-cosmic-purple hover:cosmic-glow cursor-pointer"
                  : "text-gray-400 bg-gray-600 cursor-not-allowed"
              }`}
              aria-label="Contact me"
            >
              Contact Me
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-cosmic-purple/20 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cosmic-violet/20 rounded-full filter blur-3xl animate-pulse" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="mb-6 inline-block">
              <div className="px-4 py-2 rounded-full border border-cosmic-purple/50 bg-cosmic-purple/10 backdrop-blur">
                <span className="text-cosmic-purple text-sm font-semibold">
                  <p>Welcome to My Cosmic Realm</p>
                </span>
              </div>
            </div>

            <h2 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cosmic-purple via-cosmic-violet to-cosmic-purple bg-clip-text text-transparent">
                Immerse Yourself
              </span>
              <br />
              <span className="text-gray-100">in the Cosmos</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              <p>
                Where artificial intelligence meets creative vision. Explore
                cutting-edge digital art, immersive experiences, and exclusive
                NFT collections crafted at the frontier of technology
              </p>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => isHeroModalsEnabled && setIsAboutMeOpen(true)}
                disabled={!isHeroModalsEnabled}
                className="btn-cosmic disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p>About Me</p>
              </button>
              <button
                onClick={() => isHeroModalsEnabled && setIsLearnMoreOpen(true)}
                disabled={!isHeroModalsEnabled}
                className="px-6 py-3 rounded-lg font-semibold border-2 border-cosmic-purple/50 text-cosmic-purple hover:border-cosmic-purple hover:cosmic-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* AI Art Podcast Section */}
        <section
          id="podcast"
          className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-purple/30 rounded-full filter blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-6xl">
            <div className="text-center mb-16">
              <h3 className="text-5xl font-bold mb-4">
                <p>AI Art Podcast</p>
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                <p>
                  Explore conversations at the intersection of artificial
                  intelligence and creative expression, where legendary masters
                  come to life with AI avatars, sharing their voices, ideas, and
                  timeless wisdom
                </p>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {podcastVideos.map(
                (url, index) =>
                  activePodcastVideosList[index] &&
                  url && (
                    <div
                      key={index}
                      className="relative aspect-video rounded-2xl overflow-hidden cosmic-glow"
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src={url}
                        title={`AI Art Podcast Episode ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ),
              )}
            </div>
          </div>
        </section>

        {/* Cosmic Ambient Music Player Section */}
        {activeCosmicVideosList.some((v) => v) && (
          <section
            id="music"
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-violet/30 rounded-full filter blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-6xl">
              <div className="text-center mb-16">
                <h3 className="text-5xl font-bold mb-4">Cosmic Ambient</h3>
                <p className="text-cosmic-purple text-lg font-semibold mb-4">
                  <p>40-Min Tracks</p>
                </p>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                  <p>
                    Journey through AI-curated ambient soundscapes that evoke
                    the vastness of space. Each composition is designed to
                    elevate your consciousness and inspire creative flow. From
                    Deep Focus &amp; Productivity to Sleep &amp; Meditation
                  </p>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {cosmicVideos.map(
                  (url, index) =>
                    activeCosmicVideosList[index] && (
                      <div
                        key={index}
                        className="relative aspect-video rounded-2xl overflow-hidden cosmic-glow block"
                      >
                        <iframe
                          width="100%"
                          height="100%"
                          src={url}
                          title={`Cosmic Ambient Visualization ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ),
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setPlaylistType("cosmic");
                    setIsPlaylistModalOpen(true);
                  }}
                  className="btn-cosmic"
                >
                  View Full Playlist
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Feel the Cosmos Interactive Experience Section */}
        {(activeFeelCosmosVideosList.some((v) => v) ||
          activeFeelCosmosSongs) && (
          <section
            id="experience"
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cosmic-purple/30 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="relative z-10 max-w-6xl w-full">
              <div className="text-center mb-16">
                <h3 className="text-5xl font-bold mb-4">Feel the Cosmos</h3>
                <p className="text-cosmic-purple text-lg font-semibold mb-4">
                  <p style={{ textAlign: "center" }}>40-Min Tracks</p>
                </p>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                  <p>
                    Step into an interactive universe where art, sound, and
                    technology converge. Explore immersive AI-generated
                    soundscapes inspired by the world's cultural centers. Young
                    women in luxurious costumes appear against futuristic cosmic
                    landscapes
                  </p>
                </p>
              </div>

              {/* Feel the Cosmos Videos */}
              {activeFeelCosmosVideosList.some((v) => v) && (
                <div className="mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {feelCosmosVideos.map(
                      (url, index) =>
                        activeFeelCosmosVideosList[index] && (
                          <div
                            key={index}
                            className="relative aspect-video rounded-2xl overflow-hidden cosmic-glow"
                          >
                            <iframe
                              width="100%"
                              height="100%"
                              src={url}
                              title={`Feel the Cosmos Video ${index + 1}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        ),
                    )}
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setPlaylistType("feelCosmos");
                        setIsPlaylistModalOpen(true);
                      }}
                      className="btn-cosmic"
                    >
                      View Full Playlist
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* NFT Collections Section */}
        <section
          id="nft"
          className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-violet/30 rounded-full filter blur-3xl" />
          </div>

          <div className="relative z-10 max-w-6xl w-full">
            {activeNftVideosList.some((v) => v) && nftVideos.some((v) => v) && (
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h3 className="text-5xl font-bold mb-4">
                    NFT Collections Videos
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                    <p>
                      Explore digital art collections, where NFT art supports
                      educational and cultural content, and AI meets cosmic
                      imagination and human legacy
                    </p>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {nftVideos.map(
                    (url, index) =>
                      activeNftVideosList[index] &&
                      url && (
                        <div
                          key={index}
                          className="relative aspect-video rounded-2xl overflow-hidden cosmic-glow"
                        >
                          <iframe
                            width="100%"
                            height="100%"
                            src={url}
                            title={`NFT Collection Video ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}

            <div>
              <div className="text-center mb-16">
                <h3 className="text-5xl font-bold mb-4">NFT Collections</h3>
                <p className="text-cosmic-purple text-lg font-semibold mb-4">
                  Legendary Digital Artifacts
                </p>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                  <p>
                    <p>
                      Discover my portfolio of high-fidelity digital art where
                      AI and human imagination converge. Showcasing diverse
                      styles and aesthetics, open for potential commissions. For
                      custom collaborations, send a message via Contact Me
                    </p>
                  </p>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {nftCollections.map((url, index) => {
                  const isValidUrl =
                    url &&
                    (url.startsWith("http://") ||
                      url.startsWith("https://") ||
                      url.startsWith("/"));
                  return isValidUrl && activeNftCollectionsList[index] ? (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square rounded-2xl overflow-hidden cosmic-glow cursor-pointer"
                    >
                      {nftCollectionCustomImages[index] ||
                      nftCollectionImages[index]
                        ? (() => {
                            const src =
                              nftCollectionCustomImages[index] ||
                              nftCollectionImages[index];
                            const isVideo =
                              src &&
                              (src.startsWith("data:video/") ||
                                src.startsWith(
                                  "data:application/octet-stream",
                                ) ||
                                src.endsWith(".mp4") ||
                                src.endsWith(".webm"));
                            const isGif =
                              src &&
                              (src.startsWith("data:image/gif") ||
                                src.endsWith(".gif"));

                            if (isVideo) {
                              return (
                                <video
                                  src={src}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                  onError={(e) => {
                                    (
                                      e.target as HTMLVideoElement
                                    ).style.display = "none";
                                  }}
                                />
                              );
                            }

                            return (
                              <img
                                src={src}
                                alt={`NFT Collection ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            );
                          })()
                        : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-6 px-4">
                        {nftCollectionNames[index] && (
                          <p className="text-gray-100 font-semibold text-center mb-2">
                            {nftCollectionNames[index]}
                          </p>
                        )}
                        <span className="text-gray-300 text-sm">
                          View Collection
                        </span>
                      </div>
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </section>

        {/* My AI Tools Videos Section */}
        {activeCosmicAmbientVideosList.some((v) => v) && (
          <section
            id="my-ai-tools"
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-violet/30 rounded-full filter blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-6xl">
              <div className="text-center mb-16">
                <h3 className="text-5xl font-bold mb-4">My AI Tools</h3>
                <p className="text-cosmic-purple text-lg font-semibold mb-4">
                  <p>Powerful solutions for creators</p>
                </p>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                  <p>
                    Meet the tools I use daily to create content. They help
                    creators, artists, and media professionals work faster and
                    more creatively, from video editing to voice synthesis
                  </p>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {cosmicAmbientVideos.map(
                  (url, index) =>
                    activeCosmicAmbientVideosList[index] &&
                    url && (
                      <div
                        key={index}
                        className="relative aspect-video rounded-2xl overflow-hidden cosmic-glow block"
                      >
                        <iframe
                          width="100%"
                          height="100%"
                          src={url}
                          title={`My AI Tools ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ),
                )}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <Footer />
      </main>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Playlist Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        playlistType={playlistType}
        playlistSongs={playlistType === "cosmic" ? [] : feelCosmosSongs}
      />

      {/* Hero Modals */}
      <HeroModal
        isOpen={isAboutMeOpen}
        title="About Me"
        content={aboutMeText}
        onClose={() => setIsAboutMeOpen(false)}
      />
      <HeroModal
        isOpen={isLearnMoreOpen}
        title="Learn More"
        content={learnMoreText}
        onClose={() => setIsLearnMoreOpen(false)}
      />
    </div>
  );
}
