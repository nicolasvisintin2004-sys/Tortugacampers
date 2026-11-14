"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { modelLines } from "@/content/site";
import { cx, formatPrice } from "@/lib/format";
import { ChevronIcon } from "@/components/icons";
import { Blueprint } from "@/components/ui";

/**
 * Navegación de escritorio: un desplegable por línea (T y Discover) y el
 * link a preguntas frecuentes. Se abre con clic o teclado; cierra con
 * Escape, clic afuera o al navegar.
 */
export function NavMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const btn = rootRef.current?.querySelector<HTMLButtonElement>(`[data-line="${open}"]`);
      setOpen(null);
      btn?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="hidden lg:block">
      <nav aria-label="Principal">
        <ul className="flex items-center gap-1">
          {modelLines.map((line) => {
            const isOpen = open === line.name;
            const active = line.models.some((m) => pathname === `/modelos/${m.slug}`);
            const panelId = `menu-${line.name.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <li key={line.name} className="relative">
                <button
                  type="button"
                  data-line={line.name}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : line.name)}
                  className={cx(
                    "flex h-11 items-center gap-1.5 px-3.5 font-display text-[1.375rem] font-bold uppercase tracking-wide transition-colors hover:text-amarillo",
                    isOpen || active ? "text-amarillo" : "text-white/85",
                  )}
                >
                  {line.name}
                  <ChevronIcon
                    size={18}
                    className={cx("transition-transform duration-200", isOpen && "rotate-180")}
                  />
                </button>

                <div
                  id={panelId}
                  hidden={!isOpen}
                  className="chamfer-lg absolute left-1/2 top-[calc(100%+0.9rem)] w-[27rem] -translate-x-1/2 bg-carbon p-2 shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                >
                  <p className="label px-3 pb-2 pt-3 text-casco">
                    {line.models.length} {line.models.length === 1 ? "modelo" : "modelos"}
                  </p>
                  <ul>
                    {line.models.map((m) => {
                      const upcoming = m.status === "proximamente";
                      const current = pathname === `/modelos/${m.slug}`;
                      return (
                        <li key={m.slug}>
                          <Link
                            href={`/modelos/${m.slug}`}
                            onClick={() => setOpen(null)}
                            aria-current={current ? "page" : undefined}
                            className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 p-3 transition-colors hover:bg-grafito"
                          >
                            <span className="relative block aspect-[4/5] overflow-hidden bg-grafito">
                              {m.hero ? (
                                <Image
                                  src={m.hero.src}
                                  alt=""
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                  style={{ objectPosition: m.hero.focus }}
                                />
                              ) : (
                                <Blueprint className="absolute left-1/2 top-1/2 w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 text-white/35" />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span
                                className={cx(
                                  "display block text-[1.75rem] transition-colors group-hover:text-amarillo",
                                  upcoming ? "text-white/60" : "text-white",
                                )}
                              >
                                {m.name}
                              </span>
                              <span className="nums mt-0.5 block text-[0.8125rem] text-white/60">
                                {upcoming
                                  ? "En desarrollo"
                                  : m.price
                                    ? `Desde ${formatPrice(m.price.amount)}${m.price.status === "ejemplo" ? " (ejemplo)" : ""}`
                                    : "Precio [A confirmar]"}
                              </span>
                            </span>
                            <span
                              className={cx(
                                "label text-[0.5625rem]",
                                m.status === "lanzamiento" ? "text-amarillo" : "text-casco",
                              )}
                            >
                              {m.statusLabel}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
          <li>
            <Link
              href="/preguntas-frecuentes"
              aria-current={pathname === "/preguntas-frecuentes" ? "page" : undefined}
              className={cx(
                "flex h-11 items-center px-3.5 font-display text-[1.375rem] font-bold uppercase tracking-wide transition-colors hover:text-amarillo",
                pathname === "/preguntas-frecuentes" ? "text-amarillo" : "text-white/85",
              )}
            >
              Preguntas<span className="hidden xl:inline">&nbsp;frecuentes</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
