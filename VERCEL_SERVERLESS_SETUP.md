# 🚀 Vercel Serverless API Setup

## Обзор

Проект переписан для использования **Vercel Serverless Functions** вместо Express.

### Структура API

```
api/
├── index.ts           # Главный endpoint (список всех API)
├── health.ts          # GET /health - проверка работоспособности
├── ping.ts            # GET /api/ping - тестовый endpoint
├── demo.ts            # GET /api/demo - демо данные
├── menu.ts            # GET /api/menu - меню контент
├── get-links.ts       # GET /api/get-links - получение ссылок из GitHub
├── save-link.ts       # POST /api/save-link - сохранение ссылки в GitHub
├── send-message.ts    # POST /api/send-message - отправка сообщения
├── nft-collection.ts  # GET /api/nft-collection - NFT коллекция
├── youtube-duration.ts # GET /api/youtube-duration - длительность YouTube видео
├── opensea-collection.ts # GET /api/opensea-collection - OpenSea/Objkt коллекции
└── cms-config.ts      # GET /admin/config.json - CMS конфигурация
```

## Формат Vercel Serverless Function

Каждый файл экспортирует функцию-обработчик:

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Ваша логика
  return res.status(200).json({ message: "Hello" });
}
```

## Переменные окружения

Добавьте в Vercel Settings → Environment Variables:

```env
# Для сохранения ссылок в GitHub
GITHUB_TOKEN=github_pat_...
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo-name

# Опционально
PING_MESSAGE=Hello from Vercel!
NODE_ENV=production
```

## Деплой

1. Закоммитьте изменения:
```bash
git add .
git commit -m "Migrate to Vercel Serverless Functions"
git push
```

2. Vercel автоматически задеплоит проект

## Проверка

После деплоя проверьте endpoints:

- `https://your-app.vercel.app/health`
- `https://your-app.vercel.app/api/ping`
- `https://your-app.vercel.app/api/demo`
- `https://your-app.vercel.app/api/get-links`

## Отличия от Express

| Express | Vercel Serverless |
|---------|-------------------|
| `import { Router } from "express"` | `import type { VercelRequest, VercelResponse } from "@vercel/node"` |
| `router.get("/path", handler)` | `export default function handler(req, res)` |
| `req.body` (после middleware) | `req.body` (автоматически парсится) |
| `res.status(200).json({})` | `res.status(200).json({})` |
| Один сервер для всех routes | Каждый файл = отдельная функция |

## Troubleshooting

### API возвращает 404
- Проверьте, что файл существует в `/api/`
- Проверьте `vercel.json` rewrites

### CORS ошибки
- Убедитесь, что CORS headers добавлены в каждую функцию
- Обработайте OPTIONS запросы

### Переменные окружения не работают
- Добавьте их в Vercel Dashboard
- Сделайте redeploy после добавления
│   ├── index.ts                  ← Express app creation
│   ├── node-build.ts             ← Entry point (exports app)
│   ├── dev.ts                    ← Local dev server (with listen)
│   ├── routes/                   ← API routes
│   │   ├── get-links.ts
│   │   ├── save-link.ts
│   │   ├── send-message.ts
│   │   └── ...
│   └── lib/
│       └── github-client.ts      ← GitHub API client
├── public/                        ← Static assets, admin config
│   ├── admin/
│   │   ├── config.yml
│   │   └── index.html
│   ├── menu.json
│   └── ...
├── dist/                          ← Build output (production)
│   ├── spa/                       ← Static frontend
│   └── server/                    ← Compiled Express server
├── package.json
├── vercel.json                    ← Vercel configuration
├── .vercelignore                  ← Files to exclude from Vercel
├── vite.config.ts                 ← Client build config
└── vite.config.server.ts          ← Server build config
```

## Build Configuration

### vite.config.server.ts

The server is compiled with:
- **Target**: Node.js 20.x (Vercel runtime)
- **Format**: ESM (.mjs files)
- **Externals**: All `node_modules` dependencies (reduces bundle size)
- **Output**: `dist/server/production.mjs`

Key dependencies marked as external:
- `express` - HTTP framework
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `js-yaml` - YAML parser
- `zod` - Validation library
- All Node.js built-ins

This ensures the server bundle is small and dependencies are provided by Vercel's runtime.

## Vercel Configuration

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/spa",
  "framework": "vite",
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x",
      "maxDuration": 30
    }
  }
}
```

**Key settings:**
- `buildCommand`: Runs `npm run build` (both client and server)
- `outputDirectory`: Points to `dist/spa` for static files
- `framework`: Tells Vercel it's a Vite project
- `functions`: API routes use Node.js 20.x with 30s timeout
- Rewrites: `/api/:path*` redirects to serverless function

### .vercelignore

