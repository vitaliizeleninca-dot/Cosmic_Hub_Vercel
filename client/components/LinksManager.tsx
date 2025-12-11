import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Copy, Check } from "lucide-react";
import { loadLinks, saveLink, formatDate, type Link } from "@/lib/github-links";

export default function LinksManager() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load links on component mount
  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      try {
        const fetchedLinks = await loadLinks();
        setLinks(fetchedLinks);
        setError(null);
      } catch (err) {
        console.error("Error loading links:", err);
        setError("Failed to load links");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await saveLink(newUrl.trim());
      if (result) {
        setLinks((prevLinks) => [result, ...prevLinks]);
        setNewUrl("");
      } else {
        setError("Failed to save link");
      }
    } catch (err) {
      console.error("Error saving link:", err);
      setError("Error saving link");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (url: string) => {
    const updatedLinks = links.filter((link) => link.url !== url);
    setLinks(updatedLinks);

    try {
      // Reload from server to ensure consistency
      const freshLinks = await loadLinks();
      setLinks(freshLinks);
    } catch (err) {
      console.error("Error reloading links:", err);
      setError("Failed to delete link");
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>GitHub Links Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddLink} className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                disabled={saving}
              />
              <Button
                type="submit"
                disabled={saving || !newUrl.trim()}
                className="gap-2"
              >
                <Plus size={16} />
                {saving ? "Saving..." : "Add Link"}
              </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Links ({links.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Loading links...</p>
          ) : links.length === 0 ? (
            <p className="text-gray-500">No links saved yet</p>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <div
                  key={link.url}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block text-sm"
                      title={link.url}
                    >
                      {link.url}
                    </a>
                    <p className="text-xs text-gray-500">
                      {formatDate(link.date)}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyUrl(link.url)}
                      className="gap-1"
                    >
                      {copiedUrl === link.url ? (
                        <>
                          <Check size={14} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteLink(link.url)}
                      className="gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
