import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { createServer } from "./server";

// ---------------------
// Plugin: копирование public после сборки
// ---------------------
function copyPublicPlugin(): Plugin {
  return {
    name: "copy-public",
    apply: "build",
    enforce: "post",
    closeBundle: async () => {
      const publicDir = path.resolve(__dirname, "public");
      const outDir = path.resolve(__dirname, "dist/client");

      try {
        if (fs.existsSync(publicDir)) {
          fs.cpSync(publicDir, outDir, { recursive: true, force: true });
          console.log(`✓ Copied public folder to ${outDir}`);

          const adminConfigPath = path.join(outDir, "admin", "config.yml");
          if (fs.existsSync(adminConfigPath)) {
            console.log(`✓ Verified admin/config.yml exists`);
          } else {
            console.warn(`✗ admin/config.yml not found after copy`);
          }
        }
      } catch (err) {
        console.error("Error copying public folder:", err);
      }
    },
  };
}

// ---------------------
// Plugin: Express middleware для dev
// ---------------------
function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}

// ---------------------
// Plugin: middleware для /canvas-data
// ---------------------
function canvasDataMiddleware(): Plugin {
  return {
    name: "canvas-data-middleware",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/canvas-data")) {
          // Проксируем в public, чтобы Vite мог отдавать файлы
          req.url = req.url.replace("/canvas-data", "/public/canvas-data");
        }
        next();
      });
    },
  };
}

// ---------------------
// Vite config
// ---------------------
export default defineConfig({
  server: {
    host: true, // "::" тоже можно, но host: true работает лучше в Tempo
    port: 8080,
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
    fs: {
      allow: [path.resolve(".")], // Разрешаем доступ ко всем файлам проекта
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: { outDir: "dist/client" },
  publicDir: "public",
  assetsInclude: ["**/*.yml", "**/*.yaml"],
  plugins: [react(), copyPublicPlugin(), expressPlugin(), canvasDataMiddleware()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
