import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  devIndicators: false,

  experimental: {
    reactPerformance: false, // 👈 disable internal React performance metrics
  },
};

export default nextConfig;
