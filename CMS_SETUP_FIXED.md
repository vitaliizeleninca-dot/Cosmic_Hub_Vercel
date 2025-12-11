# Decap CMS Setup Guide (Fixed)

This guide explains the corrected setup for Decap CMS with Cosmic Hub.

## What Changed

- **Primary only**: Deploy only to Vercel (`www.alphaross.com`)
- **Simplified failover**: Removed backup Netlify approach
- **Direct config loading**: CMS loads config.yml from static files
- **Fixed MIME types**: Proper YAML serving with correct Content-Type

## Architecture

```
┌────────────────────────────────┐
│   GitHub Repository            │
│   - .github/workflows/          │
│   - client/pages/AdminCMS.tsx   │
│   - public/admin/config.yml     │
└────────────────────────────────┘
              ↓
         Vercel Deploy
         (GitHub Actions)
              ↓
    www.alphaross.com
    ├─ React SPA
    ├─ /cms (Decap CMS)
    └─ GitHub OAuth ✓
```

## Step 1: Create GitHub OAuth App

### 1.1 Go to GitHub Settings

1. Navigate to **GitHub Settings** → **Developer settings** → **OAuth Apps**
2. Click **"New OAuth App"**

### 1.2 Fill in Application Details

```
Application name: Cosmic Hub CMS
Homepage URL: https://www.alphaross.com
Authorization callback URL: https://api.netlify.com/auth/done
```

### 1.3 Save Credentials

After registering, copy:

- **Client ID**
- **Client Secret** (click "Generate" if not shown)

Keep these safe - you'll need them in Step 3.

## Step 2: Set Up Vercel Project

### 2.1 Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"** → Import your GitHub repository
3. Configure:
   - **Framework**: Vite
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist/spa`

### 2.2 Add Environment Variables

Go to **Project Settings** → **Environment Variables**:

```
OAUTH_CLIENT_ID = <your GitHub Client ID>
OAUTH_CLIENT_SECRET = <your GitHub Client Secret>
```

Apply to all environments.

### 2.3 Connect Domain

1. **Project Settings** → **Domains**
2. Add domain: `www.alphaross.com`
3. Follow DNS verification steps
4. Wait for HTTPS certificate

### 2.4 Get Vercel Secrets for GitHub

You need these for GitHub Actions:

1. **VERCEL_TOKEN**: Go to **Account Settings** → **Tokens** → Create new token
2. **VERCEL_ORG_ID**: Your organization/team ID
3. **VERCEL_PROJECT_ID**: From Project Settings

## Step 3: Add Secrets to GitHub

Go to **Repository Settings** → **Secrets and variables** → **Actions**

Add these secrets:

```
VERCEL_TOKEN = <from Vercel>
VERCEL_ORG_ID = <from Vercel>
VERCEL_PROJECT_ID = <from Vercel>
```

## Step 4: Update CMS Configuration

Edit `client/pages/AdminCMS.tsx`:

Find this line (around line 42):

```javascript
repo: "username/repo", // User must update this
```

Replace with your GitHub repository:

```javascript
repo: "yourusername/cosmichub",
```

## Step 5: Test Locally

### 5.1 Start Dev Server

```bash
pnpm install
pnpm run dev
```

### 5.2 Access CMS

Visit: `http://localhost:8080/cms`

You should see the CMS loading indicator. If config loads correctly, it will prompt for GitHub login.

**Troubleshooting if it doesn't load:**

- Open browser DevTools (F12)
- Check **Console** tab for errors
- Check **Network** tab to see if `/admin/config.yml` loads

### 5.3 Manual CMS Test

In browser console, test config loading:

```javascript
fetch("/admin/config.yml")
  .then((r) => r.text())
  .then((t) => console.log(t))
  .catch((e) => console.error(e));
```

Should see YAML content, not HTML.

## Step 6: Deploy

### 6.1 Update Repository

```bash
git add .
git commit -m "Fix Decap CMS configuration"
git push origin main
```

### 6.2 GitHub Actions Deploys Automatically

Watch deployment:

1. Go to **GitHub** → **Actions** tab
2. Watch the **Deploy to Vercel** workflow
3. Should complete in 2-3 minutes

### 6.3 Test Production CMS

Once deployed, visit:

```
https://www.alphaross.com/cms
```

Log in with GitHub and you should see the content management interface.

## Accessing Decap CMS

Once everything is set up:

**Development**: `http://localhost:8080/cms`

**Production**: `https://www.alphaross.com/cms`

### What You Can Manage

- Podcast Videos (YouTube URLs)
- Cosmic Ambient Videos
- Feel the Cosmos Videos
- NFT Collections Videos
- NFT Collections (6 items)
- Social Links (all platforms)

## Content Management Workflow

1. Visit CMS at `https://www.alphaross.com/cms`
2. Log in with your GitHub account
3. Click the collection (e.g., "Menu Content")
4. Edit the "Menu Items" file
5. Make changes to:
   - Video titles
   - YouTube URLs
   - Status (active/inactive)
   - Collection information
   - Social links
6. Click **Save** (draft) or **Publish** (live)
7. GitHub Actions automatically rebuilds the site
8. Changes appear on `https://www.alphaross.com` in 2-3 minutes

## Troubleshooting

### "CMS Error" Page

**Check these things:**

1. **GitHub OAuth not configured**
   - Verify Client ID and Secret in Vercel environment variables
   - Check callback URL is `https://api.netlify.com/auth/done`

2. **Repository name wrong**
   - Update `repo: "yourusername/cosmichub"` in `client/pages/AdminCMS.tsx`
   - Redeploy

3. **config.yml not found**
   - Verify file exists at `public/admin/config.yml`
   - Check Network tab in DevTools - should see `/admin/config.yml` loading
   - If 404, rebuild and redeploy

4. **CMS scripts won't load**
   - Check **Network** tab for failed requests
   - Ensure JavaScript is enabled
   - Try incognito/private mode
   - Clear browser cache

### Debug Console

Open browser DevTools (F12) → **Console** tab

You should see messages like:

```
"Loading Decap CMS..."
"Configuring CMS..."
```

If you see errors, they'll be displayed here. Share these errors for support.

### Manual Config Test

Test if YAML config is accessible:

```bash
curl https://www.alphaross.com/admin/config.yml
```

Should return YAML text, not HTML.

## File Structure

After deployment, these files should exist in `dist/spa`:

```
dist/spa/
├─ index.html (main app)
├─ admin/
│  └─ config.yml ✓
├─ admin/
│  └─ index.html
├─ menu.json
└─ ... (other assets)
```

## Security Notes

- **Never commit secrets** to Git
- Keep `OAUTH_CLIENT_SECRET` only in environment variables
- Rotate tokens periodically
- Monitor GitHub Actions logs for errors

## Next Steps

1. ✅ Complete all steps above
2. Test CMS login with GitHub
3. Create test content
4. Verify changes appear on main site
5. Set up backup strategy (optional)

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Decap CMS Docs**: https://decapcms.org/docs/intro/
- **GitHub Actions**: https://docs.github.com/en/actions
