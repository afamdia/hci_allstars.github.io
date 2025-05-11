import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },

  // these three lines are key for GH Pages
  assetPrefix: isProd ? '/hci_allstars.github.io/' : '',
  basePath:   isProd ? '/hci_allstars.github.io'  : '',
  trailingSlash: true,
};

export default nextConfig;
