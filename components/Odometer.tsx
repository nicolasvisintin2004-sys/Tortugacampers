"use client";

import { m } from "framer-motion";
import { formatNumber } from "@/lib/format";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * El total del configurador: un odómetro. Cada dígito es una columna
 * 0–9 que gira hasta su valor. Es el único momento protagonista del sitio.
 * Visualmente decorativo: el valor accesible lo anuncia quien lo usa.
 */
export function Odometer({ value, className }: { value: number; className?: string }) {
  const chars = formatNumber(value).split("");

  return (
    <span className={`nums inline-flex leading-none ${className ?? ""}`} aria-hidden="true">
      {chars.map((ch, i) => {
        // La clave se cuenta desde la derecha: las columnas no se reinician
        // cuando el número gana o pierde una cifra.
        const fromRight = chars.length - 1 - i;
        if (!/\d/.test(ch)) {
          return (
            <span key={`s${fromRight}`} className="inline-block">
              {ch}
            </span>
          );
        }
        return <Digit key={`d${fromRight}`} digit={Number(ch)} order={fromRight} />;
      })}
    </span>
  );
}

function Digit({ digit, order }: { digit: number; order: number }) {
  return (
    <span className="relative inline-block overflow-hidden" style={{ height: "1em", lineHeight: 1 }}>
      {/* Reserva el ancho de un dígito: todas las columnas miden lo mismo. */}
      <span className="invisible">0</span>
      <m.span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        initial={false}
        animate={{ y: `${-digit * 10}%` }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 19,
          mass: 0.9,
          delay: order * 0.035,
        }}
      >
        {DIGITS.map((n) => (
          <span key={n} style={{ height: "1em", lineHeight: 1 }}>
            {n}
          </span>
        ))}
      </m.span>
    </span>
  );
}
