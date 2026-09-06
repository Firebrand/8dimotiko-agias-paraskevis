import type { NextConfig } from "next";

import { legacyRedirects } from "./src/lib/legacy-redirects";

const nextConfig: NextConfig = {
  // The local dev preview is served over 127.0.0.1 as well as localhost.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // Sanity's CDN already serves right-sized images; these are the widths we ask for.
    qualities: [70, 75, 90],
  },
  // The Studio ships its own large client bundle; keep it out of the site's chunks.
  serverExternalPackages: ["@sanity/client"],
  async redirects() {
    // Next matches the *raw* pathname, but the legacy WordPress URLs are
    // percent-encoded Greek. Register the readable form plus both hex casings
    // so every old link resolves.
    return legacyRedirects.flatMap(({ source, destination, permanent }) => {
      const encoded = encodeURI(source);
      const variants = new Set([source, encoded, encoded.replace(/%[0-9A-F]{2}/g, (hex) => hex.toLowerCase())]);
      return [...variants].map((variant) => ({ source: variant, destination, permanent }));
    });
  },
};

export default nextConfig;
