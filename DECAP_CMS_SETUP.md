# Decap CMS Setup Guide

This guide explains how to set up Decap CMS for managing your Cosmic Hub menu content.

## Overview

Decap CMS is a headless CMS that allows you to manage your site's content through a web interface. All changes are saved directly to your GitHub repository.

## Prerequisites

- GitHub account
- Deployed site on Netlify (already configured)
- Your site's GitHub repository

## Setup Steps

### 1. Create GitHub OAuth Application

1. Go to **GitHub Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Fill in the form:
   - **Application name**: Cosmic Hub CMS
   - **Homepage URL**: `https://www.alphaross.com` (your domain)
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
3. Click "Register application"
4. You'll see your **Client ID** and need to generate a **Client Secret**
5. Copy both values - you'll need them for Netlify

### 2. Configure Netlify

1. Go to your **Netlify Site Settings** → **Build & Deploy** → **Environment**
2. Add these environment variables:
   - `OAUTH_CLIENT_ID`: (your GitHub OAuth Client ID)
   - `OAUTH_CLIENT_SECRET`: (your GitHub OAuth Client Secret)

### 3. Update Decap CMS Config

Edit `public/admin/config.yml` and update:

```yaml
backend:
  name: github
  repo: yourusername/repo-name # Replace with your GitHub repo
  branch: main
```

### 4. Deploy Your Changes

Push the code to GitHub. Netlify will automatically redeploy your site.

### 5. Update CMS Configuration in Code

Before deploying, update the CMS configuration in `client/pages/AdminCMS.tsx`:

Find this line:

```javascript
repo: "username/repo", // User needs to update this
```

Replace with your GitHub repo, for example:

```javascript
repo: "yourusername/cosmichub",
```

### 6. Deploy Your Changes

Push the code to GitHub. Netlify will automatically rebuild and deploy your site.

### 7. Access the CMS

Once deployed, visit: **https://www.alphaross.com/cms**

You'll be prompted to log in with GitHub. After authentication, you can manage menu content.

## Managing Content

### Menu Items

The CMS allows you to edit:

- **Podcast Videos** (YouTube URLs and titles)
- **Cosmic Ambient Videos**
- **Feel the Cosmos Videos**
- **NFT Collections Videos**
- **NFT Collections** (6 items with URLs and images)
- **Social Links** (Twitter, YouTube, Discord, etc.)

### Publishing Changes

1. Make changes in the CMS
2. Click "Save" to save changes
3. If using Editorial Workflow, click "Publish" to deploy
4. Netlify will automatically rebuild and deploy your site
5. Changes will be visible to all users immediately

## File Structure

The CMS manages these files in your repository:

- `data/menu.yml` - YAML version of menu content
- `public/menu.json` - JSON version served by the frontend

## Frontend Integration

Your site automatically fetches menu data from `/api/menu` endpoint, which reads from either:

1. `public/menu.json` (production)
2. `data/menu.yml` (git-based backup)

## Troubleshooting

### CMS Login Issues

- Ensure GitHub OAuth app is correctly configured
- Check that callback URL matches `https://api.netlify.com/auth/done`
- Verify environment variables are set in Netlify

### Changes Not Appearing

- Check Netlify deployment logs for build errors
- Ensure you clicked "Publish" if using Editorial Workflow
- Clear browser cache (Ctrl+Shift+Delete)

### File Not Updating

- Check that the file path in config.yml matches your repository
- Ensure your GitHub user has write access to the repo

## Support

For more information, visit:

- [Decap CMS Documentation](https://decapcms.org/docs/intro/)
- [Netlify CMS/Decap GitHub Integration](https://decapcms.org/docs/backends-overview/#github)
