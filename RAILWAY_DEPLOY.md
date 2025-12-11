# Развертывание Backend на Railway

## Шаг 1: Подготовка проекта

Убедитесь, что все файлы закоммичены в Git:
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push
```

## Шаг 2: Создание проекта на Railway

1. Перейдите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите "Deploy from GitHub repo"
5. Выберите ваш репозиторий

## Шаг 3: Настройка переменных окружения

В Railway добавьте следующие переменные окружения:

### Обязательные переменные:
- `NODE_ENV` = `production`
- `PORT` = `${{PORT}}` (Railway автоматически установит порт)

### Опциональные переменные (если используются):
- `FRONTEND_URL` = URL вашего frontend (например, `https://your-app.vercel.app`)
- `GITHUB_TOKEN` = ваш GitHub токен (если используется)
- `PING_MESSAGE` = любое сообщение для тестирования

### Если используете Builder.io:
- `VITE_PUBLIC_BUILDER_KEY` = ваш Builder.io API ключ

## Шаг 4: Настройка домена (опционально)

1. В Railway перейдите в Settings → Networking
2. Нажмите "Generate Domain" для получения бесплатного домена Railway
3. Или добавьте свой кастомный домен

## Шаг 5: Деплой

Railway автоматически:
- Установит зависимости через `pnpm install`
- Соберет проект через `pnpm run build:all`
- Запустит сервер через `node dist/server/dev.js`

## Шаг 6: Проверка

После успешного деплоя проверьте:
- Health check: `https://your-app.railway.app/health`
- API endpoint: `https://your-app.railway.app/api/ping`

## Структура проекта

```
├── server/           # Backend код
├── client/           # Frontend код (не деплоится на Railway)
├── railway.json      # Конфигурация Railway
├── nixpacks.toml     # Конфигурация сборки
└── Procfile          # Команда запуска
```

## Обновление приложения

Railway автоматически пересобирает и деплоит при каждом push в GitHub.

## Логи и мониторинг

Просматривайте логи в реальном времени:
1. Откройте ваш проект в Railway
2. Перейдите в раздел "Deployments"
3. Нажмите на активный деплой
4. Откройте вкладку "Logs"

## Troubleshooting

### Ошибка сборки
- Проверьте, что все зависимости указаны в `package.json`
- Убедитесь, что `pnpm-lock.yaml` закоммичен

### Ошибка запуска
- Проверьте логи в Railway
- Убедитесь, что `dist/server/dev.js` создается при сборке

### CORS ошибки
- Добавьте URL вашего frontend в переменную `FRONTEND_URL`
- Проверьте настройки CORS в `server/index.ts`

## Подключение Frontend к Backend

После деплоя обновите URL API в вашем frontend:

```typescript
// В файле client/lib/api-config.ts или аналогичном
const API_URL = import.meta.env.PROD 
  ? 'https://your-app.railway.app'
  : 'http://localhost:5000';
```

## Стоимость

Railway предоставляет:
- $5 бесплатных кредитов каждый месяц
- Pay-as-you-go после использования кредитов
- Примерная стоимость: $5-10/месяц для небольших приложений
