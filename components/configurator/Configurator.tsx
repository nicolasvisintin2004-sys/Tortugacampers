"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { m } from "framer-motion";
import {
  availableModels,
  cabinLabels,
  examplePricing,
  optionsNote,
  optionCategories,
  optionsFor,
  pickupBrands,
  provinces,
  site,
  timeframes,
  type Cabin,
  type Model,
} from "@/content/site";
import {
  OTHER_BRAND,
  STEPS,
  buildQuoteMessage,
  isExampleQuote,
  parseState,
  pickupLabel,
  selectedOptions,
  serializeState,
  toggleOptionIds,
  totalFor,
  weightFor,
  type ConfigState,
  type Contact,
} from "@/lib/configurator";
import { cx, formatNumber, formatPrice } from "@/lib/format";
import { messages, whatsappLink } from "@/lib/whatsapp";
import {
  ArrowIcon,
  CheckIcon,
  ChevronIcon,
  OptionIcon,
  DownloadIcon,
  ShareIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { Odometer } from "@/components/Odometer";
import { QuotePrint } from "@/components/configurator/QuotePrint";
import { Blueprint, ExampleTag, Pending, WithPending } from "@/components/ui";

const listWithO = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} o ${items[items.length - 1]}`;

export function Configurator({ model }: { model: Model }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  // El estado sale de la URL: así la configuración se puede compartir.
  const state = useMemo(
    () => parseState(new URLSearchParams(query), model.slug),
    [query, model.slug],
  );

  const [contact, setContact] = useState<Contact>({ name: "", province: "", when: "" });
  const [nameError, setNameError] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [otherText, setOtherText] = useState(state.brand === OTHER_BRAND ? (state.pickup ?? "") : "");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  const write = (next: ConfigState, mode: "push" | "replace" = "replace") => {
    const qs = serializeState(next);
    const url = qs ? `?${qs}` : window.location.pathname;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  };
  const update = (patch: Partial<ConfigState>) => write({ ...state, ...patch });

  const goTo = (step: number) => {
    setSheetOpen(false);
    write({ ...state, step }, "push");
  };

  // Al cambiar de paso: llevar el foco y la vista al título del paso.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    const top = headingRef.current?.getBoundingClientRect().top ?? 0;
    window.scrollTo({ top: window.scrollY + top - 96 });
  }, [state.step]);

  // Texto libre de "otra pick up": se guarda en la URL con una pausa corta.
  useEffect(() => {
    if (state.brand !== OTHER_BRAND) return;
    const value = otherText.trim();
    if (value === (state.pickup ?? "")) return;
    const t = setTimeout(() => update({ pickup: value || null }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherText, state.brand]);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  const allOptions = optionsFor(model.slug);
  const chosen = selectedOptions(model, state);
  const total = totalFor(model, state);
  const weight = weightFor(model, state);
  const [printUrl, setPrintUrl] = useState<string | null>(null);
  const pickup = pickupLabel(state);
  const example = isExampleQuote(model, state.options);
  const brand = pickupBrands.find((b) => b.id === state.brand);

  const shareUrl = () =>
    `${window.location.origin}/configurador/${model.slug}${(() => {
      const qs = serializeState(state, { withStep: false });
      return qs ? `?${qs}` : "";
    })()}`;

  const switchModel = (slug: string) => {
    if (slug === model.slug) return;
    const valid = new Set(optionsFor(slug).map((o) => o.id));
    const qs = serializeState({ ...state, options: state.options.filter((id) => valid.has(id)) });
    router.replace(`/configurador/${slug}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const toggleOption = (id: string) =>
    update({ options: toggleOptionIds(state.options, id) });

  const send = () => {
    if (!contact.name.trim()) {
      setNameError(true);
      if (state.step !== 4) goTo(4);
      setTimeout(() => nameRef.current?.focus(), 60);
      return;
    }
    const message = buildQuoteMessage(model, state, contact, shareUrl());
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  /** Abre el diálogo de impresión con la hoja de presupuesto (Guardar como PDF). */
  const downloadPdf = () => {
    setPrintUrl(shareUrl());
    const prev = document.title;
    // El nombre del PDF sale del título de la página.
    document.title = `Presupuesto ${model.name} — ${site.name}`;
    setTimeout(() => {
      window.print();
      document.title = prev;
    }, 80);
  };

  const share = async () => {
    const url = shareUrl();
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: `Mi ${model.name} — ${site.name}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareStatus("Link copiado. Pegalo donde quieras.");
    } catch {
      setShareStatus("No pudimos copiar el link. Copialo desde la barra de direcciones.");
    }
    setTimeout(() => setShareStatus(""), 4000);
  };

  const cabinWarning =
    state.cabin && model.cabins && !model.cabins.includes(state.cabin)
      ? `El ${model.name} está pensado para ${listWithO(model.cabins.map((c) => cabinLabels[c].toLowerCase()))}. Mandanos tu consulta igual y vemos qué modelo va con tu pick up.`
      : null;
  const pickupUnconfirmed =
    pickup && state.brand !== OTHER_BRAND && model.pickups && !model.pickups.some((p) => pickup.startsWith(p));

  const isLast = state.step === STEPS.length;

  /* ------------------------------ Resumen ------------------------------ */

  const summaryRows = (
    <dl className="nums text-[0.9375rem]">
      <div className="flex items-baseline justify-between gap-4 border-b border-white/15 py-3">
        <dt>
          <span className="block font-semibold">{model.name}</span>
          <span className="text-white/65">Precio base</span>
        </dt>
        <dd className="flex items-center gap-2 whitespace-nowrap font-semibold">
          {model.price?.status === "ejemplo" && <ExampleTag short />}
          {model.price ? formatPrice(model.price.amount) : <Pending />}
        </dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-b border-white/15 py-3">
        <dt className="text-white/65">Pick up</dt>
        <dd className="text-right font-medium">
          {pickup ?? <span className="text-white/65">Sin elegir</span>}
          {state.cabin && <span className="block text-white/65">{cabinLabels[state.cabin]}</span>}
        </dd>
      </div>
      {chosen.length === 0 ? (
        <div className="border-b border-white/15 py-3 text-white/65">Sin opcionales todavía</div>
      ) : (
        chosen.map((o) => (
          <div key={o.id} className="flex items-baseline justify-between gap-4 border-b border-white/15 py-3">
            <dt>{o.name}</dt>
            <dd className="whitespace-nowrap font-medium">+ {formatPrice(o.price)}</dd>
          </div>
        ))
      )}
      <div className="flex items-baseline justify-between gap-4 border-b border-white/15 py-3">
        <dt className="text-white/65">Peso estimado</dt>
        <dd className="text-right font-medium">
          {weight.total === null ? (
            <Pending />
          ) : (
            <>
              {formatNumber(weight.total)} kg
              <span className="block text-[0.8125rem] font-normal text-white/65">
                {weight.optionsPending > 0 ? (
                  <>
                    + peso de {weight.optionsPending === 1 ? "1 opcional" : `${weight.optionsPending} opcionales`}{" "}
                    <Pending />
                  </>
                ) : weight.options > 0 ? (
                  "con opcionales"
                ) : (
                  "en seco"
                )}
              </span>
            </>
          )}
        </dd>
      </div>
    </dl>
  );

  const totalBlock = (size: "lg" | "sm") => (
    <span className="flex items-baseline gap-2 text-amarillo">
      <span
        className={cx(
          "font-display font-bold leading-none tracking-wide",
          size === "lg" ? "text-2xl" : "text-base",
        )}
      >
        {site.currency}
      </span>
      <Odometer
        value={total}
        className={cx("font-display font-extrabold", size === "lg" ? "text-[4.5rem]" : "text-[2.375rem]")}
      />
    </span>
  );

  return (
    <>
    {printUrl && <QuotePrint model={model} state={state} contact={contact} shareUrl={printUrl} />}
    <div className="bg-hormigon text-asfalto print:hidden">
      <p className="sr-only" aria-live="polite">
        Total estimado: {formatPrice(total)}
      </p>

      {/* Encabezado + pasos */}
      <div className="bg-asfalto text-white">
        <div className="wrap pb-5 pt-7 lg:pb-8 lg:pt-12">
          <p className="label text-casco">Configurador</p>
          <h1 className="display mt-3 text-[clamp(3rem,13vw,5.5rem)]">Armá tu {model.name}</h1>

          <nav aria-label="Pasos del configurador" className="mt-6 lg:mt-9">
            <ol className="grid grid-cols-4 gap-1.5 lg:max-w-3xl lg:gap-3">
              {STEPS.map((label, i) => {
                const n = i + 1;
                const current = n === state.step;
                const done = n < state.step;
                return (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => goTo(n)}
                      aria-current={current ? "step" : undefined}
                      className={cx(
                        "block w-full border-t-[3px] pb-1 pt-2 text-left transition-colors",
                        current
                          ? "border-amarillo text-amarillo"
                          : done
                            ? "border-white text-white"
                            : "border-white/25 text-white/60 hover:text-white",
                      )}
                    >
                      <span className="nums font-display text-xl font-bold leading-none">{n}</span>
                      <span className="mt-0.5 block text-[0.75rem] font-medium leading-tight lg:text-[0.9375rem]">
                        {label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      <div className="wrap grid min-h-[75svh] content-start gap-10 pb-36 pt-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14 lg:pb-28 lg:pt-12">
        {/* Paso actual */}
        <div>
          <m.div
            key={state.step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="display text-[2.75rem] outline-none lg:text-[3.5rem]"
            >
              <span className="sr-only">
                Paso {state.step} de {STEPS.length}:{" "}
              </span>
              {state.step === 1 && "Elegí el modelo"}
              {state.step === 2 && "¿Qué pick up tenés?"}
              {state.step === 3 && "Sumá opcionales"}
              {state.step === 4 && "Tu presupuesto"}
            </h2>

            {/* ------------------- 1. Modelo ------------------- */}
            {state.step === 1 && (
              <fieldset className="mt-6">
                <legend className="sr-only">Modelo</legend>
                <div className="space-y-3">
                  {availableModels.map((mod) => {
                    const active = mod.slug === model.slug;
                    return (
                      <label
                        key={mod.slug}
                        className={cx(
                          "focus-ring-within grid cursor-pointer grid-cols-[5.5rem_1fr_auto] items-center gap-4 border-2 bg-white p-3 transition-colors lg:grid-cols-[7rem_1fr_auto] lg:gap-6 lg:p-4",
                          active ? "border-asfalto" : "border-transparent hover:border-niebla",
                        )}
                      >
                        <input
                          type="radio"
                          name="modelo"
                          className="sr-only"
                          checked={active}
                          onChange={() => switchModel(mod.slug)}
                        />
                        <span className="relative block aspect-[4/5] overflow-hidden bg-grafito">
                          {mod.hero ? (
                            <Image
                              src={mod.hero.src}
                              alt=""
                              fill
                              sizes="7rem"
                              className="object-cover"
                              style={{ objectPosition: mod.hero.focus }}
                            />
                          ) : (
                            <Blueprint className="absolute left-1/2 top-1/2 w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 text-white/40" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="display block text-[2.25rem] lg:text-[2.75rem]">{mod.name}</span>
                          <span className="mt-1 block text-sm leading-snug text-acero">
                            <WithPending text={mod.forWho} />
                          </span>
                          <span className="nums mt-2 flex flex-wrap items-center gap-2 font-semibold">
                            {mod.price ? `Desde ${formatPrice(mod.price.amount)}` : <Pending />}
                            {mod.price?.status === "ejemplo" && <ExampleTag tone="light" short />}
                          </span>
                        </span>
                        <Check active={active} round />
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* ------------------- 2. Pick up ------------------- */}
            {state.step === 2 && (
              <div className="mt-6 space-y-9">
                <fieldset>
                  <legend className="label text-acero">Marca</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...pickupBrands, { id: OTHER_BRAND, name: "Otra", models: [] }].map((b) => (
                      <Chip
                        key={b.id}
                        name="marca"
                        label={b.name}
                        checked={state.brand === b.id}
                        onChange={() =>
                          update({
                            brand: b.id,
                            pickup:
                              b.id === OTHER_BRAND
                                ? otherText.trim() || null
                                : b.models.length === 1
                                  ? b.models[0].id
                                  : null,
                          })
                        }
                      />
                    ))}
                  </div>
                </fieldset>

                {brand && brand.models.length > 1 && (
                  <fieldset>
                    <legend className="label text-acero">Modelo</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {brand.models.map((pm) => (
                        <Chip
                          key={pm.id}
                          name="pickup"
                          label={pm.name}
                          checked={state.pickup === pm.id}
                          onChange={() => update({ pickup: pm.id })}
                        />
                      ))}
                    </div>
                  </fieldset>
                )}

                {brand && brand.models.length === 1 && (
                  <p className="text-[1.0625rem]">
                    <span className="label mr-3 text-acero">Modelo</span>
                    <span className="font-semibold">{brand.models[0].name}</span>
                  </p>
                )}

                {state.brand === OTHER_BRAND && (
                  <div>
                    <label htmlFor="otra-pickup" className="label text-acero">
                      Marca y modelo de tu pick up
                    </label>
                    <input
                      id="otra-pickup"
                      type="text"
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value.slice(0, 60))}
                      placeholder="Ej.: Mitsubishi L200"
                      autoComplete="off"
                      className="field mt-3 max-w-md"
                    />
                  </div>
                )}

                <fieldset>
                  <legend className="label text-acero">Cabina</legend>
                  <div className="mt-3 grid max-w-md grid-cols-2 gap-2">
                    {(Object.keys(cabinLabels) as Cabin[]).map((c) => (
                      <Chip
                        key={c}
                        name="cabina"
                        label={cabinLabels[c]}
                        checked={state.cabin === c}
                        onChange={() => update({ cabin: c })}
                        block
                      />
                    ))}
                  </div>
                </fieldset>

                {(cabinWarning || pickupUnconfirmed || !model.pickups) && (
                  <div className="max-w-xl border-l-4 border-asfalto bg-white p-4 text-[0.9375rem] leading-relaxed">
                    {cabinWarning && <p>{cabinWarning}</p>}
                    {!cabinWarning && pickupUnconfirmed && (
                      <p>
                        {model.pickupsNote ? (
                          <WithPending text={model.pickupsNote} />
                        ) : (
                          <>
                            Todavía no tenemos publicado el {model.name} sobre una {pickup}. Mandanos la
                            consulta y lo revisamos.
                          </>
                        )}
                      </p>
                    )}
                    {!cabinWarning && !model.pickups && (
                      <p>
                        Pick ups compatibles con el {model.name}: <Pending />. Elegí la tuya y lo
                        confirmamos al pasarte el presupuesto.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ------------------- 3. Opcionales ------------------- */}
            {state.step === 3 && (
              <div className="mt-4">
                {examplePricing && (
                  <p className="flex flex-wrap items-center gap-2.5 text-[0.9375rem] text-acero">
                    <ExampleTag tone="light" />
                    {optionsNote}
                  </p>
                )}
                {model.optionsNote && (
                  <p className="mt-2 text-[0.9375rem] text-acero">
                    <WithPending text={model.optionsNote} />
                  </p>
                )}
                <div className="mt-8 space-y-10">
                  {optionCategories.map((cat) => {
                    const items = allOptions.filter((o) => o.category === cat.id);
                    if (items.length === 0) return null;
                    return (
                      <fieldset key={cat.id}>
                        <legend className="display text-[2rem]">{cat.name}</legend>
                        <div className="mt-3 grid gap-2.5 xl:grid-cols-2">
                          {items.map((o) => {
                            const active = state.options.includes(o.id);
                            return (
                              <label
                                key={o.id}
                                className={cx(
                                  "focus-ring-within flex cursor-pointer items-center gap-3.5 border-2 bg-white p-3 transition-colors",
                                  active ? "border-asfalto" : "border-transparent hover:border-niebla",
                                )}
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={active}
                                  onChange={() => toggleOption(o.id)}
                                />
                                <span
                                  className={cx(
                                    "flex h-14 w-14 shrink-0 items-center justify-center transition-colors",
                                    active ? "bg-amarillo text-asfalto" : "bg-hormigon text-asfalto",
                                  )}
                                >
                                  <OptionIcon name={o.icon} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block font-semibold leading-tight">{o.name}</span>
                                  <span className="mt-1 block text-sm leading-snug text-acero">
                                    {o.description}
                                  </span>
                                  <span className="nums mt-1.5 flex flex-wrap items-center gap-x-2 text-[0.9375rem] font-semibold">
                                    + {formatPrice(o.price)}
                                    {o.priceStatus === "publicado" && (
                                      <span className="text-[0.8125rem] font-medium text-acero">
                                        precio de lista
                                      </span>
                                    )}
                                    <span className="text-[0.8125rem] font-normal text-acero">
                                      · Peso{" "}
                                      {typeof o.weightKg === "number" ? `+${formatNumber(o.weightKg)} kg` : <Pending />}
                                    </span>
                                  </span>
                                </span>
                                <Check active={active} />
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ------------------- 4. Presupuesto ------------------- */}
            {state.step === 4 && (
              <div className="mt-6 space-y-8">
                <p className="hidden max-w-xl text-[1.0625rem] leading-relaxed text-acero lg:block">
                  Revisá el detalle a la derecha. Si está todo bien, completá tus datos y mandalo: te
                  respondemos por WhatsApp.
                </p>
                <div className="chamfer-lg bg-asfalto p-5 text-white lg:hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="label text-casco">Detalle</p>
                    {example && <ExampleTag />}
                  </div>
                  <div className="mt-3">{summaryRows}</div>
                  <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                    <p className="label pb-2 text-casco">Total estimado</p>
                    {totalBlock("lg")}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <button type="button" onClick={() => goTo(2)} className="link text-white/80">
                      Cambiar pick up
                    </button>
                    <button type="button" onClick={() => goTo(3)} className="link text-white/80">
                      Editar opcionales
                    </button>
                  </div>
                </div>

                {!pickup && (
                  <p className="border-l-4 border-asfalto bg-white p-4 text-[0.9375rem]">
                    Todavía no elegiste la pick up.{" "}
                    <button type="button" onClick={() => goTo(2)} className="link font-semibold">
                      Elegila en el paso 2
                    </button>{" "}
                    para que el presupuesto salga completo.
                  </p>
                )}

                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                  className="space-y-5"
                >
                  <h3 className="display text-[2rem]">¿A quién le pasamos el presupuesto?</h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label htmlFor="nombre" className="label text-acero">
                        Nombre
                      </label>
                      <input
                        ref={nameRef}
                        id="nombre"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={contact.name}
                        onChange={(e) => {
                          setContact({ ...contact, name: e.target.value });
                          if (nameError) setNameError(false);
                        }}
                        aria-invalid={nameError}
                        aria-describedby={nameError ? "nombre-error" : undefined}
                        className={cx("field mt-2", nameError && "!border-asfalto")}
                      />
                      {nameError && (
                        <p id="nombre-error" role="alert" className="mt-2 text-sm font-semibold">
                          Escribí tu nombre para que sepamos con quién hablamos.
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="provincia" className="label text-acero">
                        Provincia
                      </label>
                      <select
                        id="provincia"
                        name="province"
                        value={contact.province}
                        onChange={(e) => setContact({ ...contact, province: e.target.value })}
                        className="field mt-2"
                      >
                        <option value="">Elegí tu provincia</option>
                        {provinces.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cuando" className="label text-acero">
                        ¿Para cuándo lo querés?
                      </label>
                      <select
                        id="cuando"
                        name="when"
                        value={contact.when}
                        onChange={(e) => setContact({ ...contact, when: e.target.value })}
                        className="field mt-2"
                      >
                        <option value="">Elegí una opción</option>
                        {timeframes.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
                    <button type="submit" className="btn btn-black">
                      <WhatsAppIcon size={20} /> Enviar presupuesto por WhatsApp
                    </button>
                    <button type="button" onClick={share} className="btn btn-white">
                      <ShareIcon /> Compartir configuración
                    </button>
                    <button type="button" onClick={downloadPdf} className="btn btn-white">
                      <DownloadIcon /> Descargar PDF
                    </button>
                  </div>
                  <p className="min-h-5 text-sm font-medium" role="status">
                    {shareStatus}
                  </p>
                  <p className="max-w-xl text-sm leading-relaxed text-acero">
                    Se abre WhatsApp con el mensaje ya armado: modelo, pick up, cada opcional con su
                    precio y el total. No guardamos tus datos en ningún lado.
                  </p>
                </form>
              </div>
            )}
          </m.div>

          {/* Navegación entre pasos (desktop) */}
          <div className="mt-12 hidden items-center justify-between border-t border-niebla pt-6 lg:flex">
            {state.step > 1 ? (
              <button type="button" onClick={() => goTo(state.step - 1)} className="link font-semibold">
                Volver a {STEPS[state.step - 2].toLowerCase()}
              </button>
            ) : (
              <Link href={`/modelos/${model.slug}`} className="link font-semibold">
                Ver la ficha del {model.name}
              </Link>
            )}
            {!isLast && (
              <button type="button" onClick={() => goTo(state.step + 1)} className="btn btn-black">
                Seguir: {STEPS[state.step].toLowerCase()} <ArrowIcon />
              </button>
            )}
          </div>

          {/* Atrás (mobile) */}
          <div className="mt-10 lg:hidden">
            {state.step > 1 ? (
              <button type="button" onClick={() => goTo(state.step - 1)} className="link font-semibold">
                Volver a {STEPS[state.step - 2].toLowerCase()}
              </button>
            ) : (
              <Link href={`/modelos/${model.slug}`} className="link font-semibold">
                Ver la ficha del {model.name}
              </Link>
            )}
          </div>
        </div>

        {/* Resumen lateral (desktop) */}
        <aside aria-label="Resumen de tu configuración" className="hidden lg:block">
          <div className="chamfer-lg sticky top-28 bg-asfalto p-7 text-white">
            <div className="flex items-center justify-between gap-2">
              <p className="label text-casco">Tu configuración</p>
              {example && <ExampleTag />}
            </div>
            <div className="mt-3">{summaryRows}</div>
            <p className="label mt-6 text-casco">Total estimado</p>
            <div className="mt-2">{totalBlock("lg")}</div>
            {isLast && (
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <button type="button" onClick={() => goTo(2)} className="link text-white/80">
                  Cambiar pick up
                </button>
                <button type="button" onClick={() => goTo(3)} className="link text-white/80">
                  Editar opcionales
                </button>
              </div>
            )}
            {isLast ? (
              <button type="button" onClick={send} className="btn btn-yellow mt-6 w-full">
                <WhatsAppIcon size={20} /> Enviar por WhatsApp
              </button>
            ) : (
              <button type="button" onClick={() => goTo(state.step + 1)} className="btn btn-yellow mt-6 w-full">
                Seguir <ArrowIcon />
              </button>
            )}
            <button
              type="button"
              onClick={share}
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <ShareIcon size={18} /> Compartir configuración
            </button>
          </div>
        </aside>
      </div>

      {/* Resumen fijo (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        {sheetOpen && (
          <button
            type="button"
            aria-label="Cerrar el detalle"
            onClick={() => setSheetOpen(false)}
            className="fixed inset-0 -z-10 bg-asfalto/60"
          />
        )}
        <div className="bg-asfalto text-white shadow-[0_-10px_30px_rgba(0,0,0,0.35)]">
          <div id="detalle-resumen" hidden={!sheetOpen} className="max-h-[58svh] overflow-y-auto border-b border-white/15 px-5 pb-2 pt-5">
            <div className="flex items-center justify-between gap-2">
              <p className="label text-casco">Tu configuración</p>
              {example && <ExampleTag />}
            </div>
            <div className="mt-2">{summaryRows}</div>
            <button
              type="button"
              onClick={share}
              className="flex min-h-12 items-center gap-2 text-sm text-white/85"
            >
              <ShareIcon size={18} /> Compartir configuración
            </button>
          </div>

          <div
            className="flex items-center gap-2 px-3 pt-2.5"
            style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
          >
            <a
              href={whatsappLink(messages.model(model.name))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-11 shrink-0 items-center justify-center text-white"
            >
              <WhatsAppIcon size={24} />
              <span className="sr-only">Consultar por WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => setSheetOpen((v) => !v)}
              aria-expanded={sheetOpen}
              aria-controls="detalle-resumen"
              className="flex min-w-0 flex-1 items-center justify-between gap-2 py-1 text-left"
            >
              <span>
                <span className="flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white/75">
                  Total{example ? " · ejemplo" : ""}
                  <ChevronIcon size={14} className={cx("transition-transform", sheetOpen ? "" : "rotate-180")} />
                </span>
                {totalBlock("sm")}
              </span>
            </button>
            {isLast ? (
              <button type="button" onClick={send} className="btn btn-yellow btn-sm shrink-0 !min-h-12">
                <WhatsAppIcon size={18} /> Enviar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goTo(state.step + 1)}
                className="btn btn-yellow btn-sm shrink-0 !min-h-12"
              >
                Seguir <ArrowIcon size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function Check({ active, round = false }: { active: boolean; round?: boolean }) {
  return (
    <span
      aria-hidden
      className={cx(
        "flex h-8 w-8 shrink-0 items-center justify-center border-2 border-asfalto transition-colors",
        round && "rounded-full",
        active ? "bg-asfalto text-amarillo" : "text-transparent",
      )}
    >
      <CheckIcon />
    </span>
  );
}

function Chip({
  name,
  label,
  checked,
  onChange,
  block = false,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  block?: boolean;
}) {
  return (
    <label
      className={cx(
        "focus-ring-within flex min-h-12 cursor-pointer items-center justify-center border-2 px-4 text-center font-display text-[1.375rem] font-bold uppercase leading-none tracking-wide transition-colors",
        block && "w-full",
        checked
          ? "border-asfalto bg-asfalto text-amarillo"
          : "border-transparent bg-white text-asfalto hover:border-niebla",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}
