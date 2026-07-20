import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The quiet-luxury site at /v2 IS the site (2026-07-19 launch): the
      // root now hands visitors straight to it. The old dark homepage stays
      // reachable in the codebase; delete this block to expose it again.
      {
        source: "/",
        destination: "/v2",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
