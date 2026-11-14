import { site, type Price } from "@/content/site";

const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/** 28000 -> "28.000" */
export const formatNumber = (n: number) => nf.format(n);

/** 28000 -> "USD 28.000" */
export const formatPrice = (n: number) => `${site.currency} ${formatNumber(n)}`;

export const isExample = (price: Price | null | undefined) => price?.status === "ejemplo";

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

/** URL pública del sitio: Netlify la inyecta en el build. */
export const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL ||
  "http://localhost:3000";

/** id estable para enlazar una pregunta frecuente. */
export const faqId = (q: string) =>
  q
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
