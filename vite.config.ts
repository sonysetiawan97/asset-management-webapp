import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import fs from "node:fs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port: number = Number.parseInt(env.VITE_APP_PORT) || 5173;
  const isDev = mode === "development";

  return {
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
    },

    base: env.VITE_APP_BASE_URL || "/",
    plugins: [
      react(),
      {
        name: "es-toolkit-compat-esm",
        enforce: "pre",
        resolveId(id) {
          if (id.startsWith("es-toolkit/compat/") && !id.endsWith(".js") && !id.endsWith(".mjs") && !id.endsWith(".ts")) {
            const fn = id.split("/").pop();
            return { id: `\0es-toolkit-compat-${fn}`, external: false };
          }
          return null;
        },
        load(id) {
          const prefix = "\0es-toolkit-compat-";
          if (!id.startsWith(prefix)) return null;
          const fn = id.slice(prefix.length);
          return `export { ${fn} as default } from "es-toolkit/compat";`;
        },
      },
    ],
    optimizeDeps: {
      exclude: ["es-toolkit"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@stores": path.resolve(__dirname, "./src/stores"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@modules": path.resolve(__dirname, "./src/modules"),
        "@context": path.resolve(__dirname, "./src/contexts"),
        "@types": path.resolve(__dirname, "./src/types"),
      },
      dedupe: ["react", "react-dom", "react-router-dom", "react-is", "es-toolkit"],
    },

    server: isDev
      ? {
          port,
          open: true,
          proxy: {
            "/api": {
              target: "http://localhost:8000",
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,

    build: {
      outDir: "dist",
      sourcemap: isDev,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "vendor";
              }
              if (id.includes("recharts") || id.includes("es-toolkit") || id.includes("d3-")) {
                return "charts";
              }
            }
          },
        },
        external:
          fs.existsSync("node_modules/msw") && env.VITE_APP_ENV === "production"
            ? ["msw"]
            : [],
      },
    },
  };
});
