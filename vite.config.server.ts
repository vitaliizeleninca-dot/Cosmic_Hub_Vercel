import { defineConfig } from "vite";
import path from "path";

// Server build configuration for Vercel Serverless Functions
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "server/node-build.ts"),
      name: "server",
      fileName: "production",
      formats: ["es"],
    },
    outDir: "dist/server",
    target: "node20", // Vercel Node.js 20.x runtime
    ssr: true,
    rollupOptions: {
      external: [
        // Node.js built-ins
        "fs",
        "path",
        "url",
        "http",
        "https",
        "os",
        "crypto",
        "stream",
        "util",
        "events",
        "buffer",
        "querystring",
        "child_process",
        "events",
        "util",
        "net",
        "tls",
        "zlib",
        "assert",
        "async_hooks",
        "module",
        "vm",
        "perf_hooks",
        "v8",
        "inspector",
        "trace_events",
        "repl",
        "worker_threads",
        "wasi",
        "async_hooks",
        // External dependencies that should not be bundled
        "express",
        "cors",
        "dotenv",
        "js-yaml",
        "zod",
        "decap-cms-app",
      ],
      output: {
        format: "es",
        entryFileNames: "[name].mjs",
      },
    },
    minify: false, // Keep readable for debugging
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
