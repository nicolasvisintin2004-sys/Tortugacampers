import { advantages } from "@/content/site";
import { Reveal } from "@/components/motion";
import { Photo, SectionHead } from "@/components/ui";

/**
 * Las 5 ventajas, numeradas como en su posteo y contadas con fotos reales.
 * En el celular se deslizan como un carrusel de Instagram; en desktop,
 * cinco paneles verticales lado a lado.
 */
export function Advantages() {
  return (
    <section aria-labelledby="ventajas-titulo" className="bg-asfalto py-20 text-white lg:py-32">
      <div className="wrap">
        <SectionHead
          id="ventajas-titulo"
          eyebrow="El argumento técnico"
          title={
            <>
              5 ventajas de elegir <span className="whitespace-nowrap">un Tortuga</span>
            </>
          }
        />
      </div>

      <Reveal>
        <ol
          tabIndex={0}
          aria-label="Las 5 ventajas. Deslizá para verlas."
          className="strip mt-10 scroll-pl-5 gap-4 px-5 pb-2 lg:mx-auto lg:mt-16 lg:grid lg:max-w-[82.5rem] lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-10 lg:pb-0"
        >
          {advantages.map((item, i) => (
            <li
              key={item.title}
              className="w-[76vw] max-w-[21rem] shrink-0 snap-start lg:w-auto lg:max-w-none"
            >
              <Photo
                image={item.image}
                sizes="(min-width: 1024px) 18vw, 76vw"
                className="aspect-[4/5] lg:aspect-[3/5]"
              >
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-asfalto/75 to-transparent"
                />
                <span aria-hidden className="display absolute left-4 top-3 text-[5.5rem] leading-[0.8]">
                  {i + 1}
                </span>
              </Photo>
              <h3 className="display mt-5 text-[1.875rem] leading-[0.95] lg:text-[1.75rem]">
                <span className="sr-only">{i + 1}. </span>
                {item.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/75">{item.text}</p>
            </li>
          ))}
          <li aria-hidden className="w-1 shrink-0 lg:hidden" />
        </ol>
      </Reveal>
    </section>
  );
}
