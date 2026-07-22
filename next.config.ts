import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 2026-07-22 her call: the address bar must stay clean at hahaijia.com.
  // The quiet-luxury homepage still LIVES at app/v2/* — the root URL serves
  // it via an internal rewrite (no visible /v2), and direct /v2 hits bounce
  // back to / so old links keep working. beforeFiles is required: a plain
  // rewrite would lose to the old app/page.tsx filesystem route.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/v2",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    return [
      {
        source: "/v2",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
