import Link from "next/link";
import { Blueprint } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-end overflow-hidden bg-asfalto pb-16 pt-24 text-white lg:min-h-[calc(100svh-4.5rem)] lg:pb-24">
      <Blueprint className="pointer-events-none absolute left-1/2 top-[8%] w-[150%] max-w-none -translate-x-1/2 text-white/20 lg:w-[58rem]" />
      <div className="wrap relative">
        <p className="label text-casco">Error 404</p>
        <h1 className="display mt-4 text-[clamp(3.5rem,16vw,9rem)]">Acá se terminó el camino</h1>
        <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-white/75">
          Esta página no existe o cambió de lugar. Volvé al inicio o mirá los modelos.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-yellow">
            Ir al inicio
          </Link>
          <Link href="/#modelos" className="btn btn-graphite">
            Ver modelos
          </Link>
        </div>
      </div>
    </section>
  );
}
