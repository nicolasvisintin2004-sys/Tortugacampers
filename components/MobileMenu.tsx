"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { modelLines, site } from "@/content/site";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { ArrowIcon, CloseIcon, InstagramIcon, MenuIcon, WhatsAppIcon } from "@/components/icons";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    // El foco entra al panel; el primer Tab cae en el primer link.
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="menu-movil"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center text-white"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
      </button>

      <div
        id="menu-movil"
        ref={panelRef}
        hidden={!open}
        tabIndex={-1}
        className="fixed inset-x-0 bottom-0 top-14 z-50 overflow-y-auto bg-asfalto"
      >
        <nav
          aria-label="Menú principal"
          className="wrap flex min-h-full flex-col pb-8 pt-6"
          // Cualquier link del menú lo cierra al navegar.
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {modelLines.map((line, i) => (
            <div key={line.name} className={i > 0 ? "mt-8" : undefined}>
              <p className="label text-casco">{line.name}</p>
              <ul className="mt-3 border-t border-white/15">
                {line.models.map((model) => {
                  const upcoming = model.status === "proximamente";
                  return (
                    <li key={model.slug} className="border-b border-white/15">
                      <Link
                        href={`/modelos/${model.slug}`}
                        className={`flex items-center justify-between ${upcoming ? "py-3.5 text-white/60" : "py-4"}`}
                      >
                        <span className={`display ${upcoming ? "text-[1.75rem]" : "text-[2.75rem]"}`}>
                          {model.name}
                        </span>
                        <span className={`label ${model.status === "lanzamiento" ? "text-amarillo" : upcoming ? "" : "text-casco"}`}>
                          {model.statusLabel}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <Link
            href="/preguntas-frecuentes"
            className="mt-8 flex items-center justify-between border-y border-white/15 py-4"
          >
            <span className="display text-[1.75rem]">Preguntas frecuentes</span>
            <ArrowIcon />
          </Link>

          <Link href="/configurador" className="btn btn-yellow mt-8 w-full">
            Armá el tuyo <ArrowIcon />
          </Link>

          <div className="mt-auto flex flex-col gap-1 pt-10">
            <a
              href={whatsappLink(messages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center gap-3 text-[1.0625rem]"
            >
              <WhatsAppIcon size={22} /> Escribinos por WhatsApp
            </a>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center gap-3 text-[1.0625rem]"
            >
              <InstagramIcon size={22} /> {site.instagram.handle}
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
