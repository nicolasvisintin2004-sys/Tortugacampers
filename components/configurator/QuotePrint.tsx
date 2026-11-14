import { cabinLabels, examplePricing, images, site, type Model } from "@/content/site";
import {
  isExampleQuote,
  pickupLabel,
  selectedOptions,
  totalFor,
  weightText,
  type ConfigState,
  type Contact,
} from "@/lib/configurator";
import { formatPrice } from "@/lib/format";

/**
 * Hoja de presupuesto para imprimir o guardar como PDF.
 * Solo se ve al imprimir (`print:block`); en pantalla está oculta.
 */
export function QuotePrint({
  model,
  state,
  contact,
  shareUrl,
}: {
  model: Model;
  state: ConfigState;
  contact: Contact;
  shareUrl: string;
}) {
  const chosen = selectedOptions(model, state);
  const pickup = pickupLabel(state);
  const example = isExampleQuote(model, state.options);
  const date = new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const phone = site.whatsapp ? site.whatsappDisplay : null;

  const row = "flex items-baseline justify-between gap-6 border-b border-[#c9ccd1] py-2.5";

  return (
    <div className="hidden bg-white text-[11pt] leading-snug text-black [-webkit-print-color-adjust:exact] [print-color-adjust:exact] print:block">
      <div className="flex items-center justify-between bg-black px-5 py-4 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images.logo.src} alt={site.name} className="h-11 w-auto" />
        <div className="text-right text-[9pt]">
          <p className="font-semibold uppercase tracking-[0.2em]">Presupuesto estimado</p>
          <p className="mt-1">{date}</p>
        </div>
      </div>

      <h1 className="mt-6 font-display text-[32pt] font-extrabold uppercase leading-none">{model.name}</h1>
      <p className="mt-1 text-[9pt] uppercase tracking-[0.2em]">{model.line}</p>

      <dl className="mt-6">
        <div className={row}>
          <dt>Precio base · {model.name}</dt>
          <dd className="font-semibold tabular-nums">
            {model.price ? formatPrice(model.price.amount) : "[A confirmar]"}
            {model.price?.status === "ejemplo" && " (ejemplo)"}
          </dd>
        </div>
        <div className={row}>
          <dt>Pick up</dt>
          <dd className="font-semibold">
            {pickup ?? "A definir"}
            {state.cabin && `, ${cabinLabels[state.cabin].toLowerCase()}`}
          </dd>
        </div>
        {chosen.map((o) => (
          <div key={o.id} className={row}>
            <dt>{o.name}</dt>
            <dd className="font-semibold tabular-nums">
              + {formatPrice(o.price)}
              {examplePricing && o.priceStatus !== "publicado" && " (ejemplo)"}
            </dd>
          </div>
        ))}
        {chosen.length === 0 && (
          <div className={row}>
            <dt>Opcionales</dt>
            <dd>Ninguno</dd>
          </div>
        )}
        <div className={row}>
          <dt>Peso estimado</dt>
          <dd className="font-semibold">{weightText(model, state)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-baseline justify-between bg-black px-5 py-4 text-white">
        <span className="text-[9pt] uppercase tracking-[0.2em]">Total estimado</span>
        <span className="font-display text-[28pt] font-extrabold tabular-nums">
          {formatPrice(totalFor(model, state))}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-[9pt] text-[#2a2d31]">
        {example && <p>Incluye valores de ejemplo: el presupuesto final lo confirma Tortuga.</p>}
        {model.price?.note && <p>{model.price.note}</p>}
        <p>Este documento es una estimación armada en el configurador web, no una oferta comercial.</p>
      </div>

      {(contact.name.trim() || contact.province || contact.when) && (
        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-[#c9ccd1] pt-4 text-[9pt]">
          {contact.name.trim() && (
            <div>
              <dt className="uppercase tracking-[0.2em]">Nombre</dt>
              <dd className="mt-1 text-[11pt] font-semibold">{contact.name.trim()}</dd>
            </div>
          )}
          {contact.province && (
            <div>
              <dt className="uppercase tracking-[0.2em]">Provincia</dt>
              <dd className="mt-1 text-[11pt] font-semibold">{contact.province}</dd>
            </div>
          )}
          {contact.when && (
            <div>
              <dt className="uppercase tracking-[0.2em]">Para cuándo</dt>
              <dd className="mt-1 text-[11pt] font-semibold">{contact.when}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-8 border-t-[3px] border-black pt-4 text-[9pt]">
        <p className="font-semibold uppercase tracking-[0.2em]">Seguí la conversación</p>
        <p className="mt-2">
          {[phone && `WhatsApp ${phone}`, site.email, site.instagram.handle, site.domain]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
        <p className="mt-2 break-all text-[#2a2d31]">Tu configuración: {shareUrl}</p>
      </div>
    </div>
  );
}
