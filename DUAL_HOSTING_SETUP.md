# Dual-Hosting Setup Guide: Vercel + Netlify with Decap CMS

This guide explains how to set up your Cosmic Hub project with:
- **Primary**: Vercel (www.alphaross.com)
- **Backup**: Netlify (cms-backup.alphaross.com)
- **Auto-Failover**: Frontend automatically switches to backup if primary is unavailable

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                        │
│                                                              │
│  ├─ .github/workflows/deploy.yml (auto-deploy on push)     │
│  ├─ vercel.json (Vercel config)                            │
│  ├─ netlify.toml (Netlify config)                          │
│  └─ client/ (React + Decap CMS)                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────┴────────────────────┐
         ↓                                          ↓
    Vercel (Primary)                         Netlify (Backup)
    www.alphaross.com                        cms-backup.alphaross.com
    ├─ React SPA                             ├─ React SPA
    ├─ /cms (Decap CMS)                     ├─ /cms (Decap CMS)
    └─ GitHub OAuth ✓                       └─ GitHub OAuth ✓
         ↓
    Frontend Health Check (every 30s)
    └─ If unavailable → Redirect to Netlify
```

## Step 1: Domain & DNS Setup

### 1.1 Configure www.alphaross.com (Vercel - Primary)

1. Log into Hover DNS management
2. Add these DNS records:

```
Type    | Name     | Value
--------|----------|--------------------------------------------------
CNAME   | www      | cname.vercel-dns.com.
CNAME   | vercel   | cname.vercel-dns.com. (for verification)
A       | @        | 76.76.19.21 (Vercel IPv4)
```

### 1.2 Configure cms-backup.alphaross.com (Netlify - Backup)

1. Log into Hover DNS management
2. Add this DNS record:

```
Type    | Name           | Value
--------|----------------|--------------------------------------------------
CNAME   | cms-backup     | api.netlify.com.
```

### 1.3 Verify DNS Propagation

Wait 5-10 minutes, then check:
```bash
nslookup www.alphaross.com
nslookup cms-backup.alphaross.com
```

## Step 2: Create GitHub OAuth Applications

You need to create ONE GitHub OAuth app that works with both hosts.

### 2.1 Create GitHub OAuth App

1. Go to **GitHub Settings** → **Developer settings** → **OAuth Apps**
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: `Cosmic Hub CMS`
   - **Homepage URL**: `https://www.alphaross.com`
   - **Authorization callback URL**:
   ```
   https://api.netlify.com/auth/done
   ```
   (This works for both Vercel and Netlify)

4. Click "Register application"
5. You'll see:
   - **Client ID** (keep safe)
   - **Client Secret** (click "Generate" and keep safe)

## Step 3: Set Up Vercel (Primary Host)

### 3.1 Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist/spa`

### 3.2 Add Environment Variables to Vercel

Go to **Project Settings** → **Environment Variables** and add:

```
OAUTH_CLIENT_ID = <your GitHub OAuth Client ID>
OAUTH_CLIENT_SECRET = <your GitHub OAuth Client Secret>
```

Apply to: **All Environments**

### 3.3 Add Custom Domain

1. Go to **Project Settings** → **Domains**
2. Add: `www.alphaross.com`
3. Follow DNS verification steps
4. Wait for HTTPS certificate to provision

### 3.4 Get Vercel Secrets for GitHub Actions

1. Go to **Settings** (account level)
2. **Tokens** → Create a new token
3. Copy the token (use as `VERCEL_TOKEN` in GitHub)
4. Also get:
   - **Team ID** / **Organization ID** (from Team Settings) → `VERCEL_ORG_ID`
   - **Project ID** (from Project Settings) → `VERCEL_PROJECT_ID`

## Step 4: Set Up Netlify (Backup Host)

### 4.1 Create Netlify Site

