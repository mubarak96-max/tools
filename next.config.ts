import type { NextConfig } from "next";

const firebaseStorageBucket = (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "").replace(
  /^gs:\/\//,
  "",
);

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: firebaseStorageBucket
      ? [
          {
            protocol: "https",
            hostname: "firebasestorage.googleapis.com",
            pathname: `/v0/b/${firebaseStorageBucket}/o/**`,
          },
          {
            protocol: "https",
            hostname: "storage.googleapis.com",
            pathname: `/${firebaseStorageBucket}/**`,
          },
        ]
      : [],
  },
  async redirects() {
    return [
      {
        source: "/free-tools/word-frequency-counter",
        destination: "/text/word-frequency",
        permanent: true,
      },
      {
        source: "/free-tools",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
