import type { SVGProps } from "react";
import type { OptionIcon as OptionIconId } from "@/content/site";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 24, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export const WhatsAppIcon = ({ size = 24, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const InstagramIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.2 6.8h.01" strokeLinecap="round" strokeWidth={2.4} />
  </svg>
);

export const ArrowIcon = ({ size = 20, className, ...p }: P) => (
  <svg {...base(size, p)} className={`arrow ${className ?? ""}`} strokeWidth={2}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ChevronIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const CheckIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2.5}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const PlusIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2.25}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MenuIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M3 7h18M3 12h18M3 17h12" />
  </svg>
);

export const CloseIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
);

export const DownloadIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 4v11M7.500 10.500 12 15l4.500-4.500M5 19.500h14" />
  </svg>
);

export const MailIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M3 5.500h18v13H3z" />
    <path d="m3.500 6.500 8.500 7 8.500-7" />
  </svg>
);

export const ShareIcon =({ size = 20, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 15V4M8 7.5 12 3.5l4 4M5 12v8h14v-8" />
  </svg>
);

/* ---------------- Íconos de opcionales (dibujados para Tortuga) ---------------- */

const optionPaths: Record<OptionIconId, React.ReactNode> = {
  bateria: (
    <>
      <path d="M3 8h18v11H3zM7 8V5.5h3V8M14 8V5.5h3V8" />
      <path d="M6.5 13.5h3M15 13.5h3M16.5 12v3" />
    </>
  ),
  inversor: (
    <>
      <path d="M8 3v5M16 3v5M5 8h14v4a7 7 0 0 1-14 0z" />
      <path d="M12 19v2.5" />
    </>
  ),
  starlink: (
    <>
      <path d="M3.5 9.5a11 11 0 0 0 11 11z" />
      <path d="M9 15l6-6" />
      <circle cx="16" cy="8" r="1.6" />
      <path d="M17.5 3.5a4.5 4.5 0 0 1 3 3" />
    </>
  ),
  toldo: (
    <>
      <path d="M3 6h18l-2 7H5z" />
      <path d="M9 6l-1 7M15 6l1 7M5 13v7M19 13v7" />
    </>
  ),
  climatizador: (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M8 9c1.300-1 2.700 1 4 0s2.700 1 4 0M8 13c1.300-1 2.700 1 4 0s2.700 1 4 0M8 17h8" />
    </>
  ),
  tv: (
    <>
      <path d="M3 4.500h18v12H3z" />
      <path d="M12 16.500v4M8.500 20.500h7" />
    </>
  ),
  inodoro: (
    <>
      <path d="M5 3h6v7H5z" />
      <path d="M3.500 10H19a5.500 5.500 0 0 1-5.500 5.500H11l.800 5H7.200l.800-5.400A5 5 0 0 1 3.500 10z" />
    </>
  ),
  ducha: (
    <>
      <path d="M5 21V8a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4" />
      <path d="M10 8h8M11 12l-.500 1.500M14 12v1.500M17 12l.500 1.500M12.500 16.500l-.300 1.500M15.500 16.500l.300 1.500" />
    </>
  ),
  gabinete: (
    <>
      <path d="M3 6h18v13H3zM3 12.500h18" />
      <path d="M10 9.250h4M10 15.750h4" />
    </>
  ),
  patas: (
    <>
      <path d="M4 4h16v8H4z" />
      <path d="M6 12v8M18 12v8M4 20h4M16 20h4M12 14v5M10 17l2 2 2-2" />
    </>
  ),
  tray: (
    <>
      <path d="M2.500 10h19v4h-19zM2.500 10V7M21.500 10V7" />
      <circle cx="6.500" cy="18" r="2" />
      <circle cx="17.500" cy="18" r="2" />
    </>
  ),
  suspension: (
    <>
      <path d="M7 3h10M7 21h10" />
      <path d="M12 3v2.500L7 7.500l10 2-10 2 10 2-10 2 5 2V21" />
    </>
  ),
  bumper: (
    <>
      <path d="M5 10V6.500h14V10M2.500 10h19l-1.500 5H4z" />
      <path d="M9 12.500h6M6.500 15v3.500M17.500 15v3.500" />
    </>
  ),
  calefaccion: (
    <>
      <path d="M12 21a6 6 0 0 0 6-6c0-3-2-4.500-3-7.500-1.800 1-2.800 2.500-3 4.500-1-1-1.500-2-1.500-3.500C8 10 6 12.500 6 15a6 6 0 0 0 6 6z" />
    </>
  ),
  clima: (
    <>
      <path d="M12 2.500v19M3.800 7.250l16.400 9.500M20.200 7.250 3.800 16.750" />
      <path d="M9.500 4.500 12 7l2.500-2.500M9.500 19.500 12 17l2.500 2.500" />
    </>
  ),
  rack: (
    <>
      <path d="M2.500 9h19M5 9v5M19 9v5M2.500 14h19" />
      <path d="M7 9V5.500h10V9M6 14v4M18 14v4" />
    </>
  ),
};

export const OptionIcon = ({ name, size = 28, ...p }: P & { name: OptionIconId }) => (
  <svg {...base(size, p)} strokeWidth={1.6}>
    {optionPaths[name]}
  </svg>
);