1. Go to [netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist/spa`

### 4.2 Add Environment Variables to Netlify

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add:
   ```
   OAUTH_CLIENT_ID = <your GitHub OAuth Client ID>
   OAUTH_CLIENT_SECRET = <your GitHub OAuth Client Secret>
   ```

### 4.3 Add Custom Domain

1. Go to **Domain management**
2. Add: `cms-backup.alphaross.com`
3. Follow DNS verification steps

### 4.4 Get Netlify Secrets for GitHub Actions

1. Go to **User settings** → **Applications**
2. Create a new **Personal access token**
3. Copy the token (use as `NETLIFY_AUTH_TOKEN` in GitHub)
4. Also get your **Site ID** from **Site settings** → `NETLIFY_SITE_ID_BACKUP`

## Step 5: Configure GitHub Actions

### 5.1 Add Secrets to GitHub

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

```
VERCEL_TOKEN = <from Vercel>
VERCEL_ORG_ID = <from Vercel>
VERCEL_PROJECT_ID = <from Vercel>
NETLIFY_AUTH_TOKEN = <from Netlify>
NETLIFY_SITE_ID_BACKUP = <from Netlify>
```

### 5.2 Verify Workflow

The `.github/workflows/deploy.yml` file is already configured. When you push to `main`:
1. GitHub Actions triggers automatically
2. Builds the project
3. Deploys to Vercel (primary)
4. Deploys to Netlify (backup)

Both deployments happen in parallel.

## Step 6: Update Decap CMS Configuration

### 6.1 Update React Component

Edit `client/pages/AdminCMS.tsx` and find:

```javascript
repo: "username/repo", // User needs to update this
```

Replace with your actual GitHub repo:

```javascript
repo: "yourusername/cosmichub",
```

### 6.2 Commit and Push

```bash
git add .
git commit -m "Configure GitHub OAuth and dual hosting"
git push origin main
```

GitHub Actions will automatically deploy to both Vercel and Netlify.

## Step 7: Test the Setup

### 7.1 Test Primary (Vercel)

1. Visit `https://www.alphaross.com`
2. Navigate to `https://www.alphaross.com/cms`
3. Click "Log in with GitHub"
4. Authenticate with your GitHub account
5. You should see the Decap CMS interface

### 7.2 Test Backup (Netlify)

1. Visit `https://cms-backup.alphaross.com/cms`
2. Follow the same login process
3. Verify CMS is accessible

### 7.3 Test Failover (Manual)

To simulate failover:

1. In browser DevTools, go to **Network** tab
2. Click the "Offline" button to simulate Vercel being unavailable
3. Refresh the page
4. The app should automatically redirect to the Netlify backup

**Note**: In production, failover detection runs automatically every 30 seconds.

## Step 8: Manage Content with Decap CMS

### Access Points

- **Primary CMS**: `https://www.alphaross.com/cms`
- **Backup CMS**: `https://cms-backup.alphaross.com/cms`

### Content Types

You can manage:
- Podcast Videos (YouTube URLs)
- Cosmic Ambient Videos
- Feel the Cosmos Videos
- NFT Collections Videos
- NFT Collections (6 items)
- Social Links

### Publishing Changes

1. Edit content in the CMS
2. Click "Publish" (or "Save" for draft)
3. GitHub Actions automatically rebuilds both sites
4. Changes live in ~2-3 minutes on both hosts

## Troubleshooting

### GitHub Actions Deployment Fails

**Check**:
- All GitHub secrets are correctly set
- Secrets are in the right repository
- GitHub OAuth credentials are valid

**Solution**:
```bash
# Push again to trigger workflow
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### Domain Shows 404

**Check**:
- DNS records are correctly set in Hover
- Wait 15-30 minutes for DNS propagation
- Use `nslookup` to verify

**Solution**:
```bash
# Flush local DNS cache (macOS)
sudo dscacheutil -flushcache

# Or check DNS status
dig www.alphaross.com
dig cms-backup.alphaross.com
```

### CMS Won't Load

**Check**:
- GitHub OAuth credentials match
- Callback URL is `https://api.netlify.com/auth/done`
- Environment variables are set in both Vercel and Netlify

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito mode
3. Check browser console for errors

### Failover Not Working

**Check**:
- Both `www.alphaross.com` and `cms-backup.alphaross.com` are accessible
- Browser has JavaScript enabled
- No Content Security Policy blocking requests

**Solution**:
```javascript
// Manual test in browser console
fetch('https://www.alphaross.com/cms', { method: 'HEAD', mode: 'no-cors' })
  .then(() => console.log('Primary available'))
  .catch(() => console.log('Primary unavailable'))
```

## Monitoring

### Health Check Details

The frontend performs automatic health checks:
- **Interval**: Every 30 seconds
- **Timeout**: 5 seconds per check
- **Actions**:
  - If primary unavailable → switches to backup
  - Shows warning message to user
  - Logs to browser console

Check the console for messages like:
```
[CMS Failover] Primary CMS unavailable, switching to backup: https://cms-backup.alphaross.com/cms
```

## Security Notes

- **OAuth Secrets**: Stored only in GitHub Actions and hosting platforms
- **Never commit**: `.env` files with secrets
- **Rotate tokens**: Periodically update GitHub and OAuth tokens
- **Monitor**: Check deployment logs for errors or suspicious activity

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Decap CMS Docs**: https://decapcms.org/docs/intro/
- **GitHub Actions**: https://docs.github.com/en/actions

## Next Steps

1. ✅ Complete all steps above
2. Test both primary and backup sites
3. Monitor first deployment in GitHub Actions
4. Configure DNS failover if needed (optional)
5. Set up monitoring alerts (optional)
