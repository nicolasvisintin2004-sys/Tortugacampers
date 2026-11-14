import { lineIntros, modelLines, pickupBrands, site } from "@/content/site";
import { ModelCard, UpcomingCard } from "@/components/ModelCard";
import { Reveal } from "@/components/motion";
import { SectionHead } from "@/components/ui";

/** Los modelos agrupados por línea: Línea T y Línea Discover. */
export function Lineup() {
  return (
    <section id="modelos" aria-labelledby="modelos-titulo" className="bg-hormigon py-20 text-asfalto lg:py-32">
      <div className="wrap">
        <SectionHead id="modelos-titulo" eyebrow="Modelos" title="Las líneas" tone="light">
          <p>{site.positioning}</p>
        </SectionHead>

        <div className="mt-14 space-y-20 lg:mt-20 lg:space-y-28">
          {modelLines.map((line) => {
            const available = line.models.filter((m) => m.status !== "proximamente");
            const upcoming = line.models.filter((m) => m.status === "proximamente");
            return (
              <div
                key={line.name}
                className="grid gap-x-8 gap-y-10 border-t-2 border-asfalto pt-6 md:grid-cols-2 lg:grid-cols-3 lg:pt-8"
              >
                <div className="md:col-span-2 lg:sticky lg:top-28 lg:col-span-1 lg:self-start">
                  <h3 className="display text-[clamp(3rem,12vw,4.5rem)]">{line.name}</h3>
                  <p className="label mt-3 text-acero">
                    {available.length > 0 &&
                      `${available.length} ${available.length === 1 ? "modelo" : "modelos"}`}
                    {upcoming.length > 0 && ` · ${upcoming.length} en desarrollo`}
                  </p>
                  {lineIntros[line.name] && (
                    <p className="mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-acero">
                      {lineIntros[line.name]}
                    </p>
                  )}
                </div>

                {available.map((model, i) => (
                  <Reveal key={model.slug} delay={i * 0.08} className="h-full">
                    <ModelCard model={model} hideLine sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw" />
                  </Reveal>
                ))}

                {upcoming.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <p className="label text-acero">Lo que viene</p>
                    {upcoming.map((model) => (
                      <Reveal key={model.slug}>
                        <UpcomingCard model={model} compact />
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pick ups compatibles, en tipografía (sin logos de terceros). */}
        <div className="mt-20 border-t-2 border-asfalto pt-6 lg:mt-28 lg:grid lg:grid-cols-3 lg:gap-8 lg:pt-8">
          <div>
            <p className="label text-acero">Se monta en</p>
            <p className="mt-4 max-w-sm text-[1.0625rem] leading-relaxed text-acero">
              Las pick ups más comunes de la Argentina, doble o simple cabina. ¿La tuya no está?
              Consultanos.
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1 lg:col-span-2 lg:mt-0" aria-label="Pick ups compatibles">
            {pickupBrands.flatMap((b) =>
              b.models.map((m) => (
                <li key={`${b.id}-${m.id}`} className="display text-[clamp(1.75rem,7vw,3rem)] leading-[1.05]">
                  <span className="text-acero">{b.name}</span>{" "}
                  {m.name.startsWith(b.name) ? "" : m.name.replace(/\s*\(.*\)$/, "")}
                </li>
              )),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
