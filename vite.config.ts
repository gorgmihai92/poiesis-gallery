// The gallery shows poiesis-components' set (shadcn/ui themed by poiesis-ui): the components, the tokens and the
// theme are read in place from a poiesis-design checkout, never copied. POIESIS_DESIGN points at another checkout; by default
// it is the sibling folder ../poiesis-design.
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const DESIGN = resolve(process.env.POIESIS_DESIGN ?? resolve(__dirname, "../poiesis-design"));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  resolve: {
    dedupe: ["react", "react-dom", "radix-ui", "class-variance-authority", "clsx", "tailwind-merge", "lucide-react"],
    alias: {
      "@/components/ui": resolve(DESIGN, "plugins/poiesis-components/skills/components/library"),
      "@": resolve(__dirname, "src"),
      "@poiesis-ui": resolve(DESIGN, "plugins/poiesis-ui/skills/ui/tokens"),
    },
  },
  server: { fs: { allow: [__dirname, DESIGN] } },
});
