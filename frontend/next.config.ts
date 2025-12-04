import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    return {
      beforeFiles: [
        {
          source: "/api/stems",
          destination: `${backendUrl}/api/stems`,
        },
        {
          source: "/api/tempo",
          destination: `${backendUrl}/api/tempo`,
        },
      ],
    };
  },
};

export default nextConfig;
