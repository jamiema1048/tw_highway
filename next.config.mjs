// next.config.mjs
const nextConfig = {
  images: {
    unoptimized: true, // 允許加載 public/ 內的本地圖片
  },
  typescript: {
    // ⚠ 重要：這行會讓 Vercel 忽略所有的 TypeScript 錯誤，強行完成編譯
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠ 同時建議加上這行，忽略 ESLint 的警告（如：定義了但沒使用的變數）
    ignoreDuringBuilds: true,
  }, //prototype測試完拔掉
};

export default nextConfig;
