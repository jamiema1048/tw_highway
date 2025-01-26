const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    globals: true, // 啟用全局語法 (describe、it 等)
    environment: "jsdom", // 使用 jsdom 模擬瀏覽器環境
    setupFiles: "./vitest.setup.js", // 全局設定檔案
  },
  resolve: {
    alias: {
      "@": "/src", // 根據專案結構設置别名
    },
  },
});
