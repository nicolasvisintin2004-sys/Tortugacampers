import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModel, models, site, specLabels, type SpecKey } from "@/content/site";
import { siteUrl } from "@/lib/format";
import { JsonLd } from "@/components/JsonLd";
import {
  ModelCompare,
  ModelCompatibility,
  ModelCta,
  ModelEquipment,
  ModelGallery,
  ModelHero,
  ModelSpecs,
  UpcomingModel,
} from "@/components/model/ModelSections";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}

const plain = (text: string) => text.replace(/\s*\[A confirmar\]\.?/g, "").trim();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return {};

  const upcoming = model.status === "proximamente";
  const title = upcoming ? `${model.name}, próximamente` : `${model.name}, camper off road para pick up`;
  const description = upcoming
    ? `El ${model.name} está en desarrollo. Pedí que te avisemos por WhatsApp cuando salga.`
    : plain(`${model.forWho} ${model.intro}`);
  const ogImage = model.hero ? `/og/${model.slug}.jpg` : "/og/home.jpg";

  return {
    title,
    description,
    alternates: { canonical: `/modelos/${model.slug}` },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      url: `/modelos/${model.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: model.hero?.alt ?? site.name }],
    },
  };
}

export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();

  if (model.status === "proximamente") return <UpcomingModel model={model} />;

  const url = siteUrl();
  const specKeys = Object.keys(specLabels) as SpecKey[];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${site.name} ${model.name}`,
          description: plain(`${model.forWho} ${model.intro}`),
          category: "Camper para pick up",
          brand: { "@type": "Brand", name: site.name },
          url: `${url}/modelos/${model.slug}`,
          ...(model.gallery.length > 0 && {
            image: model.gallery.slice(0, 6).map((img) => `${url}${img.src}`),
          }),
          additionalProperty: [
            ...specKeys
              .filter((k) => model.specs[k] !== null)
              .map((k) => ({
                "@type": "PropertyValue",
                name: specLabels[k],
                value: model.specs[k],
              })),
            ...model.extraSpecs.map((s) => ({
              "@type": "PropertyValue",
              name: s.label,
              value: s.value,
            })),
          ],
          // Solo se publica oferta cuando el precio es real, no de ejemplo.
          ...(model.price?.status === "publicado" && {
            offers: {
              "@type": "Offer",
              price: model.price.amount,
              priceCurrency: site.currency,
              availability: "https://schema.org/MadeToOrder",
              url: `${url}/configurador/${model.slug}`,
            },
          }),
        }}
      />
      <ModelHero model={model} />
      <ModelGallery model={model} />
      <ModelSpecs model={model} />
      <ModelEquipment model={model} />
      <ModelCompatibility model={model} />
      <ModelCompare model={model} />
      <ModelCta model={model} />
    </>
  );
}
