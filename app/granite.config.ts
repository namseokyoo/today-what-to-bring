import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "today-what-to-bring",
  brand: {
    displayName: "오늘 뭐 챙기지?",
    primaryColor: "#E0B20C", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: "", // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
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
