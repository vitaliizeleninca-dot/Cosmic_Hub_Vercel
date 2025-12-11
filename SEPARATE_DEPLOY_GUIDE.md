# Раздельный деплой: Frontend (Vercel) + Backend (Railway/Render/Fly.io)

## Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                        PRODUCTION                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────┐         ┌─────────────────────────┐  │
│   │   VERCEL        │         │   RAILWAY/RENDER/FLY    │  │
│   │   (Frontend)    │  ───►   │   (Backend)             │  │
│   │                 │  API    │                         │  │
│   │   dist/client   │  calls  │   Express Server        │  │
│   │   Static SPA    │         │   /api/* routes         │  │
│   └─────────────────┘         └─────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Локальная разработка

```bash
# Запуск dev-сервера (Vite + Express middleware)
pnpm dev

# Или запуск backend отдельно (порт 3001)
pnpm dev:server
```

## Сборка

```bash
# Сборка фронтенда
pnpm build:client    # → dist/client

# Сборка бэкенда
pnpm build:server    # → dist/server

# Сборка всего
pnpm build
```

---

## 1. Деплой Frontend на Vercel

### Шаг 1: Подключите репозиторий к Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте ваш GitHub репозиторий

### Шаг 2: Настройте Build Settings

Vercel автоматически определит настройки из `vercel.json`:
- **Build Command:** `npm run build:client`
- **Output Directory:** `dist/client`
- **Framework:** Vite

### Шаг 3: Добавьте Environment Variables

В настройках проекта Vercel добавьте:

```
VITE_API_URL=https://your-backend-url.railway.app
```

> ⚠️ Замените URL на реальный адрес вашего бэкенда после деплоя

### Шаг 4: Deploy

Нажмите "Deploy" и дождитесь завершения.

---

## 2. Деплой Backend на Railway (рекомендуется)

### Шаг 1: Создайте проект на Railway

1. Зайдите на [railway.app](https://railway.app)
2. Нажмите "New Project" → "Deploy from GitHub repo"
3. Выберите ваш репозиторий

### Шаг 2: Настройте Build Settings

В настройках сервиса:

```
Build Command: npm run build:server
Start Command: node dist/server/dev.js
```

### Шаг 3: Добавьте Environment Variables

```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend.vercel.app
```

Добавьте остальные переменные окружения (API ключи и т.д.)

### Шаг 4: Получите URL

После деплоя Railway выдаст URL вида:
`https://your-project.railway.app`

---

## 3. Альтернатива: Деплой Backend на Render

### Шаг 1: Создайте Web Service

1. Зайдите на [render.com](https://render.com)
2. Нажмите "New" → "Web Service"
3. Подключите GitHub репозиторий

### Шаг 2: Настройки

```
Build Command: npm run build:server
Start Command: node dist/server/dev.js
```

### Шаг 3: Environment Variables

```
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 4. Альтернатива: Деплой Backend на Fly.io

### Шаг 1: Установите flyctl

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

### Шаг 2: Создайте fly.toml

```toml
app = "your-app-name"
primary_region = "iad"

[build]
  builder = "heroku/buildpacks:20"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[services]]
  protocol = "tcp"
  internal_port = 8080

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

### Шаг 3: Создайте Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/server ./dist/server

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/server/dev.js"]
```

### Шаг 4: Деплой

```bash
fly launch
fly secrets set FRONTEND_URL=https://your-frontend.vercel.app
fly deploy
```

---

## 5. Финальная настройка

### Обновите VITE_API_URL на Vercel

После получения URL бэкенда, обновите переменную окружения на Vercel:

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Добавьте/обновите: `VITE_API_URL=https://your-backend-url`
3. Redeploy проект

### Проверьте CORS

Убедитесь, что `FRONTEND_URL` на бэкенде соответствует URL вашего фронтенда на Vercel.

---

## Структура проекта

```
├── client/                 # Frontend (React + Vite)
│   ├── lib/
│   │   └── api-config.ts   # API URL configuration
│   └── ...
├── server/                 # Backend (Express)
│   ├── index.ts            # Express app с CORS
│   ├── dev.ts              # Server entry point
│   └── routes/             # API routes
├── dist/
│   ├── client/             # Built frontend (Vercel)
│   └── server/             # Built backend (Railway/Render/Fly)
├── vercel.json             # Vercel config (frontend only)
└── package.json
```

---

## Переменные окружения

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.railway.app` |

### Backend (Railway/Render/Fly)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://app.vercel.app` |
| `PING_MESSAGE` | Custom ping message | `pong` |
| (other API keys) | Your API keys | ... |

---

## Troubleshooting

### CORS ошибки

Убедитесь, что:
1. `FRONTEND_URL` на бэкенде точно соответствует URL фронтенда
2. URL не содержит trailing slash

### API не работает

1. Проверьте логи бэкенда на Railway/Render
2. Убедитесь, что `VITE_API_URL` правильно настроен
3. Проверьте health endpoint: `https://your-backend/health`

### Build fails

1. Убедитесь, что все зависимости в `dependencies` (не `devDependencies`) для production
2. Проверьте версию Node.js (требуется 20.x)