Excludes unnecessary files to reduce deployment size:
- Source code (`server/`, `client/`, `shared/`)
- Documentation files
- Build config files
- `node_modules/`, `.env` files

## Deployment Steps

### 1. Connect Repository

```bash
# If using GitHub, Vercel auto-imports your repo
# Or manually connect via Vercel dashboard
vercel --prod
```

### 2. Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
GITHUB_TOKEN = <your-fine-grained-token>
GITHUB_OWNER = <your-github-username>
GITHUB_REPO = <your-repository-name>
PING_MESSAGE = (optional)
```

### 3. Deploy

```bash
# Automatic: Push to main branch
git push origin main

# Or manual:
vercel --prod
```

## Development vs Production

### Local Development (`npm run dev`)

Uses Vite dev server with middleware:
- Frontend: Vite dev server on port 8080
- API: Express app served via Vite middleware
- Hot reload for both frontend and backend

### Local Testing with Build (`npm run build && npm run start`)

Tests the production build locally:
- Frontend: Static from `dist/spa/`
- API: Express server via `tsx server/dev.ts`
- Mimics Vercel behavior
- Useful before deploying

### Production (Vercel)

- Frontend: Static files served by Vercel CDN
- API: Serverless functions (Node.js 20.x)
- Auto-scaling, no server management
- Built-in monitoring and logs

## API Routes

All API routes are defined in `server/routes/` and automatically available:

- `GET /api/ping` - Health check
- `GET /api/demo` - Demo endpoint
- `GET /api/menu` - Menu configuration
- `GET /api/cms-config` - CMS configuration
- `POST /api/send-message` - Contact form
- `GET /api/get-links` - Retrieve links from GitHub
- `POST /api/save-link` - Save link to GitHub
- `GET /api/nft-collection` - NFT collection data
- `GET /api/opensea-collection` - OpenSea integration
- `GET /api/youtube-duration` - YouTube duration calculator

## Troubleshooting

### Build Fails

**Check build logs:**
```bash
# Local build test
npm run build

# Check for TypeScript errors
npm run typecheck

# Check for linting issues
npm run format.fix
```

### API Routes Not Working

1. **Verify Vercel deployment:**
   - Check Vercel dashboard Deployments tab
   - View build logs for errors

2. **Test API locally:**
   ```bash
   npm run build
   npm start
   # Then test: curl http://localhost:3000/api/ping
   ```

3. **Check serverless function:**
   - Ensure `api/[...path].js` exists
   - Verify `dist/server/production.mjs` is built
   - Check Vercel function logs

### Environment Variables Not Loaded

```bash
# Verify in Vercel dashboard
# Settings → Environment Variables

# Test locally
echo $GITHUB_TOKEN

# Redeploy after adding variables
vercel --prod --force
```

### Static Files Not Serving

- Check that `public/` files are in `dist/spa/`
- Verify `vercel.json` points to `dist/spa`
- Check that `npm run build:client` completes successfully

## Performance Tips

### Serverless Function Duration

Current max: 30 seconds

For long operations, consider:
- Background jobs via GitHub Actions
- Database-backed operations
- Queue systems (e.g., Bull, BullMQ)

### Bundle Size

Check server bundle size:
```bash
npm run build:server
du -h dist/server/production.mjs
```

Current approach keeps it small by:
- Using external dependencies
- No bundling of `node_modules`
- Minified output

### Caching

Static assets are cached with:
- Cache-Control headers for public files
- Admin config: 1 hour
- Menu data: 1 hour

## Advanced Configuration

### Custom Domain

In Vercel Dashboard:
1. Settings → Domains
2. Add your domain
3. Update DNS records

### Regional Deployment

Vercel automatically deploys to edge locations. For specific region:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/spa",
  "regions": ["sjc1"]  // Silicon Valley
}
```

### Monitoring

Enable in Vercel Dashboard:
- Analytics
- Real-time logs
- Error tracking
- Performance monitoring

## Migration from Traditional Server

If migrating from a traditional Node.js server:

1. **Export app instead of listening:**
   - ✅ Now: `export default app;`
   - ❌ Before: `app.listen(3000)`

2. **Move environment config:**
   - Use Vercel Environment Variables
   - Not `.env` files

3. **Database connections:**
   - Use serverless-compatible databases
   - Connection pooling recommended
   - Examples: Neon PostgreSQL, PlanetScale MySQL, Supabase

4. **File uploads:**
   - Use cloud storage (S3, Cloudinary, etc.)
   - Can't write to `/tmp` in serverless

5. **Long-running tasks:**
   - Use background job queues
   - Or trigger via Vercel Cron Jobs

## Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Express on Vercel](https://vercel.com/docs/functions/serverless-functions/node-js)
- [Vite Deployment](https://vitejs.dev/guide/ssr.html)
- [Next.js vs Express on Vercel](https://vercel.com/docs/frameworks)
