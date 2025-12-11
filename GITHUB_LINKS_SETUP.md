# GitHub-Based Links Storage Setup

This document explains how to set up and use the GitHub-based links storage system instead of localStorage.

## Overview

The links management system uses GitHub as a centralized data store, allowing you to:

- Store links in a GitHub repository (not localStorage)
- Access links from any device, browser, or application
- Persist data without browser cache dependency
- Share links across multiple users/instances

## Architecture

```
Frontend (React)
    ↓
API Endpoints (Vercel/Express)
    ├─ GET /api/get-links
    └─ POST /api/save-link
    ↓
GitHub API
    ↓
GitHub Repository (data/links.json)
```

## Setup Steps

### 1. Create a GitHub Personal Access Token (PAT)

1. Go to [GitHub Settings → Developer Settings → Personal access tokens → Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. Click **"Generate new token"**
3. Set token details:
   - **Token name**: `cosmic-hub-links-token` (or your preferred name)
   - **Expiration**: 90 days (or your preferred duration)
   - **Repository access**: Select your repository only
4. Set **Permissions**:
   - Under "Repository permissions" → **Contents** → Select **Read and write**
5. Click **"Generate token"**
6. **Copy and save the token** (you won't be able to see it again)

### 2. Add Environment Variables to Vercel

#### In Vercel Dashboard:

1. Go to your project settings
2. Navigate to **Settings → Environment Variables**
3. Add the following variables:

```
GITHUB_TOKEN = <your-fine-grained-token>
GITHUB_OWNER = <your-github-username>
GITHUB_REPO = <your-repository-name>
```

**Example:**

```
GITHUB_TOKEN = github_pat_11A...
GITHUB_OWNER = vitalii-zelenin
GITHUB_REPO = Cosmic-Inspirations-website-project
```

#### Or locally (development):

Update your `.env` file:

```env
GITHUB_TOKEN=your_fine_grained_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name
```

### 3. Create Initial GitHub Structure

The `/data/links.json` file has been created with:

```json
{
  "links": []
}
```

Make sure this file exists in your repository's `data/` directory.

## API Endpoints

### GET /api/get-links

Retrieves all saved links from GitHub.

**Request:**

```bash
curl https://your-domain.com/api/get-links
```

**Response:**

```json
{
  "links": [
    {
      "url": "https://example.com",
      "date": "2024-01-15T10:30:00.000Z"
    }
  ],
  "success": true
}
```

### POST /api/save-link

Adds a new link to GitHub (auto-deduplicates, sorts by date).

**Request:**

```bash
curl -X POST https://your-domain.com/api/save-link \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

**Response:**

```json
{
  "success": true,
  "message": "Link saved successfully",
  "link": {
    "url": "https://example.com",
    "date": "2024-01-15T10:30:00.000Z"
  },
  "links": [...]
}
```

## Frontend Usage

### Using the LinksManager Component

Add the component to your admin panel:

```tsx
import LinksManager from "@/components/LinksManager";

export default function Admin() {
  return (
    <div>
      <LinksManager />
    </div>
  );
}
```

### Using the Utility Functions

```tsx
import { loadLinks, saveLink, formatDate, type Link } from "@/lib/github-links";

// Load all links
const links = await loadLinks();

// Save a new link
const newLink = await saveLink("https://example.com");

// Format date for display
const formatted = formatDate(link.date);
```

### Example React Hook

```tsx
import { useState, useEffect } from "react";
import { loadLinks, saveLink } from "@/lib/github-links";

export function useGitHubLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await loadLinks();
      setLinks(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const addLink = async (url: string) => {
    const link = await saveLink(url);
    if (link) {
      setLinks((prev) => [link, ...prev]);
    }
  };

  return { links, loading, addLink };
}
```

## Features

### Built-in Features

- ✅ **Deduplication**: Automatically removes duplicate URLs
- ✅ **Sorting**: Links sorted by date (newest first)
- ✅ **Validation**: URL format validation before saving
- ✅ **Error Handling**: Graceful fallbacks if GitHub is unavailable
- ✅ **Timestamp**: Each link includes creation date

### LinksManager Component Features

- ✅ Add new links via form
- ✅ Copy link to clipboard
- ✅ Delete links
- ✅ Display formatted dates
- ✅ Real-time loading state
- ✅ Error messages
- ✅ URL validation

## Security Considerations

⚠️ **Important:**

- Never commit your `GITHUB_TOKEN` to version control
- Use Vercel environment variables for production
- Use `.env` files only for local development (add to `.gitignore`)
- Fine-grained tokens are more secure than classic PATs
- Rotate tokens regularly

## Troubleshooting

### "GITHUB_TOKEN environment variable is not set"

- Check that environment variables are set in Vercel dashboard
- Redeploy after adding environment variables
- For local development, check `.env` file

### "Failed to fetch links"

- Verify GitHub token has correct permissions (Contents: Read & Write)
- Check that `data/links.json` exists in repository
- Ensure `GITHUB_OWNER` and `GITHUB_REPO` are correctly set

### "Invalid URL format"

- Ensure URLs start with `http://` or `https://`
- Remove extra whitespace from URLs

### GitHub API Rate Limiting

- Fine-grained tokens have generous rate limits (1000+ per hour)
- If hit, wait before retrying
- Monitor usage in GitHub token settings

## Migration from localStorage

The system gracefully falls back to empty arrays if GitHub is unavailable, but for existing localStorage data:

```tsx
// Export localStorage data
const saved = localStorage.getItem("your-links-key");
const oldLinks = JSON.parse(saved || "[]");

// Import to GitHub
for (const link of oldLinks) {
  await saveLink(link.url);
}

// Clear localStorage (optional)
localStorage.removeItem("your-links-key");
```

## Monitoring

Check your links in GitHub:

1. Navigate to your repository
2. Open `data/links.json`
3. Click "Raw" to view the JSON
4. History shows who committed and when

## Additional Optimization

### Add Database Layer (Future)

For higher traffic, consider:

- Supabase for backup + faster queries
- Caching with Redis
- Database indexing for large link collections

### Multi-Collection Support

Current system stores one global links array. To support multiple collections:

```json
{
  "collections": {
    "favorites": [...],
    "research": [...],
    "archives": [...]
  }
}
```

Then update API to accept `?collection=favorites` parameter.

## Support

For issues:

1. Check GitHub token permissions
2. Verify environment variables in Vercel
3. Check GitHub API status
4. Review server logs for detailed errors
