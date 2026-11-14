import Link from "next/link";
import { modelLines, site } from "@/content/site";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { ArrowIcon, InstagramIcon, MailIcon, WhatsAppIcon } from "@/components/icons";
import { Logo, Pending } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-asfalto text-white print:hidden">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16 lg:py-24">
        <div>
          <Logo className="h-14 w-auto lg:h-[4.5rem]" />
          <p className="mt-6 max-w-sm text-white/70">{site.description}</p>
          <Link href="/configurador" className="btn btn-yellow mt-8">
            Armá el tuyo
          </Link>
        </div>

        <nav aria-label="Modelos en el pie">
          {modelLines.map((line, n) => (
            <div key={line.name} className={n > 0 ? "mt-6" : undefined}>
              <p className="label text-casco">{line.name}</p>
              <ul className="mt-3 space-y-1">
                {line.models.map((m) => {
                  const upcoming = m.status === "proximamente";
                  return (
                    <li key={m.slug}>
                      <Link
                        href={`/modelos/${m.slug}`}
                        className={`inline-flex min-h-11 items-center gap-3 font-display text-2xl font-bold uppercase tracking-wide hover:text-amarillo ${upcoming ? "text-white/55" : ""}`}
                      >
                        {m.name}
                        {upcoming && <span className="label text-[0.5625rem]">Próximamente</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <Link
            href="/preguntas-frecuentes"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-[1.0625rem] hover:text-amarillo"
          >
            Preguntas frecuentes <ArrowIcon size={18} />
          </Link>
        </nav>

        <div>
          <p className="label text-casco">Contacto</p>
          <ul className="mt-4 space-y-1 text-[1.0625rem]">
            <li>
              <a
                href={whatsappLink(messages.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-3 hover:text-amarillo"
              >
                <WhatsAppIcon size={20} />
                <span>
                  WhatsApp {!site.whatsapp && <Pending />}
                </span>
              </a>
            </li>
            {site.email && (
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center gap-3 break-all hover:text-amarillo"
                >
                  <MailIcon size={20} className="shrink-0" />
                  {site.email}
                </a>
              </li>
            )}
            <li>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-3 hover:text-amarillo"
              >
                <InstagramIcon size={20} />
                {site.instagram.handle}
              </a>
            </li>
          </ul>
          <dl className="mt-6 space-y-3 text-[0.9375rem] text-white/70">
            <div>
              <dt className="label text-casco">Ubicación</dt>
              <dd className="mt-1">
                {site.location ?? <Pending />}
                {!site.address && (
                  <>
                    {" "}
                    · dirección <Pending />
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt className="label text-casco">Web</dt>
              <dd className="mt-1">{site.domain ?? <Pending />}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-6 text-[0.8125rem] leading-relaxed text-white/55 lg:flex-row lg:items-center lg:justify-between">
          <p>
            Sitio demo. Los datos marcados <Pending /> y los valores de ejemplo se reemplazan antes
            de publicar.
          </p>
          <p>
            Diseñado y desarrollado por{" "}
            <a
              href={site.studioUrl}
              target="_blank"
              rel="noopener"
              className="font-medium text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-amarillo hover:decoration-amarillo"
            >
              {site.studio}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
