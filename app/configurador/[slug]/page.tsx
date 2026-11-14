import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { availableModels, getModel, site } from "@/content/site";
import { Configurator } from "@/components/configurator/Configurator";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

// Solo los modelos disponibles tienen configurador.
export function generateStaticParams() {
  return availableModels.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return {};
  const title = `Armá tu ${model.name}`;
  const description = `Elegí tu pick up, sumá opcionales y mirá el presupuesto de tu ${model.name} al instante. Lo mandás por WhatsApp.`;
  return {
    title,
    description,
    alternates: { canonical: `/configurador/${model.slug}` },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      url: `/configurador/${model.slug}`,
      images: [
        {
          url: model.hero ? `/og/${model.slug}.jpg` : "/og/home.jpg",
          width: 1200,
          height: 630,
          alt: model.hero?.alt ?? site.name,
        },
      ],
    },
  };
}

export default async function ConfiguratorPage({ params }: Props) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model || model.status === "proximamente") notFound();

  return (
    <Suspense fallback={<div className="min-h-screen bg-hormigon" />}>
      <Configurator model={model} />
    </Suspense>
  );
}
