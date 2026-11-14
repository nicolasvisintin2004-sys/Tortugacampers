import Link from "next/link";
import { images, site, trustStrip } from "@/content/site";
import { ArrowIcon } from "@/components/icons";
import { HeroMedia } from "@/components/home/HeroMedia";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-asfalto text-white lg:grid lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[minmax(0,1fr)_42vw]">
      {/* Foto / reel a sangre */}
      <div className="relative h-[58svh] min-h-[21rem] lg:order-2 lg:h-auto lg:min-h-0">
        <HeroMedia image={images.dc.hero} video="/video/hero-discover.mp4" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[62%] bg-gradient-to-t from-asfalto from-[2%] via-asfalto/70 to-transparent lg:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-asfalto to-transparent lg:block"
        />
      </div>

      {/* Texto */}
      <div className="relative z-10 -mt-32 px-5 pb-10 lg:order-1 lg:mt-0 lg:flex lg:flex-col lg:justify-end lg:pb-14 lg:pl-[max(2.5rem,calc((100vw-82.5rem)/2+2.5rem))] lg:pr-0 lg:pt-16">
        <p className="label text-white/80">Campers off road para pick up</p>

        <h1 className="display mt-4 lg:-mr-24 lg:mt-6">
          <span className="block text-[clamp(3.25rem,15.4vw,5rem)] lg:text-[clamp(5.5rem,8.6vw,9.75rem)]">
            Donde termina
            <br />
            el asfalto,
          </span>
          <span className="mt-2 block text-[clamp(2rem,9.4vw,3rem)] text-amarillo lg:mt-3 lg:text-[clamp(3.25rem,5.1vw,5.75rem)]">
            empieza la aventura.
          </span>
        </h1>

        <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-white/80 lg:mt-7 lg:text-lg">
          {site.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3 lg:mt-9">
          <Link href="/#modelos" className="btn btn-white">
            Ver modelos
          </Link>
          <Link href="/configurador" className="btn btn-yellow">
            Armá el tuyo <ArrowIcon className="max-[400px]:hidden" />
          </Link>
        </div>

        {/* Tira de confianza */}
        <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/20 pt-5 lg:mt-14 lg:flex lg:flex-wrap lg:gap-x-8 lg:whitespace-nowrap">
          {trustStrip.map((item) => (
            <li key={item} className="label flex items-start gap-2 text-white/75">
              <span aria-hidden className="mt-[0.3em] block h-[0.55em] w-[0.55em] shrink-0 bg-amarillo [clip-path:polygon(0_0,100%_0,100%_100%,45%_100%,0_55%)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
