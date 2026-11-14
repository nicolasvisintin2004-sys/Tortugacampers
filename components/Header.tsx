import Link from "next/link";
import { messages, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/ui";
import { MobileMenu } from "@/components/MobileMenu";
import { NavMenu } from "@/components/NavMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 print:hidden border-b border-white/10 bg-asfalto text-white">
      <div className="wrap flex h-14 items-center justify-between gap-3 lg:grid lg:h-[4.5rem] lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" aria-label="Tortuga Campers, ir al inicio" className="shrink-0 lg:justify-self-start">
          <Logo priority className="h-8 w-auto lg:h-10" />
        </Link>

        <NavMenu />

        <div className="flex items-center gap-1.5 lg:justify-self-end lg:gap-3">
          <Link
            href="/configurador"
            className="flex h-11 items-center px-2 font-display text-[1.3125rem] font-bold uppercase tracking-wide text-amarillo max-[359px]:hidden lg:hidden"
          >
            Armá el tuyo
          </Link>
          <Link href="/configurador" className="btn btn-yellow btn-sm hidden lg:inline-flex">
            Armá el tuyo
          </Link>
          <a
            href={whatsappLink(messages.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center gap-2 px-2.5 text-white transition-colors hover:text-amarillo lg:px-3"
          >
            <WhatsAppIcon size={22} />
            <span className="hidden text-[0.9375rem] font-medium lg:inline">WhatsApp</span>
            <span className="sr-only lg:hidden">Escribinos por WhatsApp</span>
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
