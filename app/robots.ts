import type { MetadataRoute } from "next";

// Demo: ningún buscador debe indexar este sitio.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
