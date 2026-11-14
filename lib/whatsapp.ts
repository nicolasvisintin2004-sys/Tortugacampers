import { site } from "@/content/site";

/**
 * Link de WhatsApp con el mensaje armado.
 * Si todavía no hay número cargado en content/site.ts, abre WhatsApp
 * y deja elegir el contacto (sirve para probar la demo).
 */
export const whatsappLink = (message: string) => {
  const text = encodeURIComponent(message);
  return site.whatsapp
    ? `https://wa.me/${site.whatsapp}?text=${text}`
    : `https://wa.me/?text=${text}`;
};

export const messages = {
  general: "Hola Tortuga, vi la web y quiero hacerles una consulta.",
  model: (name: string) => `Hola Tortuga, quiero más información del ${name}.`,
  notify: (name: string) =>
    `Hola Tortuga, avisame cuando salga el ${name}. Quiero enterarme antes que nadie.`,
  pickup: (name: string) =>
    `Hola Tortuga, quiero saber si el ${name} sirve para mi pick up. Es una: `,
  spec: (name: string) => `Hola Tortuga, ¿me pasan la ficha técnica completa del ${name}?`,
};
