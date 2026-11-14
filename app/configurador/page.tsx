import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { availableModels, upcomingModels } from "@/content/site";
import { formatPrice } from "@/lib/format";
import { ArrowIcon } from "@/components/icons";
import { Blueprint, ExampleTag, Pending, WithPending } from "@/components/ui";

export const metadata: Metadata = {
  title: "Armá el tuyo",
  description:
    "Elegí el modelo de camper para tu pick up, sumale opcionales y mirá el presupuesto al instante.",
  alternates: { canonical: "/configurador" },
};

export default function ConfiguratorIndex() {
  return (
    <div className="bg-hormigon text-asfalto">
      <div className="bg-asfalto text-white">
        <div className="wrap pb-8 pt-7 lg:pb-12 lg:pt-12">
          <p className="label text-casco">Configurador</p>
          <h1 className="display mt-3 text-[clamp(3.25rem,14vw,6.5rem)]">Armá el tuyo</h1>
          <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-white/75">
            Primero elegí el modelo. Después le sumás tu pick up y los opcionales, y te llevás el
            presupuesto para mandarnos por WhatsApp.
          </p>
        </div>
      </div>

      <div className="wrap pb-24 pt-8 lg:pb-32 lg:pt-12">
        <h2 className="display text-[2.75rem] lg:text-[3.5rem]">Elegí el modelo</h2>
        <ul className="mt-6 grid gap-3 lg:grid-cols-3 lg:gap-6">
          {availableModels.map((model) => (
            <li key={model.slug}>
              <Link
                href={`/configurador/${model.slug}`}
                className="group grid h-full grid-cols-[5.5rem_1fr_auto] items-center gap-4 border-2 border-transparent bg-white p-3 transition-colors hover:border-asfalto lg:grid-cols-1 lg:items-start lg:gap-0 lg:p-0"
              >
                <span className="relative block aspect-[4/5] overflow-hidden bg-grafito lg:aspect-[4/3] lg:w-full">
                  {model.hero ? (
                    <Image
                      src={model.hero.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, 6rem"
                      className="object-cover"
                      style={{ objectPosition: model.hero.focus }}
                    />
                  ) : (
                    <Blueprint className="absolute left-1/2 top-1/2 w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 text-white/40 lg:w-[90%]" />
                  )}
                </span>
                <span className="min-w-0 lg:block lg:p-6">
                  <span className="display block text-[2.25rem] lg:text-[3.25rem]">{model.name}</span>
                  <span className="mt-1 block text-sm leading-snug text-acero lg:mt-2 lg:text-base">
                    <WithPending text={model.forWho} />
                  </span>
                  <span className="nums mt-2 flex flex-wrap items-center gap-2 font-semibold lg:mt-4">
                    {model.price ? `Desde ${formatPrice(model.price.amount)}` : <Pending />}
                    {model.price?.status === "ejemplo" && <ExampleTag tone="light" short />}
                  </span>
                  <span className="mt-5 hidden items-center gap-2 font-display text-xl font-bold uppercase tracking-wide lg:flex">
                    Configurar <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
                <ArrowIcon className="mr-1 lg:hidden" />
              </Link>
            </li>
          ))}
        </ul>

        {upcomingModels.length > 0 && (
          <p className="mt-8 text-acero">
            En desarrollo, todavía sin configurador:{" "}
            {upcomingModels.map((m, i) => (
              <span key={m.slug}>
                <Link href={`/modelos/${m.slug}`} className="link font-semibold text-asfalto">
                  {m.name}
                </Link>
                {i < upcomingModels.length - 1 ? " y " : "."}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
