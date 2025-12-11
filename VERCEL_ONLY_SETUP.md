# Decap CMS Setup - Vercel Only

Complete guide for running Cosmic Hub with Decap CMS on Vercel.

## Architecture

```
GitHub Repository
      ↓
GitHub Actions (on push to main)
      ↓
Vercel Deployment
      ↓
www.alphaross.com
├─ React SPA (all pages)
├─ /cms (Decap CMS Admin)
└─ API endpoints
```

## Prerequisites

- GitHub account with your repo
- Vercel account connected to GitHub
- GitHub OAuth App credentials

## Step 1: Create GitHub OAuth App

### 1.1 Go to GitHub OAuth Settings

Navigate to:

```
Settings → Developer settings → OAuth Apps → New OAuth App
```

### 1.2 Register Application

Fill in these fields:

```
Application name:        Cosmic Hub CMS
Homepage URL:            https://www.alphaross.com
Authorization callback:  https://api.netlify.com/auth/done
```

### 1.3 Save Your Credentials

After registration, you'll see:

- **Client ID** (public)
- **Client Secret** (click "Generate" to create)

**Keep these secret!**

## Step 2: Configure Vercel Project

### 2.1 Create/Update Project

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository:

   ```
   Repository: vitaliizeleninca-dot/Cosmic-Inspirations-website-project
   ```

3. Configure Build Settings:
   ```
   Framework:             Vite
   Build Command:         pnpm run build
   Output Directory:      dist/spa
   ```

### 2.2 Add Environment Variables

Go to **Project Settings** → **Environment Variables** and add:

```
OAUTH_CLIENT_ID       = <your GitHub Client ID>
OAUTH_CLIENT_SECRET   = <your GitHub Client Secret>
```

**Apply to:** All Environments (Production, Preview, Development)

### 2.3 Connect Custom Domain

1. Go to **Domains** in Project Settings
2. Add: `www.alphaross.com`
3. Follow Vercel's DNS setup instructions
4. Wait for HTTPS certificate (5-10 minutes)

### 2.4 Get GitHub Actions Secrets

You need these for automatic deployments:

1. **VERCEL_TOKEN**:
   - Account Settings → Tokens → Create new
   - Copy the token

2. **VERCEL_ORG_ID**:
   - Team Settings → find your Organization ID
   - Or copy from any Vercel project

3. **VERCEL_PROJECT_ID**:
   - Project Settings → Project ID
   - Copy the ID

## Step 3: Configure GitHub Actions

### 3.1 Add Secrets to GitHub

Go to your repository:

```
Settings → Secrets and variables → Actions → New repository secret
```

Add three secrets:

```
VERCEL_TOKEN        = <from step 2.4>
VERCEL_ORG_ID       = <from step 2.4>
VERCEL_PROJECT_ID   = <from step 2.4>
```

### 3.2 Verify Workflow

File `.github/workflows/deploy.yml` is already set up. It will:

- Trigger on push to `main` branch
- Build project
- Deploy to Vercel automatically

## Step 4: Test Everything Locally

### 4.1 Install Dependencies

```bash
pnpm install
```

### 4.2 Start Dev Server

```bash
pnpm run dev
```

Visit: `http://localhost:8080/cms`

You should see the CMS loading screen.

### 4.3 Test Config Loading

Open browser **DevTools** (F12) → **Console** tab

You should see CMS initialization messages. If there are errors, they'll show here.

### 4.4 Test Static File Serving

Check that config.yml is accessible:

```bash
curl http://localhost:8080/admin/config.yml
```

Should return YAML content, not HTML or 404.

## Step 5: Deploy to Vercel

### 5.1 Commit Changes

```bash
git add .
git commit -m "Deploy Decap CMS on Vercel"
git push origin main
```

### 5.2 Watch Deployment

Go to your GitHub repository:

```
Actions → Deploy to Vercel → [latest run]
```

Watch the build process. Should complete in 2-3 minutes.

### 5.3 Check Vercel Deployment

