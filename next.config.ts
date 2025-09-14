import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 自动处理优化，不需要 output: 'export'
  // 保留 trailingSlash 用于 SEO 友好的 URL
  trailingSlash: true,
  // Vercel 支持图片优化，移除 unoptimized
};

export default nextConfig;
