import type { NextConfig } from "next";

/**
 * Cabeceras para todas las respuestas. Van acá y no en netlify.toml porque
 * en Netlify las páginas las sirve el runtime de Next, que ignora las
 * cabeceras de netlify.toml (esas solo alcanzan a los archivos de /public).
 */
const securityHeaders = [
  // Demo: ningún buscador debe indexarla. Quitar al publicar el sitio real.
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
