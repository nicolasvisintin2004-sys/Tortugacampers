"use client";

import Link from "next/link";
import { useState } from "react";
import {
  availableModels,

  homeConfigurator,
  options,
  site,
} from "@/content/site";
import { cx, formatPrice } from "@/lib/format";
import { isExampleQuote } from "@/lib/configurator";
import { ArrowIcon, CheckIcon, OptionIcon } from "@/components/icons";
import { Odometer } from "@/components/Odometer";
import { ExampleTag } from "@/components/ui";

const miniOptions = homeConfigurator.optionIds
  .map((id) => options.find((o) => o.id === id))
  .filter((o) => o !== undefined);

/** Versión simplificada del configurador: modelo + 3 opcionales + total. */
export function MiniConfigurator() {
  const [slug, setSlug] = useState(availableModels[0].slug);
  const [picked, setPicked] = useState<string[]>([]);

  const model = availableModels.find((m) => m.slug === slug)!;
  const base = model.price?.amount ?? 0;
  const extras = miniOptions.filter((o) => picked.includes(o.id));
  const total = base + extras.reduce((sum, o) => sum + o.price, 0);
  const example = isExampleQuote(model, picked);
  const href = `/configurador/${slug}${picked.length ? `?op=${picked.join(",")}` : ""}`;

  const toggle = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-stretch lg:gap-14">
      <div className="space-y-9">
        <fieldset>
          <legend className="label text-asfalto/80">1 · Elegí el modelo</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {availableModels.map((m) => {
              const active = m.slug === slug;
              return (
                <label
                  key={m.slug}
                  className={cx(
                    "focus-ring-within flex min-h-[3.75rem] cursor-pointer items-center justify-center border-2 border-asfalto px-2 text-center font-display text-[1.375rem] font-bold uppercase leading-[0.95] tracking-wide transition-colors sm:text-2xl",
                    active ? "bg-asfalto text-amarillo" : "text-asfalto hover:bg-asfalto/10",
                  )}
                >
                  <input
                    type="radio"
                    name="mini-modelo"
                    value={m.slug}
                    checked={active}
                    onChange={() => setSlug(m.slug)}
                    className="sr-only"
                  />
                  {m.name}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="label text-asfalto/80">2 · Sumá opcionales</legend>
          <div className="mt-3 border-t-2 border-asfalto">
            {miniOptions.map((o) => {
              const active = picked.includes(o.id);
              return (
                <label
                  key={o.id}
                  className="focus-ring-within flex min-h-[4.25rem] cursor-pointer items-center gap-3.5 border-b-2 border-asfalto py-3 transition-colors hover:bg-asfalto/[0.06]"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggle(o.id)}
                    className="sr-only"
                  />
                  <OptionIcon name={o.icon} className="shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.0625rem] font-semibold leading-tight">{o.name}</span>
                    <span className="nums mt-0.5 block text-[0.9375rem] text-asfalto/75">
                      + {formatPrice(o.price)}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={cx(
                      "flex h-8 w-8 shrink-0 items-center justify-center border-2 border-asfalto transition-colors",
                      active ? "bg-asfalto text-amarillo" : "text-transparent",
                    )}
                  >
                    <CheckIcon />
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Total: el odómetro */}
      <div className="chamfer-lg flex flex-col justify-between bg-asfalto p-6 text-white lg:p-9">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="label text-casco">3 · Mirá el total</p>
            {example && <ExampleTag />}
          </div>
          <p className="mt-6 flex items-baseline gap-3 text-amarillo">
            <span className="font-display text-[1.75rem] font-bold leading-none tracking-wide">
              {site.currency}
            </span>
            <Odometer
              value={total}
              className="font-display text-[clamp(4.5rem,23vw,7rem)] font-extrabold lg:text-[7.5rem]"
            />
          </p>
          <p className="sr-only" aria-live="polite">
            Total estimado: {formatPrice(total)}
          </p>
          <p className="nums mt-4 text-[0.9375rem] text-white/70">
            {model.name} {formatPrice(base)}
            {extras.length > 0 &&
              ` + ${extras.length} ${extras.length === 1 ? "opcional" : "opcionales"}`}
          </p>
        </div>

        <Link href={href} className="btn btn-yellow mt-8 w-full">
          Abrir el configurador completo <ArrowIcon className="max-[420px]:hidden" />
        </Link>
      </div>
    </div>
  );
}
