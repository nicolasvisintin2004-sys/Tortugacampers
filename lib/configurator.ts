import {
  cabinLabels,
  examplePricing,
  options,
  optionsFor,
  pickupBrands,
  type Cabin,
  type ConfigOption,
  type Model,
} from "@/content/site";
import { formatNumber, formatPrice } from "@/lib/format";

/**
 * Estado del configurador. Vive en la URL (query params) para que la
 * configuración se pueda compartir:
 *   /configurador/t-350?marca=toyota&pickup=hilux&cabina=doble&op=toldo,calefaccion&paso=3
 */
export type ConfigState = {
  brand: string | null;
  /** id del modelo de pick up, o texto libre cuando la marca es "otra". */
  pickup: string | null;
  cabin: Cabin | null;
  options: string[];
  step: number;
};

export const STEPS = ["Modelo", "Pick up", "Opcionales", "Presupuesto"] as const;
export const OTHER_BRAND = "otra";

export const parseState = (params: URLSearchParams, modelSlug: string): ConfigState => {
  const valid = new Set(optionsFor(modelSlug).map((o) => o.id));
  const ids = (params.get("op") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((id) => valid.has(id));
  // Respeta los grupos excluyentes aunque la URL venga editada a mano.
  const options = ids.reduce<string[]>(
    (acc, id) => (acc.includes(id) ? acc : toggleOptionIds(acc, id)),
    [],
  );

  const brandParam = params.get("marca");
  const brand =
    brandParam === OTHER_BRAND || pickupBrands.some((b) => b.id === brandParam)
      ? brandParam
      : null;

  let pickup = params.get("pickup");
  if (brand && brand !== OTHER_BRAND) {
    const b = pickupBrands.find((x) => x.id === brand)!;
    if (!b.models.some((m) => m.id === pickup)) pickup = b.models.length === 1 ? b.models[0].id : null;
  } else if (brand === OTHER_BRAND) {
    pickup = pickup ? pickup.slice(0, 60) : null;
  } else {
    pickup = null;
  }

  const cabinParam = params.get("cabina");
  const cabin: Cabin | null = cabinParam === "simple" || cabinParam === "doble" ? cabinParam : null;

  const stepParam = Number(params.get("paso"));
  const step = Number.isInteger(stepParam) && stepParam >= 1 && stepParam <= STEPS.length ? stepParam : 1;

  return { brand, pickup, cabin, options: [...new Set(options)], step };
};

export const serializeState = (state: ConfigState, opts: { withStep?: boolean } = {}) => {
  const p = new URLSearchParams();
  if (state.brand) p.set("marca", state.brand);
  if (state.pickup) p.set("pickup", state.pickup);
  if (state.cabin) p.set("cabina", state.cabin);
  if (state.options.length) p.set("op", state.options.join(","));
  if (opts.withStep !== false && state.step > 1) p.set("paso", String(state.step));
  // Las comas se leen mejor sin codificar y siguen siendo válidas en la query.
  return p.toString().replace(/%2C/g, ",");
};

export const selectedOptions = (model: Model, state: ConfigState): ConfigOption[] =>
  optionsFor(model.slug).filter((o) => state.options.includes(o.id));

/** Prende o apaga un opcional; los del mismo grupo se excluyen entre sí. */
export const toggleOptionIds = (current: string[], id: string): string[] => {
  if (current.includes(id)) return current.filter((x) => x !== id);
  const group = options.find((o) => o.id === id)?.group;
  const rest = group
    ? current.filter((x) => options.find((o) => o.id === x)?.group !== group)
    : current;
  return [...rest, id];
};

/** El total lleva algún valor de ejemplo (precio base u opcionales). */
export const isExampleQuote = (model: Model, optionIds: string[]) =>
  model.price?.status === "ejemplo" ||
  (examplePricing &&
    optionIds.some((id) => options.find((o) => o.id === id)?.priceStatus !== "publicado"));

/**
 * Peso estimado: peso en seco del modelo + lo que suman los opcionales.
 * `pending` indica si algún dato todavía no está confirmado.
 */
export const weightFor = (model: Model, state: ConfigState) => {
  const chosen = selectedOptions(model, state);
  const known = chosen.filter((o) => typeof o.weightKg === "number");
  const base = model.dryWeightKg;
  return {
    base,
    options: known.reduce((sum, o) => sum + (o.weightKg ?? 0), 0),
    total: base === null ? null : base + known.reduce((sum, o) => sum + (o.weightKg ?? 0), 0),
    optionsPending: chosen.length - known.length,
  };
};

/** "790 kg en seco + opcionales [A confirmar]" para mensajes y presupuesto impreso. */
export const weightText = (model: Model, state: ConfigState) => {
  const w = weightFor(model, state);
  if (w.total === null) return "[A confirmar]";
  const base = `${formatNumber(w.total)} kg${w.options === 0 ? " en seco" : ""}`;
  return w.optionsPending > 0 ? `${base} + ${w.optionsPending === 1 ? "1 opcional" : `${w.optionsPending} opcionales`} con peso [A confirmar]` : base;
};

export const totalFor = (model: Model, state: ConfigState) =>
  (model.price?.amount ?? 0) + selectedOptions(model, state).reduce((sum, o) => sum + o.price, 0);

export const pickupLabel = (state: ConfigState): string | null => {
  if (!state.brand) return null;
  if (state.brand === OTHER_BRAND) return state.pickup?.trim() || null;
  const brand = pickupBrands.find((b) => b.id === state.brand);
  if (!brand) return null;
  const model = brand.models.find((m) => m.id === state.pickup);
  if (!model) return brand.name;
  return model.name.startsWith(brand.name) ? model.name : `${brand.name} ${model.name}`;
};

export type Contact = { name: string; province: string; when: string };

/** Mensaje de WhatsApp con todo el detalle de la configuración. */
export const buildQuoteMessage = (
  model: Model,
  state: ConfigState,
  contact: Contact,
  shareUrl: string,
) => {
  const chosen = selectedOptions(model, state);
  const pickup = pickupLabel(state);
  const lines: string[] = [];

  lines.push(`Hola Tortuga, armé mi camper en la web y quiero el presupuesto.`, "");
  lines.push(
    `*Modelo:* ${model.name}${model.price ? ` — ${formatPrice(model.price.amount)}` : ""}`,
  );
  lines.push(
    `*Pick up:* ${pickup ?? "a definir"}${state.cabin ? `, ${cabinLabels[state.cabin].toLowerCase()}` : ""}`,
  );
  lines.push("");

  if (chosen.length) {
    lines.push(`*Opcionales:*`);
    for (const o of chosen) lines.push(`• ${o.name} — ${formatPrice(o.price)}`);
  } else {
    lines.push(`*Opcionales:* ninguno por ahora`);
  }
  lines.push("");

  const example = isExampleQuote(model, state.options);
  lines.push(`*Peso estimado:* ${weightText(model, state)}`);
  lines.push(
    `*Total estimado:* ${formatPrice(totalFor(model, state))}${example ? " (valores de ejemplo)" : ""}`,
  );
  lines.push("");

  if (contact.name.trim()) lines.push(`*Nombre:* ${contact.name.trim()}`);
  if (contact.province) lines.push(`*Provincia:* ${contact.province}`);
  if (contact.when) lines.push(`*Para cuándo:* ${contact.when}`);
  lines.push("", `Mi configuración: ${shareUrl}`);

  return lines.join("\n");
};
