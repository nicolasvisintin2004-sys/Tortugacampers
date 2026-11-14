import Link from "next/link";
import {
  availableModels,
  cabinLabels,
  commonEquipment,
  specLabels,
  upcomingModels,
  type ImageKind,
  type Model,
  type SpecKey,
} from "@/content/site";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { ArrowIcon, CheckIcon, ChevronIcon, WhatsAppIcon } from "@/components/icons";
import { StatusTag } from "@/components/ModelCard";
import { Blueprint, Pending, Photo, PriceFrom, SectionHead, WithPending } from "@/components/ui";
import Image from "next/image";

const listWithY = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;

/* ---------------- 1. Hero del modelo ---------------- */

export function ModelHero({ model }: { model: Model }) {
  return (
    <section className="relative overflow-hidden bg-asfalto text-white lg:grid lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[minmax(0,1fr)_42vw]">
      <div className="relative h-[50svh] min-h-[19rem] lg:order-2 lg:h-auto lg:min-h-0">
        {model.hero ? (
          <>
            <Image
              src={model.hero.src}
              alt={model.hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
              style={{ objectPosition: model.hero.focus }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-1/2 bg-gradient-to-t from-asfalto from-[2%] to-transparent lg:hidden"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-asfalto to-transparent lg:block"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-grafito">
            <Blueprint className="w-[120%] max-w-none text-white/30 lg:w-[110%]" />
            <p className="absolute bottom-24 left-5 text-sm text-white/75 lg:bottom-6 lg:left-8">
              Fotos <Pending />
            </p>
          </div>
        )}
      </div>

      <div className="relative z-10 -mt-20 px-5 pb-12 lg:order-1 lg:mt-0 lg:flex lg:flex-col lg:justify-end lg:pb-14 lg:pl-[max(2.5rem,calc((100vw-82.5rem)/2+2.5rem))] lg:pr-10 lg:pt-16">
        <div className="flex items-center gap-3">
          <StatusTag model={model} />
          <span className="label text-white/75">{model.line}</span>
        </div>
        <h1
          className={
            // Los nombres largos bajan un punto para entrar en una línea en el celular.
            model.name.length > 7
              ? "display mt-4 text-[clamp(3.5rem,17.5vw,6rem)] lg:text-[clamp(6rem,9.5vw,11rem)]"
              : "display mt-4 text-[clamp(4.75rem,24vw,7rem)] lg:text-[clamp(7rem,11vw,12.5rem)]"
          }
        >
          {model.name}
        </h1>
        <p className="mt-4 max-w-[34rem] text-xl font-medium leading-snug lg:text-2xl">
          <WithPending text={model.forWho} />
        </p>
        <p className="mt-3 hidden max-w-[34rem] leading-relaxed text-white/75 lg:block">
          <WithPending text={model.intro} />
        </p>

        <PriceFrom price={model.price} className="mt-6 lg:mt-7" />
        {model.price?.note && (
          <p className="mt-1.5 text-sm text-white/65">
            <WithPending text={model.price.note} />
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
          <Link href={`/configurador/${model.slug}`} className="btn btn-yellow">
            Configurar este modelo <ArrowIcon />
          </Link>
          <a
            href={whatsappLink(messages.model(model.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-graphite"
          >
            <WhatsAppIcon size={20} /> Consultar
          </a>
        </div>

        {/* En el celular la bajada va después de los botones, para que el
            llamado a configurar quede a la vista sin scrollear. */}
        <p className="mt-7 leading-relaxed text-white/75 lg:hidden">
          <WithPending text={model.intro} />
        </p>
      </div>
    </section>
  );
}

/* ---------------- 2. Galería ---------------- */

const kindTitles: Record<ImageKind, string> = {
  exterior: "Exterior",
  interior: "Interior",
  detalle: "Detalles",
};

export function ModelGallery({ model }: { model: Model }) {
  // Sin fotos suficientes, la sección no aparece.
  if (model.gallery.length < 2) return null;

  const groups = (["exterior", "interior", "detalle"] as ImageKind[])
    .map((kind) => ({ kind, items: model.gallery.filter((img) => img.kind === kind) }))
    .filter((g) => g.items.length > 0);

  // En desktop todas las fotos forman una sola grilla de 4 columnas;
  // si la última fila queda incompleta, la cierra un acceso al configurador.
  const remaining = (4 - (model.gallery.length % 4)) % 4;
  const spans = ["", "lg:col-span-1", "lg:col-span-2", "lg:col-span-3"];

  return (
    <section aria-labelledby="galeria-titulo" className="bg-asfalto pb-20 pt-6 text-white lg:pb-32 lg:pt-12">
      <div className="wrap lg:flex lg:items-baseline lg:justify-between">
        <h2 id="galeria-titulo" className="display max-lg:sr-only lg:text-[4rem]">
          Galería<span className="sr-only"> del {model.name}</span>
        </h2>
        <p className="label hidden text-casco lg:block">{model.gallery.length} fotos</p>
      </div>

      <div className="space-y-12 lg:mx-auto lg:mt-8 lg:grid lg:max-w-[82.5rem] lg:grid-cols-4 lg:gap-5 lg:space-y-0 lg:px-10">
        {groups.map((group) => (
          <div key={group.kind} className="lg:contents">
            <div className="wrap flex items-baseline justify-between lg:hidden">
              <h3 className="display text-[2.5rem]">{kindTitles[group.kind]}</h3>
              <p className="label text-casco">
                {group.items.length} {group.items.length === 1 ? "foto" : "fotos"}
              </p>
            </div>
            <ul
              tabIndex={0}
              aria-label={`Fotos: ${kindTitles[group.kind].toLowerCase()} del ${model.name}`}
              className="strip mt-5 scroll-pl-5 gap-3 px-5 lg:contents"
            >
              {group.items.map((image) => (
                <li
                  key={image.src}
                  className="w-[72vw] max-w-[20rem] shrink-0 snap-start lg:w-auto lg:max-w-none"
                >
                  <Photo image={image} sizes="(min-width: 1024px) 23vw, 72vw" className="aspect-[3/4]">
                    <span
                      aria-hidden
                      className="label absolute left-0 top-0 hidden bg-asfalto/85 px-2.5 py-1.5 text-[0.5625rem] text-white lg:block"
                    >
                      {kindTitles[group.kind]}
                    </span>
                  </Photo>
                </li>
              ))}
              <li aria-hidden className="w-2 shrink-0 lg:hidden" />
            </ul>
          </div>
        ))}

        {remaining > 0 && (
          <Link
            href={`/configurador/${model.slug}`}
            className={`chamfer-lg group hidden flex-col justify-between bg-amarillo p-6 text-asfalto transition-colors hover:bg-[#f7f0a0] lg:flex ${spans[remaining]}`}
          >
            <span className="label">Siguiente paso</span>
            <span>
              <span className="display block text-[3rem]">Armá tu {model.name}</span>
              <span className="mt-4 flex items-center gap-2 font-display text-xl font-bold uppercase tracking-wide">
                Abrir el configurador
                <ArrowIcon className="transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}

/* ---------------- 3. Specs ---------------- */

export function ModelSpecs({ model }: { model: Model }) {
  const keys = Object.keys(specLabels) as SpecKey[];
  const confirmed = [
    ...keys
      .filter((k) => model.specs[k] !== null)
      .map((k) => ({ label: specLabels[k], value: model.specs[k] as string })),
    ...model.extraSpecs,
  ];
  const pending = keys.filter((k) => model.specs[k] === null).map((k) => specLabels[k].toLowerCase());

  return (
    <section aria-labelledby="specs-titulo" className="bg-white py-20 text-asfalto lg:py-32">
      <div className="wrap lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHead id="specs-titulo" eyebrow={model.name} title="Ficha técnica" tone="light" />

        <div className="mt-8 lg:mt-0">
          {confirmed.length > 0 && (
            <dl className="nums border-t-2 border-asfalto">
              {confirmed.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-niebla py-4 lg:grid-cols-[12rem_1fr]"
                >
                  <dt className="label pt-1 text-acero">{row.label}</dt>
                  <dd className="text-[1.0625rem] font-semibold leading-snug lg:text-xl">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {pending.length > 0 && (
            <div className={confirmed.length > 0 ? "mt-6" : "border-t-2 border-asfalto pt-6"}>
              <p className="text-[1.0625rem] leading-relaxed">
                <span className="font-semibold">
                  {listWithY(pending).replace(/^./, (c) => c.toUpperCase())}
                </span>
                : <Pending />
              </p>
              <a
                href={whatsappLink(messages.spec(model.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-black btn-sm mt-5"
              >
                <WhatsAppIcon size={18} /> Pedir la ficha completa
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 4. Equipamiento de serie ---------------- */

export function ModelEquipment({ model }: { model: Model }) {
  return (
    <section aria-labelledby="equipamiento-titulo" className="bg-hormigon py-20 text-asfalto lg:py-32">
      <div className="wrap">
        <SectionHead id="equipamiento-titulo" eyebrow="Lo que ya viene" title="Equipamiento de serie" tone="light" />

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h3 className="label text-acero">En todos los Tortuga</h3>
            <ul className="mt-4 space-y-3">
              {commonEquipment.map((item) => (
                <li key={item} className="flex gap-3 text-[1.0625rem] font-medium leading-snug">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-asfalto text-amarillo">
                    <CheckIcon size={14} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label text-acero">Propio del {model.name}</h3>
            {model.equipment.length > 0 ? (
              <div className="mt-4 border-t-2 border-asfalto">
                {model.equipment.map((group, i) => (
                  <details key={group.title} open={i === 0} className="group border-b border-niebla">
                    <summary className="flex min-h-[4rem] items-center justify-between gap-4 py-3">
                      <span className="display text-[1.75rem]">{group.title}</span>
                      <span className="flex items-center gap-3">
                        <span className="nums text-sm text-acero">{group.items.length}</span>
                        <ChevronIcon className="transition-transform duration-300 group-open:rotate-180" />
                      </span>
                    </summary>
                    <ul className="space-y-2.5 pb-6 pr-4">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-3 leading-snug text-asfalto/85">
                          <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-asfalto" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            ) : (
              <p className="mt-4 border-t-2 border-asfalto pt-5 text-[1.0625rem]">
                Equipamiento propio del {model.name}: <Pending />
              </p>
            )}
            {model.equipmentNote && (
              <p className="mt-4 text-sm leading-relaxed text-acero">
                <WithPending text={model.equipmentNote} />
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 5. Compatibilidad ---------------- */

export function ModelCompatibility({ model }: { model: Model }) {
  return (
    <section aria-labelledby="compat-titulo" className="bg-asfalto py-20 text-white lg:py-32">
      <div className="wrap lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHead id="compat-titulo" eyebrow="Compatibilidad" title="¿Va con tu pick up?" />

        <div className="mt-8 lg:mt-0">
          <p className="label text-casco">Se monta en</p>
          {model.pickups ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {model.pickups.map((p) => (
                <li
                  key={p}
                  className="border border-white/30 px-3.5 py-2 font-display text-[1.375rem] font-bold uppercase leading-none tracking-wide"
                >
                  {p}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[1.0625rem]">
              Pick ups compatibles: <Pending />
            </p>
          )}
          {model.pickupsNote && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
              <WithPending text={model.pickupsNote} />
            </p>
          )}

          <p className="mt-7 text-[1.0625rem]">
            <span className="label mr-3 text-casco">Cabina</span>
            {model.cabins ? listWithY(model.cabins.map((c) => cabinLabels[c])) : <Pending />}
          </p>

          <div className="mt-9 border-t border-white/20 pt-7">
            <p className="display text-[2rem]">¿No ves la tuya?</p>
            <p className="mt-2 max-w-md text-white/75">
              Decinos marca, modelo y cabina y te confirmamos si el {model.name} le va.
            </p>
            <a
              href={whatsappLink(messages.pickup(model.name))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-white mt-5"
            >
              <WhatsAppIcon size={20} /> Consultanos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 6. Compará con los otros modelos ---------------- */

export function ModelCompare({ model }: { model: Model }) {
  const others = availableModels.filter((m) => m.slug !== model.slug);
  if (others.length === 0) return null;

  return (
    <section aria-labelledby="otros-titulo" className="bg-white py-20 text-asfalto lg:py-32">
      <div className="wrap">
        <SectionHead id="otros-titulo" eyebrow="La línea" title="Compará con los otros modelos" tone="light" />

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-14 lg:gap-8">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/modelos/${other.slug}`}
                className="group grid h-full grid-cols-[7.5rem_1fr] gap-5 bg-hormigon p-4 transition-colors hover:bg-niebla/60 lg:grid-cols-[11rem_1fr] lg:gap-7 lg:p-5"
              >
                {other.hero ? (
                  <Photo image={other.hero} sizes="(min-width: 1024px) 11rem, 7.5rem" className="aspect-[3/4] [--cut:16px]" />
                ) : (
                  <NoPhotoMini name={other.name} />
                )}
                <div className="flex min-w-0 flex-col py-1">
                  <p className="label text-acero">{other.statusLabel}</p>
                  <p className="display mt-2 text-[2.5rem] lg:text-[3.25rem]">{other.name}</p>
                  <p className="mt-2 text-[0.9375rem] leading-snug text-acero">
                    <WithPending text={other.forWho} />
                  </p>
                  <PriceFrom price={other.price} tone="light" className="mt-3 [&_.font-display]:text-2xl" />
                  <span className="mt-auto flex items-center gap-2 pt-4 font-display text-xl font-bold uppercase tracking-wide">
                    Ver {other.name} <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {upcomingModels.length > 0 && (
          <p className="mt-8 text-acero">
            En desarrollo:{" "}
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
    </section>
  );
}

function NoPhotoMini({ name }: { name: string }) {
  return (
    <div className="chamfer-lg relative flex aspect-[3/4] items-end overflow-hidden bg-grafito p-3 text-white [--cut:16px]">
      <Blueprint className="absolute -right-4 top-6 w-[140%] max-w-none text-white/25" />
      <span className="display relative text-[1.75rem] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.9)] lg:text-[2.5rem]">
        {name}
      </span>
    </div>
  );
}

/* ---------------- Cierre: llamado a configurar ---------------- */

export function ModelCta({ model }: { model: Model }) {
  return (
    <section className="bg-amarillo py-16 text-asfalto lg:py-24">
      <div className="wrap flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label text-asfalto/80">Siguiente paso</p>
          <h2 className="display mt-3 text-[clamp(3.25rem,14vw,6.5rem)]">Armá tu {model.name}</h2>
          <p className="mt-4 max-w-lg text-[1.0625rem] text-asfalto/85">
            Elegí tu pick up, sumá opcionales y mandanos el presupuesto por WhatsApp.
          </p>
        </div>
        <Link href={`/configurador/${model.slug}`} className="btn btn-black shrink-0">
          Configurar este modelo <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Página corta: modelos en desarrollo ---------------- */

export function UpcomingModel({ model }: { model: Model }) {
  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-end overflow-hidden bg-asfalto pb-16 pt-24 text-white lg:min-h-[calc(100svh-4.5rem)] lg:pb-24">
      <Blueprint className="pointer-events-none absolute left-1/2 top-[8%] w-[150%] max-w-none -translate-x-1/2 text-white/25 lg:top-[4%] lg:w-[58rem]" />
      <div className="wrap relative">
        <div className="flex items-center gap-3">
          <StatusTag model={model} />
          <span className="label text-white/75">{model.line}</span>
        </div>
        <h1 className="display mt-5 text-[clamp(4rem,19vw,11rem)]">{model.name}</h1>
        <p className="mt-4 font-display text-[2rem] font-bold uppercase tracking-wide text-amarillo">
          En desarrollo
        </p>
        <p className="mt-3 max-w-md text-[1.0625rem] leading-relaxed text-white/75">
          Todavía no hay fotos ni ficha técnica para mostrar. Dejanos un mensaje y te avisamos
          apenas salga.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink(messages.notify(model.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-yellow"
          >
            <WhatsAppIcon size={20} /> Avisame cuando salga
          </a>
          <Link href="/#modelos" className="btn btn-graphite">
            Ver modelos disponibles
          </Link>
        </div>
      </div>
    </section>
  );
}
