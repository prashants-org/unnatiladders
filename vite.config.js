import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  base: "/",
  plugins: [react()],
  // The server build (src/entry-server.jsx -> dist-ssr/) only renders HTML at build time;
  // it doesn't need its own copy of public/.
  build: { copyPublicDir: !isSsrBuild },
}));
