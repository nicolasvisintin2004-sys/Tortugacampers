import Link from "next/link";
import type { Model } from "@/content/site";
import { cx } from "@/lib/format";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";
import { Blueprint, Pending, Photo, PriceFrom, WithPending } from "@/components/ui";

export function StatusTag({ model, className }: { model: Model; className?: string }) {
  return (
    <span
      className={cx(
        "label inline-block px-2.5 py-1.5 text-[0.625rem] font-semibold",
        model.status === "lanzamiento" && "bg-amarillo text-asfalto",
        model.status === "disponible" && "bg-white text-asfalto",
        model.status === "proximamente" && "border border-white/40 text-white",
        className,
      )}
    >
      {model.statusLabel}
    </span>
  );
}

/** Panel tipográfico para modelos que todavía no tienen fotos. */
export function NoPhoto({ model, className }: { model: Model; className?: string }) {
  return (
    <div
      className={cx(
        "chamfer-lg relative flex flex-col justify-between overflow-hidden bg-grafito p-5 text-white",
        className,
      )}
    >
      <Blueprint className="absolute -right-6 bottom-10 w-[115%] max-w-none text-white/25" />
      <span aria-hidden />
      <div className="relative">
        <p
          aria-hidden
          className="display text-[clamp(5rem,26vw,8.5rem)] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.9)] lg:text-[clamp(5rem,9vw,8rem)]"
        >
          {model.name}
        </p>
        <p className="mt-3 text-sm text-white/75">
          Fotos <Pending />
        </p>
      </div>
    </div>
  );
}

/** Tarjeta de modelo disponible: foto, para quién es, precio y dos acciones. */
export function ModelCard({
  model,
  sizes,
  hideLine = false,
}: {
  model: Model;
  sizes: string;
  /** Oculta "Línea …" cuando la tarjeta ya está dentro del bloque de su línea. */
  hideLine?: boolean;
}) {
  const href = `/modelos/${model.slug}`;
  return (
    <article className="flex h-full flex-col">
      <Link href={href} className="group relative block" tabIndex={-1} aria-hidden>
        {model.hero ? (
          <Photo image={model.hero} sizes={sizes} className="aspect-[4/5]" />
        ) : (
          <NoPhoto model={model} className="aspect-[16/11] md:aspect-[4/5]" />
        )}
        <StatusTag model={model} className="absolute left-0 top-0" />
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        {!hideLine && <p className="label mb-2 text-acero">{model.line}</p>}
        <h3 className="display text-[3.5rem] lg:text-[4rem]">
          <Link href={href} className="hover:underline hover:decoration-2 hover:underline-offset-4">
            {model.name}
          </Link>
        </h3>
        <p className="mt-3 text-[1.0625rem] leading-snug text-acero">
          <WithPending text={model.forWho} />
        </p>
        <PriceFrom price={model.price} tone="light" className="mt-4 text-asfalto" />

        <div className="mt-auto grid grid-cols-2 gap-2.5 pt-6">
          <Link href={href} className="btn btn-white">
            Ver modelo
          </Link>
          <Link href={`/configurador/${model.slug}`} className="btn btn-black">
            Configurar
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Tarjeta corta para modelos en desarrollo. */
export function UpcomingCard({ model, compact = false }: { model: Model; compact?: boolean }) {
  return (
    <article className="chamfer-lg relative overflow-hidden bg-asfalto p-5 text-white lg:p-7">
      <Blueprint className="pointer-events-none absolute -right-10 -top-2 w-64 text-white/20 lg:w-80" />
      <div className="relative">
        <StatusTag model={model} />
        <h3 className={cx("display text-[2.75rem] lg:text-[3.5rem]", compact ? "mt-10 lg:mt-12" : "mt-14 lg:mt-20")}>
          <Link href={`/modelos/${model.slug}`} className="hover:text-amarillo">
            {model.name}
          </Link>
        </h3>
        <p className="mt-2 text-white/70">En desarrollo.</p>
        <a
          href={whatsappLink(messages.notify(model.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-graphite btn-sm mt-5"
        >
          <WhatsAppIcon size={18} /> Avisame cuando salga
        </a>
      </div>
    </article>
  );
}