Go to [vercel.com](https://vercel.com) and check:

- Deployment status: ✓ Ready
- Domain: `www.alphaross.com`

## Step 6: Access Decap CMS

Once deployed, visit:

```
https://www.alphaross.com/cms
```

### 6.1 First Login

1. Click "Login with GitHub"
2. Authorize the OAuth application
3. You should see the CMS interface

### 6.2 Manage Content

You can now edit:

- **Podcast Videos** (YouTube URLs)
- **Cosmic Ambient Videos**
- **Feel the Cosmos Videos**
- **NFT Collections Videos**
- **NFT Collections** (6 items with details)
- **Social Links** (all platforms)

### 6.3 Publish Changes

1. Edit content in CMS
2. Click **Save** (draft) or **Publish** (live)
3. GitHub Action automatically rebuilds
4. Changes go live in 1-2 minutes

## Troubleshooting

### CMS Shows Error on Loading

**Check these:**

1. **GitHub OAuth not configured**

   ```
   Vercel Settings → Environment Variables
   Check OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET are set
   ```

2. **config.yml returns 404**

   ```
   Browser Console (F12) → Network tab
   Look for /admin/config.yml
   Should return YAML, not HTML
   ```

3. **Build failed on Vercel**
   ```
   Vercel Dashboard → Deployments → [latest] → Logs
   Look for build errors
   ```

### Cannot Login with GitHub

**Verify:**

1. OAuth app exists on GitHub
2. Callback URL is: `https://api.netlify.com/auth/done`
3. Client ID and Secret are correct in Vercel
4. Browser cookies are enabled
5. Try incognito/private mode

### Changes Not Appearing

**Check:**

1. Vercel deployment completed successfully
2. Refresh the main site (hard refresh: Ctrl+Shift+R)
3. Clear browser cache
4. Check GitHub Actions logs for build errors

### Config.yml Accessibility Issues

**Test static file serving:**

```bash
# Development
curl http://localhost:8080/admin/config.yml

# Production
curl https://www.alphaross.com/admin/config.yml

# Should return YAML text like:
# backend:
#   name: github
#   ...
```

If it returns HTML or 404:

1. Check Vite build output
2. Verify public/admin/config.yml exists
3. Rebuild and redeploy

## File Structure

After deployment, these files should be in `dist/spa`:

```
dist/spa/
├─ index.html                 # Main React app
├─ admin/
│  ├─ config.yml             # CMS configuration ✓
│  └─ index.html             # CMS admin page
├─ menu.json                  # Menu data
├─ assets/
│  ├─ index-*.js             # React bundles
│  └─ ...
└─ ...
```

## Environment Variables Checklist

### Vercel Project Settings

```
✓ OAUTH_CLIENT_ID       = <GitHub OAuth Client ID>
✓ OAUTH_CLIENT_SECRET   = <GitHub OAuth Client Secret>
```

### GitHub Repository Secrets

```
✓ VERCEL_TOKEN          = <Vercel API Token>
✓ VERCEL_ORG_ID         = <Vercel Organization ID>
✓ VERCEL_PROJECT_ID     = <Vercel Project ID>
```

### GitHub OAuth App Settings

```
✓ Client ID             = <configured in Vercel>
✓ Client Secret         = <configured in Vercel>
✓ Authorization URL     = https://api.netlify.com/auth/done
✓ Homepage URL          = https://www.alphaross.com
```

## Security Best Practices

1. **Never commit secrets** to Git
2. Keep `OAUTH_CLIENT_SECRET` only in Vercel environment
3. Use strong GitHub token permissions
4. Rotate secrets periodically
5. Monitor GitHub Actions logs for errors
6. Check Vercel deployment logs regularly

## Performance Tips

- CMS loads in ~3-5 seconds
- Config caching: 1 hour (can be adjusted)
- Menu data caching: 1 hour
- Static files cached by browser

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Decap CMS Docs**: https://decapcms.org/docs/intro/
- **GitHub Actions**: https://docs.github.com/en/actions
- **GitHub OAuth**: https://docs.github.com/en/developers/apps/building-oauth-apps

## Next Steps

1. ✅ Complete all steps above
2. Test CMS login and content management
3. Create test content changes
4. Verify changes appear on main site
5. Monitor Vercel deployments
6. Set up error notifications (optional)

## Quick Reference

| Task             | URL                                                                         |
| ---------------- | --------------------------------------------------------------------------- |
| Main Site        | https://www.alphaross.com                                                   |
| CMS Admin        | https://www.alphaross.com/cms                                               |
| Vercel Dashboard | https://vercel.com/dashboard                                                |
| GitHub Repo      | https://github.com/vitaliizeleninca-dot/Cosmic-Inspirations-website-project |
| GitHub Actions   | https://github.com/.../actions                                              |
| OAuth App        | GitHub Settings → Developer settings → OAuth Apps                           |
