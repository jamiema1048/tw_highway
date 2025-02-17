import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import magicalSvg from "vite-plugin-magical-svg";

export default defineConfig({
  plugins: [
    react(),
    magicalSvg({
      target: "react",
    }),
  ],
  test: {
    globals: true, // 允許 describe、it、expect 等全局測試函數
    environment: "jsdom",
    setupFiles: "./vitest.setup.js", // 設定全局初始化檔案
    coverage: {
      provider: "istanbul", // 啟用測試覆蓋率
      reporter: ["text", "json", "html"], // 生成多種格式的測試報告
    },
    testTimeout: 10000, // 測試超時時間（避免 API 測試時 timeout）
  },
  resolve: {
    alias: {
      "@": "/src", // 設置 @ 為 src 路徑，方便 import
    },
  },
});
