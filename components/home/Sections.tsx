import Link from "next/link";
import {
  availableModels,
  comparison,
  deliveries,
  faq,
  onTheRoad,
  site,
  workSteps,
} from "@/content/site";
import { faqId, formatPrice } from "@/lib/format";
import { ArrowIcon, InstagramIcon } from "@/components/icons";
import { MiniConfigurator } from "@/components/home/MiniConfigurator";
import { Reveal } from "@/components/motion";
import { Blueprint, ExampleTag, Pending, Photo, SectionHead, Value, WithPending } from "@/components/ui";

/* ---------------- 4. Momento firma: el configurador ---------------- */

export function ConfiguratorBand() {
  return (
    <section
      id="armalo"
      aria-labelledby="armalo-titulo"
      className="bg-amarillo py-20 text-asfalto lg:py-32"
    >
      <div className="wrap">
        <div className="max-w-3xl">
          <p className="label text-asfalto/80">El configurador</p>
          <h2 id="armalo-titulo" className="display mt-4 text-[clamp(3.25rem,14vw,7rem)]">
            Armalo a tu gusto
          </h2>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-asfalto/85">
            Elegí el modelo, sumale lo que quieras y mirá cómo cambia el número. Cuando te cierre,
            nos mandás el presupuesto por WhatsApp.
          </p>
        </div>
        <Reveal className="mt-10 lg:mt-14">
          <MiniConfigurator />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 5. Comparativa ---------------- */

export function Comparison() {
  const anyExample = availableModels.some((m) => m.price?.status === "ejemplo");
  return (
    <section aria-labelledby="comparativa-titulo" className="bg-white py-20 text-asfalto lg:py-32">
      <div className="wrap">
        <SectionHead id="comparativa-titulo" eyebrow="Lado a lado" title="Compará los modelos" tone="light" />

        <Reveal className="mt-10 lg:mt-14">
          <div>
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-asfalto align-bottom">
                  <th scope="col" className="w-[23%] pb-3 pr-2 lg:w-[22%]">
                    <span className="sr-only">Característica</span>
                  </th>
                  {availableModels.map((m) => (
                    <th key={m.slug} scope="col" className="pb-3 pr-2">
                      <Link
                        href={`/modelos/${m.slug}`}
                        className="display text-[1.625rem] hover:underline lg:text-[2.75rem]"
                      >
                        {m.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="nums text-[0.8125rem] leading-snug lg:text-[1.0625rem]">
                {comparison.map((row) => (
                  <tr key={row.label} className="border-b border-niebla align-top">
                    <th scope="row" className="label py-4 pr-2 text-[0.625rem] font-medium tracking-[0.16em] text-acero lg:text-[0.6875rem] lg:tracking-[0.26em]">
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td key={i} className="py-4 pr-2 font-medium">
                        <Value value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="align-top">
                  <th scope="row" className="label py-4 pr-2 text-[0.625rem] font-medium tracking-[0.16em] text-acero lg:text-[0.6875rem] lg:tracking-[0.26em]">
                    Precio desde
                  </th>
                  {availableModels.map((m) => (
                    <td key={m.slug} className="py-4 pr-2">
                      {m.price ? (
                        <span className="flex flex-col items-start gap-1.5">
                          <span className="font-display text-[1.3125rem] font-bold leading-none tracking-wide lg:text-[2rem]">
                            {formatPrice(m.price.amount)}
                          </span>
                          {m.price.status === "ejemplo" && <ExampleTag tone="light" short />}
                        </span>
                      ) : (
                        <Pending />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  {availableModels.map((m) => (
                    <td key={m.slug} className="pb-1 pr-2 pt-3">
                      <Link
                        href={`/configurador/${m.slug}`}
                        className="btn btn-black btn-sm max-lg:!min-h-11 max-lg:!px-2.5 max-lg:!text-base"
                      >
                        Configurar<span className="sr-only"> el {m.name}</span>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          {anyExample && (
            <p className="mt-6 text-sm text-acero">
              Los precios marcados como ejemplo son valores de muestra hasta tener la lista real.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 6. Cómo trabajamos ---------------- */

export function Process() {
  return (
    <section aria-labelledby="proceso-titulo" className="bg-hormigon py-20 text-asfalto lg:py-32">
      <div className="wrap">
        <SectionHead id="proceso-titulo" eyebrow="Del celular a la ruta" title="Cómo trabajamos" tone="light" />

        <ol className="mt-10 grid gap-x-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {workSteps.map((step, i) => (
            <li key={step.title} className="border-t-2 border-asfalto pb-9 pt-4 lg:pb-0">
              <Reveal delay={i * 0.07} className="grid grid-cols-[3.25rem_1fr] gap-x-3 lg:block">
                <p aria-hidden className="display text-[4.5rem] text-asfalto lg:text-[6rem]">
                  {i + 1}
                </p>
                <div>
                  <h3 className="display pt-1.5 text-[2rem] lg:mt-3 lg:pt-0">{step.title}</h3>
                  <p className="mt-2.5 max-w-sm leading-relaxed text-acero lg:mt-3">{step.text}</p>
                  <p className="mt-3 text-sm font-medium lg:mt-4">
                    <span className="label mr-2 text-acero">Plazo</span>
                    <Value value={step.time} />
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-6 lg:mt-14">
          <Link href="/configurador" className="btn btn-black">
            Empezá por el paso 1 <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 7. Tortuga en ruta ---------------- */

export function OnTheRoad() {
  return (
    <section aria-labelledby="ruta-titulo" className="overflow-hidden bg-asfalto py-20 text-white lg:pb-44 lg:pt-32">
      <div className="wrap lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionHead id="ruta-titulo" eyebrow={`${site.instagram.followers} seguidores en Instagram`} title={onTheRoad.title}>
            <p>{onTheRoad.text}</p>
          </SectionHead>

          <ul className="mt-9 border-t border-white/20">
            {onTheRoad.items.map((item) => (
              <li key={item.title} className="border-b border-white/20 py-5">
                <h3 className="display text-[1.75rem]">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-white/75">{item.text}</p>
                {item.pending && (
                  <p className="mt-2 text-sm text-white/75">
                    <WithPending text={item.pending} />
                  </p>
                )}
              </li>
            ))}
          </ul>

          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-white mt-8"
          >
            <InstagramIcon size={20} /> Seguinos en {site.instagram.handle}
          </a>
        </div>

        <Reveal className="mt-12 lg:mt-0">
          <ul
            tabIndex={0}
            aria-label="Fotos de Tortuga Campers en Instagram"
            className="strip -mx-5 scroll-pl-5 gap-3 px-5 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-5 lg:overflow-visible lg:px-0"
          >
            {onTheRoad.images.map((image, i) => (
              <li
                key={image.src}
                className={`w-[58vw] max-w-[16rem] shrink-0 snap-start lg:w-auto lg:max-w-none ${
                  i % 2 === 1 ? "lg:translate-y-16" : ""
                }`}
              >
                <Photo image={image} sizes="(min-width: 1024px) 26vw, 58vw" className="aspect-[9/16] lg:aspect-[4/5]" />
              </li>
            ))}
            <li aria-hidden className="w-2 shrink-0 lg:hidden" />
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 8. Preguntas frecuentes ---------------- */

/** Cierre del home: lleva a la página de preguntas frecuentes. */
export function FaqTeaser() {
  const sample = faq.slice(0, 4);
  return (
    <section aria-labelledby="faq-titulo" className="bg-white py-20 text-asfalto lg:py-28">
      <div className="wrap lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHead id="faq-titulo" eyebrow="Antes de escribirnos" title="Preguntas frecuentes" tone="light">
          <p>
            {faq.length} respuestas sobre compatibilidad, equipamiento, plazos y formas de pago.
          </p>
        </SectionHead>

        <div className="mt-8 lg:mt-0">
          <ul className="border-t-2 border-asfalto">
            {sample.map((item) => (
              <li key={item.q} className="border-b border-niebla">
                <Link
                  href={`/preguntas-frecuentes#${faqId(item.q)}`}
                  className="group flex min-h-[4.25rem] items-center justify-between gap-4 py-4 text-[1.125rem] font-semibold leading-snug lg:text-xl"
                >
                  {item.q}
                  <ArrowIcon className="shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/preguntas-frecuentes" className="btn btn-black mt-8 w-full sm:w-auto">
            Ver todas las preguntas <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Unidades entregadas y testimonios. Lo que falta se ve como pendiente. */
export function Deliveries() {
  return (
    <section aria-labelledby="clientes-titulo" className="bg-hormigon py-20 text-asfalto lg:py-32">
      <div className="wrap">
        <SectionHead id="clientes-titulo" eyebrow="Unidades entregadas" title={deliveries.title} tone="light">
          <p>{deliveries.text}</p>
        </SectionHead>

        <ul className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
          {deliveries.items.map((d, i) => (
            <li key={i}>
              <Reveal delay={i * 0.08} className="flex h-full flex-col">
                <figure className="flex h-full flex-col">
                  {d.image ? (
                    <Photo image={d.image} sizes="(min-width: 768px) 31vw, 100vw" className="aspect-[4/3]" />
                  ) : (
                    <div className="chamfer-lg flex aspect-[4/3] flex-col items-center justify-center gap-3 border-2 border-dashed border-acero/50 bg-white/60 p-6 text-center text-acero">
                      <Blueprint className="w-40 text-acero/60" />
                      <p className="text-sm">
                        Foto de la unidad entregada <Pending />
                      </p>
                    </div>
                  )}

                  <p className="label mt-5 text-acero">
                    <Value value={d.model} /> · Pick up <Value value={d.pickup} />
                  </p>

                  <blockquote className="mt-3 flex-1 text-[1.25rem] font-semibold leading-snug">
                    {d.quote ? (
                      <p>“{d.quote}”</p>
                    ) : (
                      <p className="font-normal text-acero">
                        Testimonio del cliente <Pending />
                      </p>
                    )}
                  </blockquote>

                  <figcaption className="mt-4 border-t border-niebla pt-3 text-[0.9375rem] text-acero">
                    Cliente <Value value={d.client} /> · Lugar <Value value={d.place} />
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-xl text-[0.9375rem] leading-relaxed text-acero">
          ¿Ya viajás con tu Tortuga? Mandanos una foto por WhatsApp o etiquetanos en{" "}
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="link font-semibold text-asfalto">
            {site.instagram.handle}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
