import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "today-what-to-bring",
  brand: {
    displayName: "오늘 뭐 챙기지?",
    primaryColor: "#E0B20C",
    icon: "https://raw.githubusercontent.com/namseokyoo/today-what-to-bring/main/app/public/app-icon.png",
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
});
