import Image from "next/image";
import type { ReactNode } from "react";
import { A_CONFIRMAR, images, type Price, type SiteImage } from "@/content/site";
import { cx, formatPrice } from "@/lib/format";

/** Marca visible de dato pendiente. */
export function Pending({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "whitespace-nowrap text-[0.92em] underline decoration-dotted decoration-1 underline-offset-[0.25em]",
        className,
      )}
    >
      {A_CONFIRMAR}
    </span>
  );
}

/** Resalta cada "[A confirmar]" dentro de un texto del contenido. */
export function WithPending({ text }: { text: string }) {
  const parts = text.split(A_CONFIRMAR);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <Pending />}
        </span>
      ))}
    </>
  );
}

/** Valor o "[A confirmar]". */
export function Value({ value }: { value: string | null }) {
  return value ? <WithPending text={value} /> : <Pending />;
}

export function ExampleTag({
  tone = "dark",
  short = false,
  className,
}: {
  tone?: "dark" | "light" | "yellow";
  short?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center whitespace-nowrap border px-1.5 py-[0.2rem] text-[0.625rem] font-medium uppercase leading-none tracking-[0.14em]",
        tone === "dark" && "border-white/35 text-white/80",
        tone === "light" && "border-acero/60 text-acero",
        tone === "yellow" && "border-asfalto/50 text-asfalto",
        className,
      )}
    >
      {short ? "Ejemplo" : "Valor de ejemplo"}
    </span>
  );
}

/** "Desde USD 28.000", con la marca de ejemplo cuando corresponde. */
export function PriceFrom({
  price,
  tone = "dark",
  className,
}: {
  price: Price | null;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p className={cx("flex flex-wrap items-center gap-x-2.5 gap-y-1", className)}>
      <span className={cx("label", tone === "dark" ? "text-casco" : "text-acero")}>Desde</span>
      {price ? (
        <>
          <span className="nums font-display text-[1.75rem] font-bold leading-none tracking-wide">
            {formatPrice(price.amount)}
          </span>
          {price.status === "ejemplo" && <ExampleTag tone={tone} short />}
        </>
      ) : (
        <Pending />
      )}
    </p>
  );
}

/** Foto con la esquina cortada. El contenedor define la proporción. */
export function Photo({
  image,
  sizes,
  className,
  priority = false,
  chamfer = true,
  children,
}: {
  image: SiteImage;
  sizes: string;
  className?: string;
  priority?: boolean;
  chamfer?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={cx("relative overflow-hidden bg-grafito", chamfer && "chamfer-lg", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={image.focus ? { objectPosition: image.focus } : undefined}
      />
      {children}
    </div>
  );
}

export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={images.logo.src}
      alt="Tortuga Campers"
      width={images.logo.width}
      height={images.logo.height}
      sizes="160px"
      priority={priority}
      className={className}
    />
  );
}

/** Encabezado de sección: etiqueta espaciada + título display. */
export function SectionHead({
  eyebrow,
  title,
  children,
  tone = "dark",
  className,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
  id?: string;
}) {
  return (
    <div className={cx("max-w-3xl", className)}>
      {eyebrow && (
        <p className={cx("label mb-4", tone === "dark" ? "text-casco" : "text-acero")}>{eyebrow}</p>
      )}
      <h2 id={id} className="display text-[clamp(3.25rem,14.5vw,6rem)]">
        {title}
      </h2>
      {children && (
        <div
          className={cx(
            "mt-5 max-w-xl text-[1.0625rem] leading-relaxed",
            tone === "dark" ? "text-white/75" : "text-acero",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Silueta en plano de un camper sobre pick up, para modelos sin fotos.
 * No representa medidas reales: es un marcador de "en desarrollo".
 */
export function Blueprint({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="5 5"
      strokeLinejoin="miter"
      className={className}
      aria-hidden
      focusable={false}
    >
      {/* módulo */}
      <path d="M96 118V40l18-14h150l24 20v30h-70v42z" />
      <path d="M150 52h34v20h-34z" />
      {/* pick up */}
      <path d="M218 118V84h46l22 22 16 4v22H40v-14z" strokeDasharray="none" opacity=".55" />
      <circle cx="96" cy="136" r="17" strokeDasharray="none" opacity=".55" />
      <circle cx="254" cy="136" r="17" strokeDasharray="none" opacity=".55" />
    </svg>
  );
}
