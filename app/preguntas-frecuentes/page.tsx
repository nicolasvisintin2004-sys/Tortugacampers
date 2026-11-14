import type { Metadata } from "next";
import { faq, faqTopics, site } from "@/content/site";
import { faqId } from "@/lib/format";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { MailIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { FaqHashOpener } from "@/components/FaqHashOpener";
import { WithPending } from "@/components/ui";

const description =
  "Compatibilidad con tu pick up, equipamiento, garantía, plazos y formas de pago de los campers Tortuga.";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description,
  alternates: { canonical: "/preguntas-frecuentes" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.name,
    title: `Preguntas frecuentes — ${site.name}`,
    description,
    url: "/preguntas-frecuentes",
    images: [{ url: "/og/home.jpg", width: 1200, height: 630, alt: site.name }],
  },
};

export default function FaqPage() {
  const topics = faqTopics
    .map((t) => ({ ...t, items: faq.filter((f) => f.topic === t.id) }))
    .filter((t) => t.items.length > 0);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          // Solo las respuestas que no dependen de datos por confirmar.
          mainEntity: faq
            .filter((item) => !item.pending)
            .map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
        }}
      />
      <FaqHashOpener />

      <section className="bg-asfalto text-white">
        <div className="wrap pb-12 pt-12 lg:pb-20 lg:pt-20">
          <p className="label text-casco">Antes de escribirnos</p>
          <h1 className="display mt-4 text-[clamp(3.5rem,15vw,8rem)]">Preguntas frecuentes</h1>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-white/75">
            Lo que más nos preguntan sobre los campers Tortuga. Si no encontrás tu respuesta,
            escribinos por WhatsApp.
          </p>
          <nav aria-label="Temas" className="mt-9">
            <ul className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="inline-flex min-h-11 items-center gap-2.5 border border-white/25 px-4 text-[0.9375rem] font-medium transition-colors hover:border-amarillo hover:text-amarillo"
                  >
                    {t.name}
                    <span className="nums text-white/50">{t.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <div className="bg-white text-asfalto">
        <div className="wrap space-y-16 py-16 lg:space-y-24 lg:py-24">
          {topics.map((t) => (
            <section
              key={t.id}
              id={t.id}
              aria-labelledby={`${t.id}-titulo`}
              className="scroll-mt-24 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16"
            >
              <div>
                <h2 id={`${t.id}-titulo`} className="display text-[clamp(2.75rem,11vw,4.5rem)] lg:sticky lg:top-28">
                  {t.name}
                </h2>
              </div>
              <div className="mt-6 border-t-2 border-asfalto lg:mt-0">
                {t.items.map((item) => (
                  <details key={item.q} id={faqId(item.q)} className="group scroll-mt-24 border-b border-niebla">
                    <summary className="flex min-h-[4.25rem] items-center justify-between gap-4 py-4 text-[1.125rem] font-semibold leading-snug lg:text-xl">
                      {item.q}
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-hormigon transition-transform duration-300 group-open:rotate-45">
                        <PlusIcon />
                      </span>
                    </summary>
                    <div className="max-w-2xl pb-6 pr-10 leading-relaxed text-acero">
                      <p>{item.a}</p>
                      {item.pending && (
                        <p className="mt-3 text-[0.9375rem] text-asfalto">
                          <WithPending text={item.pending} />
                        </p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section aria-labelledby="otra-pregunta" className="bg-amarillo text-asfalto">
        <div className="wrap flex flex-col gap-8 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <div>
            <h2 id="otra-pregunta" className="display text-[clamp(3rem,13vw,5.5rem)]">
              ¿Te quedó otra duda?
            </h2>
            <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed">
              Contanos qué pick up tenés y qué viaje querés hacer. Te respondemos por WhatsApp.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <a
              href={whatsappLink(messages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-black"
            >
              <WhatsAppIcon size={20} /> Escribinos
            </a>
            {site.email && (
              <a href={`mailto:${site.email}`} className="btn btn-white">
                <MailIcon size={20} /> Mandanos un mail
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
