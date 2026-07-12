import type { NextConfig } from "next";

const apiUrl = (process.env["API_URL"] ?? "http://127.0.0.1:3001").replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/entries",
        destination: `${apiUrl}/entries`,
      },
    ];
  },
};

export default nextConfig;
