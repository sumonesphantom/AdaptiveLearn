import type { NextConfig } from "next";

const ML_URL = process.env.ML_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The Python ML service (BKT mastery + plan) sits behind /ml/* so the browser talks to one origin.
  async rewrites() {
    return [{ source: "/ml/:path*", destination: `${ML_URL}/:path*` }];
  },
};

export default nextConfig;
