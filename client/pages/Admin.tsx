import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ArrowLeft,
  Music,
  Podcast,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PasswordModal from "@/components/PasswordModal";

interface Track {
  id: string;
  title: string;
  youtubeUrl: string;
  duration?: string;
}

interface AmbientTrack {
  id: string;
  title: string;
  youtubeUrl: string;
}

const DEFAULT_AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: "1",
    title: "Deep Space Ambient",
    youtubeUrl: "https://www.youtube.com/embed/jgpJVI3tDT0",
  },
  {
    id: "2",
    title: "Cosmic Meditation",
    youtubeUrl: "https://www.youtube.com/embed/1La4QzGeaaQ",
  },
  {
    id: "3",
    title: "Stellar Soundscape",
    youtubeUrl: "https://www.youtube.com/embed/TqOneWeDtFI",
  },
  {
    id: "4",
    title: "Nebula Dreams",
    youtubeUrl: "https://www.youtube.com/embed/lFcSrYw-ARY",
  },
];

const STORAGE_KEY = "cosmic-playlist-tracks";
const AMBIENT_STORAGE_KEY = "cosmic-ambient-tracks";
const ADMIN_PASSWORD = "2986";

interface AdminPageProps {}

export default function Admin() {
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminErrorMessage, setAdminErrorMessage] = useState("");

  const handleAdminPasswordSubmit = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAdminErrorMessage("");
    } else {
      setAdminErrorMessage("Incorrect password. Please try again.");
    }
  };

  const handleAdminCancel = () => {
    navigate("/");
  };

  const [tracks, setTracks] = useState<Track[]>([]);
  const [bulkTracks, setBulkTracks] = useState<
    Array<{ title: string; url: string }>
  >(
    Array(10)
      .fill(null)
      .map(() => ({ title: "", url: "" })),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const [ambientTracks, setAmbientTracks] = useState<AmbientTrack[]>(
    DEFAULT_AMBIENT_TRACKS,
  );
  const [currentAmbientTrack, setCurrentAmbientTrack] =
    useState<AmbientTrack | null>(DEFAULT_AMBIENT_TRACKS[0]);
  const [ambientVolume, setAmbientVolume] = useState(70);
  const [newAmbientTitle, setNewAmbientTitle] = useState("");
  const [newAmbientUrl, setNewAmbientUrl] = useState("");

  const [cosmicVideos, setCosmicVideos] = useState<string[]>(() => {
    const saved = localStorage.getItem("cosmic-videos");
    return saved ? JSON.parse(saved) : ["", "", "", ""];
  });

  const [playlistVideos, setPlaylistVideos] = useState<string[]>(() => {
    const saved = localStorage.getItem("playlist-videos");
    return saved ? JSON.parse(saved) : ["", "", "", ""];
  });

  const [playlistSongs, setPlaylistSongs] = useState<
    Array<{ title: string; url: string }>
  >(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        const songs = loaded.map((track: Track) => ({
          title: track.title,
          url: track.youtubeUrl,
        }));
        while (songs.length < 10) {
          songs.push({ title: "", url: "" });
        }
        return songs.slice(0, 10);
      } catch (e) {
        return Array(10)
          .fill(null)
          .map(() => ({ title: "", url: "" }));
      }
    }
    return Array(10)
      .fill(null)
      .map(() => ({ title: "", url: "" }));
  });

  const [feelCosmosVideos, setFeelCosmosVideos] = useState<string[]>(() => {
    const saved = localStorage.getItem("feel-cosmos-videos");
    return saved ? JSON.parse(saved) : ["", "", "", ""];
  });

  const [feelCosmosSongs, setFeelCosmosSongs] = useState<
    Array<{ title: string; url: string }>
  >(() => {
    const saved = localStorage.getItem("feel-cosmos-songs");
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        const songs = loaded.map((track: Track) => ({
          title: track.title,
          url: track.youtubeUrl,
        }));
        while (songs.length < 10) {
          songs.push({ title: "", url: "" });
        }
        return songs.slice(0, 10);
      } catch (e) {
        return Array(10)
          .fill(null)
          .map(() => ({ title: "", url: "" }));
      }
    }
    return Array(10)
      .fill(null)
      .map(() => ({ title: "", url: "" }));
  });

  const [podcastVideos, setPodcastVideos] = useState<string[]>(() => {
    const saved = localStorage.getItem("podcast-videos");
    return saved ? JSON.parse(saved) : ["", "", "", ""];
  });

  const [activePodcastVideosList, setActivePodcastVideosList] = useState<
    boolean[]
  >(() => {
    const saved = localStorage.getItem("podcast-videos-list-active");
    return saved ? JSON.parse(saved) : [true, true, true, true];
  });

  const [nftVideos, setNftVideos] = useState<string[]>(() => {
    const saved = localStorage.getItem("nft-videos");
    return saved ? JSON.parse(saved) : ["", "", "", ""];
  });

  const [activeNftVideosList, setActiveNftVideosList] = useState<boolean[]>(
    () => {
      const saved = localStorage.getItem("nft-videos-list-active");
      return saved ? JSON.parse(saved) : [true, true, true, true];
    },
  );

  const [nftCollections, setNftCollections] = useState<string[]>(() => {
    const saved = localStorage.getItem("nft-collections");
    return saved ? JSON.parse(saved) : ["", "", "", "", "", ""];
  });

  const [nftCollectionCustomImages, setNftCollectionCustomImages] = useState<
    string[]
  >(() => {
    const saved = localStorage.getItem("nft-collection-custom-images");
    return saved ? JSON.parse(saved) : ["", "", "", "", "", ""];
  });

  const [nftCollectionSelectedFiles, setNftCollectionSelectedFiles] = useState<
    string[]
  >(["", "", "", "", "", ""]);

  const [activeNftCollectionsList, setActiveNftCollectionsList] = useState<
    boolean[]
  >(() => {
    const saved = localStorage.getItem("nft-collections-list-active");
    return saved ? JSON.parse(saved) : [true, true, true, true, true, true];
  });

  const [nftCollectionNames, setNftCollectionNames] = useState<string[]>(() => {
    const saved = localStorage.getItem("nft-collection-names");
    return saved ? JSON.parse(saved) : ["", "", "", "", "", ""];
  });

  const [cosmicAmbientVideos, setCosmicAmbientVideos] = useState<string[]>(
    () => {
      const saved = localStorage.getItem("cosmic-ambient-videos");
      return saved ? JSON.parse(saved) : ["", "", "", ""];
    },
  );

  const [activeCosmicAmbientVideosList, setActiveCosmicAmbientVideosList] =
    useState<boolean[]>(() => {
      const saved = localStorage.getItem("cosmic-ambient-videos-list-active");
      return saved ? JSON.parse(saved) : [false, false, false, false];
    });

  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("social-links");
    return saved
      ? JSON.parse(saved)
      : {
          twitter: "",
          youtube: "",
          instagram: "",
          threads: "",
          facebook: "",
          telegram: "",
          tiktok: "",
          discord: "",
          linkedin: "",
          contra: "",
          webbie: "",
        };
  });

  const [heroAboutMeText, setHeroAboutMeText] = useState<string>(() => {
    const saved = localStorage.getItem("hero-about-me-text");
    return saved ? saved : "";
  });

  const [heroLearnMoreText, setHeroLearnMoreText] = useState<string>(() => {
    const saved = localStorage.getItem("hero-learn-more-text");
    return saved ? saved : "";
  });

  const [isHeroModalsEnabled, setIsHeroModalsEnabled] = useState<boolean>(
    () => {
      const saved = localStorage.getItem("hero-modals-enabled");
      return saved !== "false"; // Default is true
    },
  );

  const [contactMessages, setContactMessages] = useState<
    Array<{
      message: string;
      email: string;
      timestamp: string;
    }>
  >(() => {
    const saved = localStorage.getItem("contact-messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [contactEmail, setContactEmail] = useState<string>(() => {
    const saved = localStorage.getItem("contact-email");
    return saved || "";
  });

  const [isContactEnabled, setIsContactEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("contact-enabled");
    return saved !== "false"; // Default is true
  });

  const [backgroundImages, setBackgroundImages] = useState<string[]>(
    Array(10).fill(""),
  );

  // Reload messages periodically to catch new ones
  useEffect(() => {
    const loadMessages = () => {
      const saved = localStorage.getItem("contact-messages");
      setContactMessages(saved ? JSON.parse(saved) : []);
    };

    loadMessages();
    const interval = setInterval(loadMessages, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, []);
  const [backgroundImageFiles, setBackgroundImageFiles] = useState<
    Map<number, File>
  >(new Map());

  const [activeBackgroundImages, setActiveBackgroundImages] = useState<
    boolean[]
  >(() => {
    const saved = localStorage.getItem("background-images-active");
    return saved ? JSON.parse(saved) : Array(10).fill(false);
  });

  const [uploadError, setUploadError] = useState<string>("");

  // Activation state for sections
  const [activeCosmicVideosList, setActiveCosmicVideosList] = useState<
    boolean[]
  >(() => {
    const saved = localStorage.getItem("cosmic-videos-list-active");
    return saved ? JSON.parse(saved) : [true, true, true, true];
  });

  const [activePlaylistVideos, setActivePlaylistVideos] = useState<boolean>(
    () => {
      const saved = localStorage.getItem("playlist-videos-active");
      return saved ? JSON.parse(saved) : true;
    },
  );

  const [activePlaylistSongs, setActivePlaylistSongs] = useState<boolean>(
    () => {
      const saved = localStorage.getItem("playlist-songs-active");
      return saved ? JSON.parse(saved) : true;
    },
  );

  const [activeFeelCosmosVideosList, setActiveFeelCosmosVideosList] = useState<
    boolean[]
  >(() => {
    const saved = localStorage.getItem("feel-cosmos-videos-list-active");
    return saved ? JSON.parse(saved) : [true, true, true, true];
  });

  const [activeFeelCosmosSongs, setActiveFeelCosmosSongs] = useState<boolean>(
    () => {
      const saved = localStorage.getItem("feel-cosmos-songs-active");
      return saved ? JSON.parse(saved) : true;
    },
  );

  // Load tracks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTracks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load tracks:", e);
      }
    }

    const savedAmbient = localStorage.getItem(AMBIENT_STORAGE_KEY);
    if (savedAmbient) {
      try {
        const loaded = JSON.parse(savedAmbient);
        setAmbientTracks(loaded);
        if (loaded.length > 0) {
          setCurrentAmbientTrack(loaded[0]);
        }
      } catch (e) {
        console.error("Failed to load ambient tracks:", e);
      }
    }
  }, []);

  // Save tracks to localStorage
  const saveTracks = (newTracks: Track[]) => {
    setTracks(newTracks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTracks));
  };

  const extractVideoId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{10,12})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{10,12})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return "";
  };

  const addBulkTracks = () => {
    const newTracks: Track[] = [];
    let errorCount = 0;

    bulkTracks.forEach((track, index) => {
      if (!track.title.trim() || !track.url.trim()) {
        return;
      }

      const videoId = extractVideoId(track.url);
      if (!videoId) {
        errorCount++;
        console.warn(`Invalid YouTube URL for track: ${track.title}`);
        return;
      }

      newTracks.push({
        id: Date.now().toString() + index,
        title: track.title,
        youtubeUrl: `https://www.youtube.com/embed/${videoId}`,
        duration: "0:00",
      });
    });

    if (newTracks.length === 0) {
      alert(
        "Please fill at least one field with a track title and valid YouTube link",
      );
      return;
    }

    if (errorCount > 0) {
      alert(`${errorCount} links were skipped - check the YouTube link format`);
    }

    saveTracks([...tracks, ...newTracks]);
    setBulkTracks(
      Array(10)
        .fill(null)
        .map(() => ({ title: "", url: "" })),
    );
    alert(`Added ${newTracks.length} tracks!`);
  };

  const updateBulkTrack = (
    index: number,
    field: "title" | "url",
    value: string,
  ) => {
    const updated = [...bulkTracks];
    updated[index] = { ...updated[index], [field]: value };
    setBulkTracks(updated);
  };

  const deleteTrack = (id: string) => {
    saveTracks(tracks.filter((t) => t.id !== id));
  };

  const startEdit = (track: Track) => {
    setEditingId(track.id);
    setEditTitle(track.title);
    setEditUrl(track.youtubeUrl);
  };

  const saveEdit = () => {
    if (!editTitle.trim()) {
      alert("Please enter a track title");
      return;
    }

    saveTracks(
      tracks.map((t) => (t.id === editingId ? { ...t, title: editTitle } : t)),
    );
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  };

  const updatePlaylistSong = (
    index: number,
    field: "title" | "url",
    value: string,
  ) => {
    const updated = [...playlistSongs];
    updated[index] = { ...updated[index], [field]: value };
    setPlaylistSongs(updated);

    // Auto-save to localStorage
    const newTracks: Track[] = [];
    updated.forEach((song, idx) => {
      if (!song.title.trim() || !song.url.trim()) {
        return;
      }

      const videoId = extractVideoId(song.url);
      if (!videoId) {
        return;
      }

      newTracks.push({
        id: Date.now().toString() + idx,
        title: song.title,
        youtubeUrl: `https://www.youtube.com/embed/${videoId}`,
        duration: "0:00",
      });
    });

    saveTracks(newTracks);
  };

  const saveCosmicVideo = (index: number, url: string) => {
    const updated = [...cosmicVideos];
    updated[index] = url;
    setCosmicVideos(updated);
    localStorage.setItem("cosmic-videos", JSON.stringify(updated));
  };

  const savePlaylistVideo = (index: number, url: string) => {
    const updated = [...playlistVideos];
    updated[index] = url;
    setPlaylistVideos(updated);
    localStorage.setItem("playlist-videos", JSON.stringify(updated));
  };

  const saveFeelCosmosVideo = (index: number, url: string) => {
    const updated = [...feelCosmosVideos];
    updated[index] = url;
    setFeelCosmosVideos(updated);
    localStorage.setItem("feel-cosmos-videos", JSON.stringify(updated));
  };

  const updateFeelCosmosSong = (
    index: number,
    field: "title" | "url",
    value: string,
  ) => {
    const updated = [...feelCosmosSongs];
    updated[index] = { ...updated[index], [field]: value };
    setFeelCosmosSongs(updated);

    // Auto-save to localStorage
    const newTracks: Track[] = [];
    updated.forEach((song, idx) => {
      if (!song.title.trim() || !song.url.trim()) {
        return;
      }

      const videoId = extractVideoId(song.url);
      if (!videoId) {
        return;
      }

      newTracks.push({
        id: Date.now().toString() + idx,
        title: song.title,
        youtubeUrl: `https://www.youtube.com/embed/${videoId}`,
        duration: "0:00",
      });
    });

    localStorage.setItem("feel-cosmos-songs", JSON.stringify(newTracks));
  };

  const saveAmbientTracks = (newTracks: AmbientTrack[]) => {
    setAmbientTracks(newTracks);
    localStorage.setItem(AMBIENT_STORAGE_KEY, JSON.stringify(newTracks));
  };

  const addAmbientTrack = () => {
    if (!newAmbientTitle.trim() || !newAmbientUrl.trim()) {
      alert("Please fill in both title and YouTube link");
      return;
    }

    const videoId = extractVideoId(newAmbientUrl);
    if (!videoId) {
      alert("Invalid YouTube link format");
      return;
    }

    const newTrack: AmbientTrack = {
      id: Date.now().toString(),
      title: newAmbientTitle,
      youtubeUrl: `https://www.youtube.com/embed/${videoId}`,
    };

    saveAmbientTracks([...ambientTracks, newTrack]);
    setNewAmbientTitle("");
    setNewAmbientUrl("");
    alert("Track added!");
  };

  const deleteAmbientTrack = (id: string) => {
    const newTracks = ambientTracks.filter((t) => t.id !== id);
    saveAmbientTracks(newTracks);
    if (currentAmbientTrack?.id === id) {
      setCurrentAmbientTrack(newTracks[0] || null);
    }
  };

  const savePodcastVideo = (index: number, url: string) => {
    const updated = [...podcastVideos];
    updated[index] = url;
    setPodcastVideos(updated);
    localStorage.setItem("podcast-videos", JSON.stringify(updated));
  };

  const toggleCosmicVideoActive = (index: number, isActive: boolean) => {
    const updated = [...activeCosmicVideosList];
    updated[index] = isActive;
    setActiveCosmicVideosList(updated);
    localStorage.setItem("cosmic-videos-list-active", JSON.stringify(updated));
  };

  const togglePlaylistVideosActive = (isActive: boolean) => {
    setActivePlaylistVideos(isActive);
    localStorage.setItem("playlist-videos-active", JSON.stringify(isActive));
  };

  const togglePlaylistSongsActive = (isActive: boolean) => {
    setActivePlaylistSongs(isActive);
    localStorage.setItem("playlist-songs-active", JSON.stringify(isActive));
  };

  const toggleFeelCosmosVideoActive = (index: number, isActive: boolean) => {
    const updated = [...activeFeelCosmosVideosList];
    updated[index] = isActive;
    setActiveFeelCosmosVideosList(updated);
    localStorage.setItem(
      "feel-cosmos-videos-list-active",
      JSON.stringify(updated),
    );
  };

  const toggleFeelCosmosSongsActive = (isActive: boolean) => {
    setActiveFeelCosmosSongs(isActive);
    localStorage.setItem("feel-cosmos-songs-active", JSON.stringify(isActive));
  };

  const togglePodcastVideoActive = (index: number, isActive: boolean) => {
    const updated = [...activePodcastVideosList];
    updated[index] = isActive;
    setActivePodcastVideosList(updated);
    localStorage.setItem("podcast-videos-list-active", JSON.stringify(updated));
  };

  const saveNftVideo = (index: number, url: string) => {
    const updated = [...nftVideos];
    updated[index] = url;
    setNftVideos(updated);
    localStorage.setItem("nft-videos", JSON.stringify(updated));
  };

  const toggleNftVideoActive = (index: number, isActive: boolean) => {
    const updated = [...activeNftVideosList];
    updated[index] = isActive;
    setActiveNftVideosList(updated);
    localStorage.setItem("nft-videos-list-active", JSON.stringify(updated));
  };

  const saveNftCollection = (index: number, url: string) => {
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      const fullUrl = `https://${url}`;
      const updated = [...nftCollections];
      updated[index] = fullUrl;
      setNftCollections(updated);
      localStorage.setItem("nft-collections", JSON.stringify(updated));
    } else {
      const updated = [...nftCollections];
      updated[index] = url;
      setNftCollections(updated);
      localStorage.setItem("nft-collections", JSON.stringify(updated));
    }
  };

  const saveNftCollectionCustomImage = (index: number, imageUrl: string) => {
    try {
      const updated = [...nftCollectionCustomImages];
      updated[index] = imageUrl;

      const jsonStr = JSON.stringify(updated);
      const sizeInMB = new Blob([jsonStr]).size / (1024 * 1024);

      if (sizeInMB > 4) {
        setUploadError(
          `Media too large for storage. Current size: ${sizeInMB.toFixed(2)}MB. Max: 4MB`,
        );
        setTimeout(() => setUploadError(""), 5000);
        return;
      }

      setNftCollectionCustomImages(updated);
      localStorage.setItem(
        "nft-collection-custom-images",
        JSON.stringify(updated),
      );
      setUploadError("");
    } catch (e) {
      setUploadError(
        "Failed to save media. File might be too large for browser storage.",
      );
      setTimeout(() => setUploadError(""), 5000);
      console.error("Storage error:", e);
    }
  };

  const toggleNftCollectionActive = (index: number, isActive: boolean) => {
    const updated = [...activeNftCollectionsList];
    updated[index] = isActive;
    setActiveNftCollectionsList(updated);
    localStorage.setItem(
      "nft-collections-list-active",
      JSON.stringify(updated),
    );
  };

  const saveNftCollectionName = (index: number, name: string) => {
    const updated = [...nftCollectionNames];
    updated[index] = name;
    setNftCollectionNames(updated);
    localStorage.setItem("nft-collection-names", JSON.stringify(updated));
  };

  const saveCosmicAmbientVideo = (index: number, url: string) => {
    const updated = [...cosmicAmbientVideos];
    updated[index] = url;
    setCosmicAmbientVideos(updated);
    localStorage.setItem("cosmic-ambient-videos", JSON.stringify(updated));
  };

  const toggleCosmicAmbientVideoActive = (index: number, isActive: boolean) => {
    const updated = [...activeCosmicAmbientVideosList];
    updated[index] = isActive;
    setActiveCosmicAmbientVideosList(updated);
    localStorage.setItem(
      "cosmic-ambient-videos-list-active",
      JSON.stringify(updated),
    );
  };

  const saveSocialLink = (key: string, url: string) => {
    const updated = { ...socialLinks };
    updated[key] = url;
    setSocialLinks(updated);
    localStorage.setItem("social-links", JSON.stringify(updated));
  };

  const saveHeroAboutMeText = (text: string) => {
    setHeroAboutMeText(text);
    localStorage.setItem("hero-about-me-text", text);
  };

  const saveHeroLearnMoreText = (text: string) => {
    setHeroLearnMoreText(text);
    localStorage.setItem("hero-learn-more-text", text);
  };

  const toggleHeroModalsEnabled = () => {
    const newValue = !isHeroModalsEnabled;
    setIsHeroModalsEnabled(newValue);
    localStorage.setItem("hero-modals-enabled", newValue.toString());
  };

  const saveContactEmail = (email: string) => {
    setContactEmail(email);
    localStorage.setItem("contact-email", email);
  };

  const deleteMessage = (index: number) => {
    const updated = contactMessages.filter((_, i) => i !== index);
    setContactMessages(updated);
    localStorage.setItem("contact-messages", JSON.stringify(updated));
  };

  const deleteAllMessages = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all messages? This cannot be undone.",
      )
    ) {
      setContactMessages([]);
      localStorage.removeItem("contact-messages");
    }
  };

  const toggleContactEnabled = () => {
    const newValue = !isContactEnabled;
    setIsContactEnabled(newValue);
    localStorage.setItem("contact-enabled", newValue.toString());
  };

  const toggleActiveBackgroundImage = (index: number, active: boolean) => {
    const updated = [...activeBackgroundImages];
    updated[index] = active;
    setActiveBackgroundImages(updated);
    localStorage.setItem("background-images-active", JSON.stringify(updated));
  };

  const handleBackgroundImageUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      setUploadError("Please upload an image file (JPG, PNG, WebP, etc.)");
      setTimeout(() => setUploadError(""), 5000);
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(
        `File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
      );
      setTimeout(() => setUploadError(""), 5000);
      return;
    }

    setUploadError("");
    try {
      const objectUrl = URL.createObjectURL(file);
      const updated = [...backgroundImages];
      updated[index] = objectUrl;
      setBackgroundImages(updated);

      const updatedFiles = new Map(backgroundImageFiles);
      updatedFiles.set(index, file);
      setBackgroundImageFiles(updatedFiles);
    } catch (err) {
      console.error("Error uploading image:", err);
      setUploadError("Failed to upload image. Please try again.");
      setTimeout(() => setUploadError(""), 5000);
    }
  };

  const clearBackgroundImage = (index: number) => {
    const updated = [...backgroundImages];
    const objectUrl = updated[index];

    if (objectUrl && objectUrl.startsWith("blob:")) {
      URL.revokeObjectURL(objectUrl);
    }

    updated[index] = "";
    setBackgroundImages(updated);

    const updatedFiles = new Map(backgroundImageFiles);
    updatedFiles.delete(index);
    setBackgroundImageFiles(updatedFiles);
  };

  const handleNftCollectionImageUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      const newSelectedFiles = [...nftCollectionSelectedFiles];
      newSelectedFiles[index] = "";
      setNftCollectionSelectedFiles(newSelectedFiles);
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo =
      file.type.startsWith("video/") &&
      (file.type.includes("mp4") || file.type.includes("webm"));
    const isGif =
      file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");

    if (!isImage && !isVideo && !isGif) {
      setUploadError(
        "Please upload an image (JPG, PNG, WebP), GIF, or video (MP4, WebM) file",
      );
      setTimeout(() => setUploadError(""), 5000);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(
        `File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). For large videos, use the URL field instead and paste a video link.`,
      );
      setTimeout(() => setUploadError(""), 5000);
      return;
    }

    setUploadError("");

    const newSelectedFiles = [...nftCollectionSelectedFiles];
    newSelectedFiles[index] = file.name;
    setNftCollectionSelectedFiles(newSelectedFiles);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      saveNftCollectionCustomImage(index, dataUrl);
    };
    reader.onerror = () => {
      setUploadError("Failed to read file. Please try again.");
      setTimeout(() => setUploadError(""), 5000);
    };
    reader.readAsDataURL(file);
  };

  if (!isAdminAuthenticated) {
    return (
      <PasswordModal
        isOpen={true}
        onSubmit={handleAdminPasswordSubmit}
        onCancel={handleAdminCancel}
        errorMessage={adminErrorMessage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-dark text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cosmic-purple to-cosmic-violet bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-gray-400">Manage your cosmic content</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cosmic-purple/50 text-cosmic-purple hover:border-cosmic-purple hover:bg-cosmic-purple/10 transition"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <Tabs defaultValue="ambient" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-lg p-1">
            <TabsTrigger
              value="ambient"
              className="data-[state=active]:bg-cosmic-purple/30 data-[state=active]:text-cosmic-purple"
            >
              AI Art Podcast
            </TabsTrigger>
            <TabsTrigger
              value="links"
              className="data-[state=active]:bg-cosmic-purple/30 data-[state=active]:text-cosmic-purple"
            >
              Cosmic Ambient
            </TabsTrigger>
            <TabsTrigger
              value="cosmos"
              className="data-[state=active]:bg-cosmic-purple/30 data-[state=active]:text-cosmic-purple"
            >
              Feel the Cosmos
            </TabsTrigger>
            <TabsTrigger
              value="nft"
              className="data-[state=active]:bg-cosmic-purple/30 data-[state=active]:text-cosmic-purple"
            >
              NFT Collections
            </TabsTrigger>
            <TabsTrigger
              value="music"
              className="data-[state=active]:bg-cosmic-purple/30 data-[state=active]:text-cosmic-purple"
            >
              My AI Tools
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="data-[state=active]:bg-cosmic-purple/30 data-[state=active]:text-cosmic-purple"
            >
              Social Links
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="data-[state=active]:bg-cosmic-purple/30 data-[state=active]:text-cosmic-purple"
            >
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ambient" className="mt-8 space-y-8">
            {/* Podcast Videos Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-cosmic-purple">
                AI Art Podcast Videos
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {podcastVideos.map((url, index) => (
                  <div
                    key={index}
                    className={`bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6 flex flex-col ${activePodcastVideosList[index] ? "" : "opacity-50"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-cosmic-purple">
                        Episode {index + 1}
                      </h3>
                      <button
                        onClick={() =>
                          togglePodcastVideoActive(
                            index,
                            !activePodcastVideosList[index],
                          )
                        }
                        className={`px-3 py-1 rounded text-xs font-semibold transition ${
                          activePodcastVideosList[index]
                            ? "bg-cosmic-purple/30 text-cosmic-purple border border-cosmic-purple/50"
                            : "bg-gray-700/50 text-gray-400 border border-gray-600/50"
                        }`}
                      >
                        {activePodcastVideosList[index] ? "On" : "Off"}
                      </button>
                    </div>
                    <textarea
                      value={url}
                      onChange={(e) => savePodcastVideo(index, e.target.value)}
                      placeholder="youtube.com/watch?v=xxx or youtu.be/yyy"
                      className="flex-1 px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-xs focus:outline-none focus:border-cosmic-purple transition font-mono resize-none"
                      disabled={!activePodcastVideosList[index]}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Modals Section */}
            <div className="pt-8 border-t border-cosmic-purple/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-cosmic-purple">
                  Hero Modals (About Me & Learn More)
                </h2>
                <button
                  onClick={toggleHeroModalsEnabled}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isHeroModalsEnabled
                      ? "text-cosmic-dark bg-gradient-to-r from-cosmic-purple to-cosmic-violet hover:from-cosmic-violet hover:to-cosmic-purple hover:cosmic-glow cursor-pointer"
                      : "text-gray-400 bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isHeroModalsEnabled ? "ON" : "OFF"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-3">
                    About Me Modal Text
                  </label>
                  <textarea
                    value={heroAboutMeText}
                    onChange={(e) => saveHeroAboutMeText(e.target.value)}
                    placeholder="Enter the text for the About Me modal window..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition resize-none"
                    rows={6}
                    disabled={!isHeroModalsEnabled}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This text will be displayed when clicking the "About Me"
                    button.
                  </p>
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-3">
                    Learn More Modal Text
                  </label>
                  <textarea
                    value={heroLearnMoreText}
                    onChange={(e) => saveHeroLearnMoreText(e.target.value)}
                    placeholder="Enter the text for the Learn More modal window..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition resize-none"
                    rows={6}
                    disabled={!isHeroModalsEnabled}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This text will be displayed when clicking the "Learn More"
                    button.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="links" className="mt-8 space-y-8">
            {/* Cosmic Ambient Videos Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-cosmic-purple">
                Cosmic Ambient Videos
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {cosmicVideos.map((url, index) => (
                  <div
                    key={index}
                    className={`bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6 flex flex-col ${activeCosmicVideosList[index] ? "" : "opacity-50"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-cosmic-purple">
                        Video {index + 1}
                      </h3>
                      <button
                        onClick={() =>
                          toggleCosmicVideoActive(
                            index,
                            !activeCosmicVideosList[index],
                          )
                        }
                        className={`px-3 py-1 rounded text-xs font-semibold transition ${
                          activeCosmicVideosList[index]
                            ? "bg-cosmic-purple/30 text-cosmic-purple border border-cosmic-purple/50"
                            : "bg-gray-700/50 text-gray-400 border border-gray-600/50"
                        }`}
                      >
                        {activeCosmicVideosList[index] ? "On" : "Off"}
                      </button>
                    </div>
                    <textarea
                      value={url}
                      onChange={(e) => saveCosmicVideo(index, e.target.value)}
                      placeholder="youtube.com/watch?v=xxx or youtu.be/yyy"
                      className="flex-1 px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-xs focus:outline-none focus:border-cosmic-purple transition font-mono resize-none"
                      disabled={!activeCosmicVideosList[index]}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Playlist Songs Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-cosmic-purple">
                Audio Playlist (up to 10 songs)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {playlistSongs.map((song, index) => (
                  <div
                    key={index}
                    className="space-y-3 p-4 rounded-lg bg-cosmic-dark/50 border border-cosmic-purple/20"
                  >
                    <div className="text-xs font-semibold text-cosmic-purple mb-2">
                      Song #{index + 1}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={song.title}
                        onChange={(e) =>
                          updatePlaylistSong(index, "title", e.target.value)
                        }
                        placeholder="e.g., Cosmic Meditation"
                        className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2">
                        YouTube Link
                      </label>
                      <input
                        type="text"
                        value={song.url}
                        onChange={(e) =>
                          updatePlaylistSong(index, "url", e.target.value)
                        }
                        placeholder="youtube.com/watch?v=... or youtu.be/..."
                        className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cosmos" className="mt-8 space-y-8">
            {/* Feel the Cosmos Videos Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-cosmic-purple">
                Feel the Cosmos Videos
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {feelCosmosVideos.map((url, index) => (
                  <div
                    key={index}
                    className={`bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6 flex flex-col ${activeFeelCosmosVideosList[index] ? "" : "opacity-50"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-cosmic-purple">
                        Video {index + 1}
                      </h3>
                      <button
                        onClick={() =>
                          toggleFeelCosmosVideoActive(
                            index,
                            !activeFeelCosmosVideosList[index],
                          )
                        }
                        className={`px-3 py-1 rounded text-xs font-semibold transition ${
                          activeFeelCosmosVideosList[index]
                            ? "bg-cosmic-purple/30 text-cosmic-purple border border-cosmic-purple/50"
                            : "bg-gray-700/50 text-gray-400 border border-gray-600/50"
                        }`}
                      >
                        {activeFeelCosmosVideosList[index] ? "On" : "Off"}
                      </button>
                    </div>
                    <textarea
                      value={url}
                      onChange={(e) =>
                        saveFeelCosmosVideo(index, e.target.value)
                      }
                      placeholder="youtube.com/watch?v=xxx or youtu.be/yyy"
                      className="flex-1 px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-xs focus:outline-none focus:border-cosmic-purple transition font-mono resize-none"
                      disabled={!activeFeelCosmosVideosList[index]}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Feel the Cosmos Songs Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-cosmic-purple">
                Feel the Cosmos Playlist (up to 10 songs)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {feelCosmosSongs.map((song, index) => (
                  <div
                    key={index}
                    className="space-y-3 p-4 rounded-lg bg-cosmic-dark/50 border border-cosmic-purple/20"
                  >
                    <div className="text-xs font-semibold text-cosmic-purple mb-2">
                      Song #{index + 1}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={song.title}
                        onChange={(e) =>
                          updateFeelCosmosSong(index, "title", e.target.value)
                        }
                        placeholder="e.g., Cosmic Meditation"
                        className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2">
                        YouTube Link
                      </label>
                      <input
                        type="text"
                        value={song.url}
                        onChange={(e) =>
                          updateFeelCosmosSong(index, "url", e.target.value)
                        }
                        placeholder="youtube.com/watch?v=... or youtu.be/..."
                        className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nft" className="mt-8 space-y-8">
            {/* NFT Collections Videos Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-cosmic-purple">
                NFT Collections Videos
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {nftVideos.map((url, index) => (
                  <div
                    key={index}
                    className={`bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6 flex flex-col ${activeNftVideosList[index] ? "" : "opacity-50"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-cosmic-purple">
                        Video {index + 1}
                      </h3>
                      <button
                        onClick={() =>
                          toggleNftVideoActive(
                            index,
                            !activeNftVideosList[index],
                          )
                        }
                        className={`px-3 py-1 rounded text-xs font-semibold transition ${
                          activeNftVideosList[index]
                            ? "bg-cosmic-purple/30 text-cosmic-purple border border-cosmic-purple/50"
                            : "bg-gray-700/50 text-gray-400 border border-gray-600/50"
                        }`}
                      >
                        {activeNftVideosList[index] ? "On" : "Off"}
                      </button>
                    </div>
                    <textarea
                      value={url}
                      onChange={(e) => saveNftVideo(index, e.target.value)}
                      placeholder="youtube.com/watch?v=xxx or youtu.be/yyy"
                      className="flex-1 px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-xs focus:outline-none focus:border-cosmic-purple transition font-mono resize-none"
                      disabled={!activeNftVideosList[index]}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* NFT Collections Grid Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-cosmic-purple">
                NFT Collections Grid (6 items)
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {nftCollections.map((url, index) => (
                  <div
                    key={index}
                    className={`bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6 flex flex-col ${activeNftCollectionsList[index] ? "" : "opacity-50"}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-400 mb-2">
                          Collection {index + 1}
                        </label>
                        <input
                          type="text"
                          value={nftCollectionNames[index]}
                          onChange={(e) =>
                            saveNftCollectionName(index, e.target.value)
                          }
                          placeholder={`Collection Name ${index + 1}`}
                          className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-xs focus:outline-none focus:border-cosmic-purple transition"
                          disabled={!activeNftCollectionsList[index]}
                        />
                      </div>
                      <button
                        onClick={() =>
                          toggleNftCollectionActive(
                            index,
                            !activeNftCollectionsList[index],
                          )
                        }
                        className={`ml-3 px-3 py-2 rounded text-xs font-semibold transition flex-shrink-0 ${
                          activeNftCollectionsList[index]
                            ? "bg-cosmic-purple/30 text-cosmic-purple border border-cosmic-purple/50"
                            : "bg-gray-700/50 text-gray-400 border border-gray-600/50"
                        }`}
                      >
                        {activeNftCollectionsList[index] ? "On" : "Off"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2">
                          Collection URL
                        </label>
                        <input
                          type="text"
                          value={url}
                          onChange={(e) =>
                            saveNftCollection(index, e.target.value)
                          }
                          placeholder="opensea.io/collection/name or objkt.com/collections/..."
                          className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-xs focus:outline-none focus:border-cosmic-purple transition font-mono"
                          disabled={!activeNftCollectionsList[index]}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2">
                          Custom Image (Upload or URL)
                        </label>
                        <div className="flex flex-col gap-3">
                          <div className="relative">
                            <label className="block text-xs text-gray-500 mb-1">
                              Choose file
                            </label>
                            <input
                              type="file"
                              accept="image/*,video/mp4,video/webm,.gif"
                              onChange={(e) =>
                                handleNftCollectionImageUpload(index, e)
                              }
                              className="px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 text-xs focus:outline-none focus:border-cosmic-purple transition cursor-pointer file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-cosmic-purple/30 file:text-cosmic-purple file:cursor-pointer"
                              disabled={!activeNftCollectionsList[index]}
                            />
                            <p className="text-xs text-gray-600 mt-1">
                              {nftCollectionSelectedFiles[index]
                                ? `File selected: ${nftCollectionSelectedFiles[index]}`
                                : "No file selected"}
                            </p>
                          </div>
                          <input
                            type="text"
                            value={nftCollectionCustomImages[index]}
                            onChange={(e) =>
                              saveNftCollectionCustomImage(
                                index,
                                e.target.value,
                              )
                            }
                            placeholder="Or paste image URL: https://example.com/image.jpg"
                            className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-xs focus:outline-none focus:border-cosmic-purple transition font-mono"
                            disabled={!activeNftCollectionsList[index]}
                          />
                        </div>
                        {uploadError && (
                          <p className="text-red-400 text-xs mt-2 bg-red-900/20 p-2 rounded border border-red-700/30">
                            {uploadError}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs mt-2">
                          Upload image (JPG, PNG, WebP), GIF, or small video
                          (max 5MB) or paste URL. For large videos, use a video
                          URL link. If empty, will fetch from collection
                          automatically.
                        </p>
                        {nftCollectionCustomImages[index] &&
                          nftCollectionCustomImages[index].length > 100 && (
                            <p className="text-green-500/70 text-xs mt-2">
                              ✓ Image uploaded
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="music" className="mt-8 space-y-8">
            {/* My AI Tools Videos Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-cosmic-purple">
                My AI Tools Videos
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {cosmicAmbientVideos.map((url, index) => (
                  <div
                    key={index}
                    className={`bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6 flex flex-col ${activeCosmicAmbientVideosList[index] ? "" : "opacity-50"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-cosmic-purple">
                        Video {index + 1}
                      </h3>
                      <button
                        onClick={() =>
                          toggleCosmicAmbientVideoActive(
                            index,
                            !activeCosmicAmbientVideosList[index],
                          )
                        }
                        className={`px-3 py-1 rounded text-xs font-semibold transition ${
                          activeCosmicAmbientVideosList[index]
                            ? "bg-cosmic-purple/30 text-cosmic-purple border border-cosmic-purple/50"
                            : "bg-gray-700/50 text-gray-400 border border-gray-600/50"
                        }`}
                      >
                        {activeCosmicAmbientVideosList[index] ? "On" : "Off"}
                      </button>
                    </div>
                    <textarea
                      value={url}
                      onChange={(e) =>
                        saveCosmicAmbientVideo(index, e.target.value)
                      }
                      placeholder="youtube.com/watch?v=xxx or youtu.be/yyy"
                      className="flex-1 px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-xs focus:outline-none focus:border-cosmic-purple transition font-mono resize-none"
                      disabled={!activeCosmicAmbientVideosList[index]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-8 space-y-8">
            {/* Messages Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-cosmic-purple">
                  Contact Messages
                </h2>
                <span className="text-xs font-semibold bg-cosmic-purple/20 text-cosmic-purple px-3 py-1 rounded-full">
                  {contactMessages.length}
                </span>
              </div>

              {contactMessages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-2">No messages yet</p>
                  <p className="text-xs text-gray-600">
                    Messages will appear here when visitors contact you
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={deleteAllMessages}
                    className="text-xs text-red-400 hover:text-red-300 transition mb-4"
                  >
                    Delete All Messages
                  </button>
                  <div className="max-h-[600px] overflow-y-auto space-y-4">
                    {[...contactMessages].reverse().map((msg, reverseIndex) => {
                      const actualIndex =
                        contactMessages.length - 1 - reverseIndex;
                      return (
                        <div
                          key={actualIndex}
                          className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-cosmic-purple mb-1">
                                Email
                              </p>
                              <p className="text-xs text-gray-300 break-all">
                                {msg.email}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                              <p className="text-xs text-gray-500 whitespace-nowrap">
                                {new Date(msg.timestamp).toLocaleDateString()}{" "}
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </p>
                              <button
                                onClick={() => deleteMessage(actualIndex)}
                                className="text-red-400 hover:text-red-300 transition p-1 hover:bg-red-500/10 rounded"
                                title="Delete message"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                          <div className="border-t border-cosmic-purple/20 pt-3 mt-3">
                            <p className="text-sm font-semibold text-cosmic-purple mb-2">
                              Message
                            </p>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Contact Form Section */}
              <div className="pt-8 border-t border-cosmic-purple/20 space-y-6 mt-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-cosmic-purple">
                      Contact Form
                    </h2>
                    <button
                      onClick={toggleContactEnabled}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        isContactEnabled
                          ? "text-cosmic-dark bg-gradient-to-r from-cosmic-purple to-cosmic-violet hover:from-cosmic-violet hover:to-cosmic-purple hover:cosmic-glow cursor-pointer"
                          : "text-gray-400 bg-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {isContactEnabled ? "ON" : "OFF"}
                    </button>
                  </div>
                  <div className="max-w-md">
                    <div
                      className={`bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6 ${!isContactEnabled ? "opacity-50" : ""}`}
                    >
                      <label className="block">
                        <span className="text-sm font-semibold text-cosmic-purple mb-3 block">
                          Email Address
                        </span>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => saveContactEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-3">
                        Your email address will be used for contact inquiries.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-cosmic-purple/20">
                  <h3 className="text-lg font-bold text-cosmic-purple mb-4">
                    Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-lg p-4">
                      <p className="text-xs font-semibold text-cosmic-purple mb-1">
                        Contact Form
                      </p>
                      <p
                        className={`text-sm font-bold ${isContactEnabled ? "text-green-400" : "text-red-400"}`}
                      >
                        {isContactEnabled ? "🟢 Active" : "🔴 Inactive"}
                      </p>
                    </div>
                    <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-lg p-4">
                      <p className="text-xs font-semibold text-cosmic-purple mb-1">
                        Total Messages
                      </p>
                      <p className="text-sm font-bold text-cosmic-purple">
                        {contactMessages.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-8 space-y-8">
            {/* Social Links Section */}
            <div>
              <h2 className="text-xl font-bold mb-6 text-cosmic-purple">
                Social Media Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    X / Twitter
                  </label>
                  <input
                    type="text"
                    value={socialLinks.twitter}
                    onChange={(e) => saveSocialLink("twitter", e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    YouTube
                  </label>
                  <input
                    type="text"
                    value={socialLinks.youtube}
                    onChange={(e) => saveSocialLink("youtube", e.target.value)}
                    placeholder="https://youtube.com/@..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={socialLinks.instagram}
                    onChange={(e) =>
                      saveSocialLink("instagram", e.target.value)
                    }
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    Threads
                  </label>
                  <input
                    type="text"
                    value={socialLinks.threads}
                    onChange={(e) => saveSocialLink("threads", e.target.value)}
                    placeholder="https://threads.net/@..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={socialLinks.facebook}
                    onChange={(e) => saveSocialLink("facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    Telegram
                  </label>
                  <input
                    type="text"
                    value={socialLinks.telegram}
                    onChange={(e) => saveSocialLink("telegram", e.target.value)}
                    placeholder="https://t.me/..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    TikTok
                  </label>
                  <input
                    type="text"
                    value={socialLinks.tiktok}
                    onChange={(e) => saveSocialLink("tiktok", e.target.value)}
                    placeholder="https://tiktok.com/@..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    Discord
                  </label>
                  <input
                    type="text"
                    value={socialLinks.discord}
                    onChange={(e) => saveSocialLink("discord", e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={socialLinks.linkedin}
                    onChange={(e) => saveSocialLink("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    Contra
                  </label>
                  <input
                    type="text"
                    value={socialLinks.contra}
                    onChange={(e) => saveSocialLink("contra", e.target.value)}
                    placeholder="https://contra.com/..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>

                <div className="bg-cosmic-purple/5 border border-cosmic-purple/30 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-cosmic-purple mb-2">
                    Webbie Social
                  </label>
                  <input
                    type="text"
                    value={socialLinks.webbie}
                    onChange={(e) => saveSocialLink("webbie", e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded bg-cosmic-dark border border-cosmic-purple/30 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cosmic-purple transition"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
