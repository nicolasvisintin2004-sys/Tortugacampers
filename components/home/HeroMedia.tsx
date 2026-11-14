"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SiteImage } from "@/content/site";

/**
 * Foto del hero (LCP, con priority) + reel mudo encima.
 * El video se monta recién cuando la página terminó de cargar, y no se
 * carga si el usuario pidió menos movimiento o ahorro de datos.
 */
export function HeroMedia({ image, video }: { image: SiteImage; video: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [mount, setMount] = useState(false);
  const [poster, setPoster] = useState(image.src);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduce || conn?.saveData) return;

    let timer: ReturnType<typeof setTimeout>;
    const start = () => {
      timer = setTimeout(() => {
        // El póster reutiliza la variante de la foto que el navegador ya bajó.
        setPoster(imageRef.current?.currentSrc || image.src);
        setMount(true);
      }, 600);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, [image.src]);

  // Pausar cuando el hero sale de pantalla.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !mount) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) el.pause();
        else if (!paused) el.play().catch(() => {});
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mount, paused]);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      setPaused(false);
    } else {
      el.pause();
      setPaused(true);
    }
  };

  return (
    <>
      <Image
        ref={imageRef}
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="(min-width: 1024px) 42vw, 100vw"
        className="object-cover"
        style={{ objectPosition: image.focus }}
      />
      {mount && (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          // Recorte mínimo en la zona que tapa el degradé: así la foto, que
          // carga primero, sigue siendo el elemento LCP y no el video.
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 [clip-path:inset(0_0_6%_0)] lg:[clip-path:inset(0_0_0_3%)] ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: image.focus }}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
      {mount && playing && (
        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] hover:text-white lg:bottom-3 lg:right-3 lg:top-auto"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            {paused ? <path d="M4 2.500v11l9-5.500z" /> : <path d="M3.500 2.500h3v11h-3zM9.500 2.500h3v11h-3z" />}
          </svg>
          <span className="sr-only">{paused ? "Reproducir video" : "Pausar video"}</span>
        </button>
      )}
    </>
  );
}
