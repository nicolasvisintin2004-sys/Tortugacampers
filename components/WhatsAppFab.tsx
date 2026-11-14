"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";

/**
 * Botón flotante de WhatsApp en mobile.
 * - Arriba de todo no aparece: ahí ya está el ícono de WhatsApp del header
 *   y taparía los botones del hero. Entra apenas se empieza a bajar.
 * - En el configurador tampoco: el acceso a WhatsApp vive dentro de la
 *   barra de resumen, para no taparla.
 */
export function WhatsAppFab() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname.startsWith("/configurador/")) return null;

  return (
    <a
      href={whatsappLink(messages.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amarillo text-asfalto shadow-[0_6px_24px_rgba(0,0,0,0.45)] ring-2 ring-asfalto transition-[opacity,transform] duration-300 active:scale-95 lg:hidden ${
        visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon size={28} />
      <span className="sr-only">Escribinos por WhatsApp</span>
    </a>
  );
}
