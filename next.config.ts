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
        source: "/free-tools",
        destination: "/finance",
        permanent: true,
      },
      {
        source: "/free-tools/car-loan-calculator",
        destination: "/finance/car-loan-calculator",
        permanent: true,
      },
      {
        source: "/free-tools/compound-interest-calculator",
        destination: "/finance/compound-interest-calculator",
        permanent: true,
      },
      {
        source: "/free-tools/discount-calculator",
        destination: "/finance/discount-calculator",
        permanent: true,
      },
      {
        source: "/free-tools/emi-calculator",
        destination: "/finance/emi-calculator",
        permanent: true,
      },
      {
        source: "/free-tools/mortgage-calculator",
        destination: "/finance/mortgage-calculator",
        permanent: true,
      },
      {
        source: "/free-tools/profit-margin-calculator",
        destination: "/finance/profit-margin-calculator",
        permanent: true,
      },
      {
        source: "/free-tools/salary-calculator",
        destination: "/finance/salary-calculator",
        permanent: true,
      },
      {
        source: "/free-tools/uae-salary-calculator",
        destination: "/finance/uae-salary-calculator",
        permanent: true,
      },
      {
        source: "/free-tools/vat-calculator",
        destination: "/finance/vat-calculator",
        permanent: true,
      },
      {
        source: "/free-tools/word-frequency-counter",
        destination: "/text/word-frequency",
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
