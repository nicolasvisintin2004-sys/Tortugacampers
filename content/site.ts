/**
 * TORTUGA CAMPERS — contenido del sitio
 * ------------------------------------------------------------------
 * Único lugar donde vive el contenido: marca, modelos, specs, precios,
 * opcionales, FAQ, textos y WhatsApp. Las páginas de modelo y los
 * configuradores se generan desde acá.
 *
 * Convenciones:
 *  - `null` en un dato = todavía no lo confirmó el cliente. La interfaz
 *    lo muestra como "[A confirmar]" (o achica la sección si no hay nada).
 *  - `status: "ejemplo"` en un precio = valor de muestra para la demo.
 *    La interfaz lo marca como "valor de ejemplo".
 *  - Las fuentes de cada dato real están comentadas al lado.
 */

/* ------------------------------------------------------------------ */
/* Tipos                                                                */
/* ------------------------------------------------------------------ */

export type Pending = null;
export const A_CONFIRMAR = "[A confirmar]";

export type ImageKind = "exterior" | "interior" | "detalle";

export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: ImageKind;
  /** object-position para recortes (por defecto, centro). */
  focus?: string;
};

export type Price = {
  amount: number;
  /** "publicado": lo publicó Tortuga. "ejemplo": valor de muestra de la demo. */
  status: "publicado" | "ejemplo";
  note?: string;
};

export type Cabin = "simple" | "doble";

export type SpecKey =
  | "peso"
  | "largo"
  | "ancho"
  | "alto"
  | "plazas"
  | "agua"
  | "energia";

export type ModelStatus = "disponible" | "lanzamiento" | "proximamente";

export type Model = {
  slug: string;
  name: string;
  line: string;
  status: ModelStatus;
  statusLabel: string;
  /** Para quién es, en una frase. */
  forWho: string;
  /** Bajada del hero de la página del modelo. */
  intro: string;
  price: Price | null;
  hero: SiteImage | null;
  gallery: SiteImage[];
  specs: Record<SpecKey, string | Pending>;
  /** Peso en seco en kg, para el cálculo del configurador. `null` = [A confirmar]. */
  dryWeightKg: number | Pending;
  /** Datos sueltos confirmados que no entran en la tabla base. */
  extraSpecs: { label: string; value: string }[];
  /** Equipamiento propio del modelo, agrupado. Vacío = [A confirmar]. */
  equipment: { title: string; items: string[] }[];
  equipmentNote?: string;
  /** Cabinas confirmadas. `null` = [A confirmar]. */
  cabins: Cabin[] | Pending;
  /** Pick ups confirmadas para este modelo. `null` = [A confirmar]. */
  pickups: string[] | Pending;
  pickupsNote?: string;
  /** Aclaración sobre los opcionales en el configurador de este modelo. */
  optionsNote?: string;
};

export type OptionCategoryId = "energia" | "confort" | "bano" | "exterior" | "pickup";

export type OptionIcon =
  | "bateria"
  | "inversor"
  | "starlink"
  | "clima"
  | "climatizador"
  | "calefaccion"
  | "tv"
  | "inodoro"
  | "ducha"
  | "toldo"
  | "gabinete"
  | "rack"
  | "patas"
  | "tray"
  | "suspension"
  | "bumper";

export type ConfigOption = {
  id: string;
  category: OptionCategoryId;
  name: string;
  /** Una línea. */
  description: string;
  /** Precio en la moneda del sitio. */
  price: number;
  /** "publicado": precio real de Tortuga. Sin definir: valor de ejemplo. */
  priceStatus?: "publicado";
  icon: OptionIcon;
  /** Si se define, el opcional solo aparece en esos modelos (slugs). */
  onlyFor?: string[];
  /** Opcionales del mismo grupo se excluyen entre sí (ej.: tipos de inodoro). */
  group?: string;
  /** Peso que suma al camper, en kg. Sin definir = [A confirmar]. */
  weightKg?: number;
};

/* ------------------------------------------------------------------ */
/* Marca y contacto                                                     */
/* ------------------------------------------------------------------ */

export const site = {
  name: "Tortuga Campers",
  shortName: "Tortuga",
  /** Frase que usan en sus posteos del Discover DC. */
  tagline: "Donde termina el asfalto, empieza la aventura.",
  /** Bio de Instagram. */
  description:
    "Diseñamos y fabricamos campers off road para tu pick up, con materiales ultralivianos de uso náutico y equipamiento Dometic y Victron Energy.",
  /** Cómo define Martín la marca (mensaje directo, noviembre 2026). */
  positioning:
    "Hacemos proyectos especiales y campers fijos o desmontables, solo para pick ups doble o simple cabina, buscando el centro de gravedad óptimo en cada modelo.",
  currency: "USD",

  /**
   * WHATSAPP
   * Número en formato internacional, sin "+", espacios ni guiones.
   * Martín lo pasó como "+54 155 754 1560" (15 + 5754-1560, área 11):
   * en formato wa.me queda 54 9 11 5754 1560. Si queda vacío, los botones
   * abren WhatsApp con el mensaje armado y dejan elegir el contacto.
   */
  whatsapp: "5491157541560",
  /** Cómo se muestra el número impreso. */
  whatsappDisplay: "+54 9 11 5754-1560",

  /** Mail que pasó Martín para consultas. */
  email: "tortugacampersok@gmail.com",

  instagram: {
    url: "https://instagram.com/tortugacampers",
    handle: "@tortugacampers",
    followers: "15 mil",
  },

  /** Geoetiqueta de sus posteos. Dirección de fábrica: [A confirmar]. */
  location: "Buenos Aires, Argentina" as string | Pending,
  address: null as string | Pending,

  /** Publicado en Instagram el 8/10/2026 ("Visitanos próximamente en…"). */
  domain: "tortugacampers.com.ar" as string | Pending,

  /** Crédito de la demo. */
  studio: "Visintin Studio",
  studioUrl: "https://visintinstudio.com.ar",
} as const;

/* ------------------------------------------------------------------ */
/* Imágenes (todas del Instagram de Tortuga: fotos y cuadros de reels)  */
/* ------------------------------------------------------------------ */

const ig = "/images/ig";

const frame = (
  path: string,
  alt: string,
  kind: ImageKind,
  focus?: string,
): SiteImage => ({ src: `${ig}/${path}`, alt, width: 720, height: 1280, kind, focus });

const frame34 = (path: string, alt: string, kind: ImageKind): SiteImage => ({
  src: `${ig}/${path}`,
  alt,
  width: 720,
  height: 960,
  kind,
});

const photo = (path: string, alt: string, kind: ImageKind): SiteImage => ({
  src: `${ig}/${path}`,
  alt,
  width: 1440,
  height: 1920,
  kind,
});

export const images = {
  logo: { src: `${ig}/logo.png`, width: 555, height: 184 },
  logoT: { src: `${ig}/logo-t.png`, width: 216, height: 394 },

  dc: {
    hero: frame(
      "discover-dc/hero.jpg",
      "Camper Discover DC gris montado sobre una Toyota Hilux blanca doble cabina, visto desde abajo.",
      "exterior",
      "50% 35%",
    ),
    perfil: frame(
      "discover-dc/perfil.jpg",
      "Discover DC de perfil sobre una Toyota Hilux: el módulo queda apoyado sobre el eje trasero.",
      "exterior",
      "50% 45%",
    ),
    patas: frame(
      "discover-dc/patas.jpg",
      "Módulo Discover DC desmontado, apoyado sobre sus cuatro patas.",
      "exterior",
      "50% 60%",
    ),
    letras: frame(
      "discover-dc/letras.jpg",
      "Detalle del casco gris de PRFV con la palabra Discover y una ventana lateral.",
      "detalle",
      "40% 40%",
    ),
    trasera: frame(
      "discover-dc/trasera.jpg",
      "Parte trasera del Discover DC con el logo de Tortuga Campers, una bicicleta y dos palas montadas.",
      "detalle",
    ),
    tray: frame(
      "discover-dc/tray.jpg",
      "Toyota Hilux doble cabina con el tray de carga a la vista y el módulo camper al fondo.",
      "exterior",
      "70% 50%",
    ),
    hilux: frame(
      "discover-dc/hilux.jpg",
      "Toyota Hilux con tray de carga en primer plano y el módulo Discover DC sobre sus patas detrás.",
      "exterior",
      "50% 60%",
    ),
    // Carrusel del lanzamiento (Instagram, octubre 2026), en alta resolución.
    exterior: photo(
      "discover-dc/exterior.jpg",
      "Discover DC gris con la palabra Discover montado sobre una Toyota Hilux blanca doble cabina, visto de tres cuartos.",
      "exterior",
    ),
    modulo: photo(
      "discover-dc/modulo.jpg",
      "Módulo Discover DC desmontado, parado sobre sus cuatro patas elevables junto al río.",
      "exterior",
    ),
    interior: photo(
      "discover-dc/interior.jpg",
      "Interior del Discover DC: cama principal al fondo, anafe doble y bacha en primer plano y claraboya en el techo.",
      "interior",
    ),
    comedor: photo(
      "discover-dc/comedor.jpg",
      "Comedor del Discover DC con mesa, asientos tapizados y dos ventanas.",
      "interior",
    ),
    cama: photo(
      "discover-dc/cama.jpg",
      "Cama principal del Discover DC con ventanas a los costados y luces LED en el techo.",
      "interior",
    ),
    camaPrincipal: photo(
      "discover-dc/cama-principal.jpg",
      "Cama principal del Discover DC con alacena superior y ventana.",
      "interior",
    ),
    cocina: photo(
      "discover-dc/cocina.jpg",
      "Cocina del Discover DC: anafe doble, bacha con tabla de madera, monocomando y alacenas.",
      "interior",
    ),
    camaSecundaria: photo(
      "discover-dc/cama-secundaria.jpg",
      "Comedor del Discover DC sin la mesa, con los asientos unidos.",
      "interior",
    ),
    banoPuerta: photo(
      "discover-dc/bano-puerta.jpg",
      "Baño del Discover DC visto desde la puerta: inodoro y calefón de 6 litros.",
      "interior",
    ),
    // Propuesta comercial en PDF que pasó Tortuga.
    frente: {
      src: `${ig}/discover-dc/frente.jpg`,
      alt: "Discover DC montado sobre una Toyota Hilux blanca, visto de frente.",
      width: 1172,
      height: 1758,
      kind: "exterior",
    },
    mesa: frame(
      "discover-dc/mesa.jpg",
      "Mesa del comedor del Discover DC desplegada entre los asientos.",
      "interior",
    ),
    especiero: frame(
      "discover-dc/especiero.jpg",
      "Detalle de la mesada con estante curvo y frascos de especias.",
      "detalle",
    ),
    ventana: frame(
      "discover-dc/ventana.jpg",
      "Ventana del comedor del Discover DC abierta al río.",
      "detalle",
    ),
    bano: photo(
      "discover-dc/bano.jpg",
      "Baño del Discover DC con inodoro, ducha con piso de madera y calefón de 6 litros.",
      "interior",
    ),
    victron: photo(
      "discover-dc/victron.jpg",
      "Regulador solar Victron SmartSolar MPPT 100/30 y cargador Victron Blue Smart instalados en el camper.",
      "detalle",
    ),
  },

  t350: {
    exterior: frame34(
      "t-350/exterior.jpg",
      "Camper T-350 con gráfica de montañas montado sobre una Nissan Frontier blanca.",
      "exterior",
    ),
    trasera: frame34(
      "t-350/trasera.jpg",
      "T-350 visto desde atrás sobre una Nissan Frontier, con la puerta de acceso.",
      "exterior",
    ),
    cabover: frame34(
      "t-350/cabover.jpg",
      "Detalle del frente del T-350 con el logo de Tortuga Campers y una ventana.",
      "detalle",
    ),
    duchador: frame34(
      "t-350/duchador.jpg",
      "Duchador exterior frío-calor del T-350.",
      "detalle",
    ),
    interior: photo(
      "t-350/interior.jpg",
      "Interior del T-350: cama principal, heladera Dometic bajo mesada y mesa del comedor.",
      "interior",
    ),
    cocina: photo(
      "t-350/cocina.jpg",
      "Cocina del T-350 con anafe doble y bacha Dometic y heladera bajo mesada.",
      "interior",
    ),
    heladera: photo(
      "t-350/heladera.jpg",
      "Heladera Dometic de 80 litros del T-350, abierta.",
      "detalle",
    ),
    comedor: photo(
      "t-350/comedor.jpg",
      "Comedor del T-350 con asientos tapizados en gris y ventana.",
      "interior",
    ),
    cama: photo(
      "t-350/cama.jpg",
      "Cama principal del T-350 con tres ventanas y climatizador de techo.",
      "interior",
    ),
    mesa: photo(
      "t-350/mesa.jpg",
      "Mesa del T-350 sobre soporte tipo Lagun, junto a la llave de corte general.",
      "detalle",
    ),
    bano: photo(
      "t-350/bano.jpg",
      "Baño del T-350 con vanitory, calefón de 6 litros e inodoro.",
      "interior",
    ),
  },
} as const;

/* ------------------------------------------------------------------ */
/* Modelos                                                              */
/* ------------------------------------------------------------------ */

export const specLabels: Record<SpecKey, string> = {
  peso: "Peso",
  largo: "Largo",
  ancho: "Ancho",
  alto: "Alto",
  plazas: "Plazas",
  agua: "Agua",
  energia: "Energía",
};

export const models: Model[] = [
  {
    // Fuente: posteo del 6/5/2026 y reel de recorrido del T-350.
    slug: "t-350",
    name: "T-350",
    line: "Línea T",
    status: "disponible",
    statusLabel: "Disponible",
    forWho:
      "Liviano y compacto para pick ups doble cabina: 650 kg, cuatro plazas y baño completo.",
    intro:
      "Pesa solamente 650 kg y lleva el peso sobre el eje trasero. Cocina Dometic, baño con ducha y energía solar Victron, listo para salir.",
    price: {
      amount: 28000,
      status: "publicado",
      note: "Precio publicado en Instagram. Vigencia [A confirmar].",
    },
    hero: images.t350.exterior,
    gallery: [
      images.t350.exterior,
      images.t350.trasera,
      images.t350.interior,
      images.t350.cocina,
      images.t350.comedor,
      images.t350.cama,
      images.t350.bano,
      images.t350.cabover,
      images.t350.heladera,
      images.t350.mesa,
      images.t350.duchador,
    ],
    dryWeightKg: 650,
    specs: {
      peso: "650 kg",
      largo: null,
      ancho: null,
      alto: null,
      plazas: "4 personas",
      agua: "90 L de aguas blancas + 90 L de aguas grises",
      energia: "Panel solar de 380 W + batería de gel de ciclo profundo de 100 Ah",
    },
    extraSpecs: [
      { label: "Cama principal", value: "1,60 × 1,95 m" },
      { label: "Cama secundaria", value: "Comedor convertible" },
      { label: "Ventanas", value: "7, con mosquitero y blackout" },
    ],
    equipment: [
      {
        title: "Cocina",
        items: [
          "Heladera Dometic de 80 litros, 12 V a compresor, con freezer",
          "Anafe doble, bacha y monocomando Dometic con agua fría y caliente",
          "Soporte de mesa tipo Lagun",
          "Garrafa de gas envasado de 3 kg",
        ],
      },
      {
        title: "Baño y agua",
        items: [
          "Ducha y vanitory interior",
          "Inodoro eléctrico Seaflo con tapa amortiguada",
          "Calefón de 6 litros sin llama piloto",
          "Duchador exterior frío-calor",
          "Bomba de agua de 4,5 L/min",
          "Tanque de aguas blancas de 90 L y de aguas grises de 90 L",
        ],
      },
      {
        title: "Descanso",
        items: [
          "Cama principal de 1,60 × 1,95 m",
          "Comedor que se transforma en cama secundaria",
          "Colchones y asientos de alta densidad tapizados en pana lavable",
          "Ventanas S4 de doble acrílico con mosquitero y blackout en el marco",
          "Claraboya LED con extractor, ventilador y mosquitero",
          "Iluminación interior LED",
        ],
      },
      {
        title: "Instalación eléctrica",
        items: [
          "Panel solar de 380 W",
          "Regulador de carga, cargador inteligente y protector de batería Victron Energy",
          "Batería de gel de ciclo profundo de 100 Ah",
          "Instalación de 220 V con entrada exterior, llaves térmicas y disyuntor",
          "Cargador USB doble y puerto para Starlink",
          "Medidor de niveles de tanques y llave de corte general",
        ],
      },
      {
        title: "Exterior",
        items: [
          "4 patas elevables",
          "3 reflectores exteriores LED",
          "Cerradura de puerta con huella digital",
        ],
      },
    ],
    optionsNote: "Disponibilidad de cada opcional en el T-350 [A confirmar].",
    cabins: ["doble"],
    pickups: [
      "Toyota Hilux",
      "Volkswagen Amarok",
      "Ford Ranger",
      "Chevrolet S10",
      "Nissan Frontier",
      "Renault Alaskan",
      "Ford Raptor",
      "RAM",
    ],
  },
  {
    // Sin material ni ficha todavía: todo [A confirmar].
    slug: "t-380",
    name: "T-380",
    line: "Línea T",
    status: "disponible",
    statusLabel: "Disponible",
    forWho: "El otro modelo de la línea T. Medidas, peso y plazas [A confirmar].",
    intro:
      "Mismo método constructivo que toda la línea: casco de PRFV con alma de poliuretano, equipamiento Dometic y energía Victron. Ficha técnica [A confirmar].",
    price: { amount: 30000, status: "ejemplo" },
    hero: null,
    gallery: [],
    dryWeightKg: null,
    specs: {
      peso: null,
      largo: null,
      ancho: null,
      alto: null,
      plazas: null,
      agua: null,
      energia: null,
    },
    extraSpecs: [],
    equipment: [],
    optionsNote: "Disponibilidad de cada opcional en el T-380 [A confirmar].",
    cabins: null,
    pickups: null,
  },
  {
    // Fuente: propuesta comercial "Discover DC — inventario completo" (PDF que
    // pasó Tortuga, noviembre 2026) + posteos y reels del lanzamiento.
    slug: "discover-dc",
    name: "Discover DC",
    line: "Línea Discover",
    status: "lanzamiento",
    statusLabel: "Lanzamiento",
    forWho:
      "Para pick ups doble cabina: va sobre un tray de carga que duplica el volumen de una caja convencional.",
    intro:
      "DC por doble cabina. Un camper técnico de la línea Discover que se acerca a los espacios de un motorhome: cuatro plazas, baño con ducha, 420 W de energía solar y batería de litio.",
    price: {
      amount: 35900,
      status: "publicado",
      note: "Valor de lista con equipamiento de serie. Tray de carga completo: USD 5.200 aparte. Valores + IVA en caso de ser facturados.",
    },
    hero: images.dc.exterior,
    gallery: [
      images.dc.exterior,
      images.dc.frente,
      images.dc.perfil,
      images.dc.modulo,
      images.dc.tray,
      images.dc.interior,
      images.dc.cocina,
      images.dc.cama,
      images.dc.camaPrincipal,
      images.dc.comedor,
      images.dc.camaSecundaria,
      images.dc.bano,
      images.dc.banoPuerta,
      images.dc.victron,
      images.dc.trasera,
    ],
    dryWeightKg: 790,
    specs: {
      peso: "790 kg en seco",
      largo: "3,80 m",
      ancho: "2,00 m (exterior)",
      alto: "3,00 m sobre el vehículo",
      plazas: "4 personas",
      agua: "90 L de aguas blancas + 90 L de aguas grises",
      energia: "Panel solar de 420 W + batería de litio de 100 Ah",
    },
    extraSpecs: [
      { label: "Altura interior", value: "1,95 m" },
      { label: "Cama principal", value: "1,40 × 1,95 m" },
      { label: "Cama secundaria", value: "1,00 × 1,95 m" },
      { label: "Carrocería", value: "Panel sándwich PRFV + poliuretano + PRFV" },
    ],
    equipment: [
      {
        title: "Carrocería",
        items: [
          "Carrocería fabricada íntegramente en panel sándwich (PRFV + PUR + PRFV)",
          "Material importado de alto impacto, con propiedades acústicas, térmicas e ignífugas",
          "Terminaciones exteriores en ángulo L de PRFV y punteras reforzadas",
          "Carpintería premium",
        ],
      },
      {
        title: "Cocina",
        items: [
          "Heladera de 80 litros, 12 V a compresor, con freezer",
          "Anafe doble, bacha y monocomando",
          "Base de mesa elevable",
          "Garrafa de gas envasado de 3 kg",
        ],
      },
      {
        title: "Baño y agua",
        items: [
          "Receptáculo con ducha interior",
          "Inodoro portátil",
          "Calefón de 6 litros sin llama piloto",
          "Bomba de agua de 4,5 L/min",
          "Tanque de aguas blancas de 90 L y de aguas grises de 90 L",
        ],
      },
      {
        title: "Descanso",
        items: [
          "Cama principal de 1,40 × 1,95 m y secundaria de 1,00 × 1,95 m",
          "Colchones y asientos de alta densidad tapizados en pana lavable",
          "Ventanas S4 de doble acrílico con mosquitero y blackout en el marco",
          "Claraboya LED con extractor, ventilador y mosquitero",
          "Iluminación interior LED",
        ],
      },
      {
        title: "Instalación eléctrica",
        items: [
          "Panel solar de 420 W",
          "Regulador de carga y cargador inteligente Victron Energy",
          "Batería de litio de 100 Ah",
          "Instalación de 220 V con entrada exterior, llaves térmicas y disyuntor",
          "Fusileras independientes y llave de corte general",
          "Cargador USB doble y puerto para Starlink",
          "Medidor de niveles de tanques",
        ],
      },
      {
        title: "Exterior",
        items: ["4 patas elevables", "2 reflectores exteriores LED"],
      },
    ],
    cabins: ["doble"],
    pickups: [
      "Toyota Hilux",
      "Volkswagen Amarok",
      "Ford Ranger",
      "Chevrolet S10",
      "Nissan Frontier",
      "Renault Alaskan",
      "Ford Raptor",
    ],
    pickupsNote:
      "En la propuesta del Discover DC figuran Hilux, Amarok, Ranger, S10, Frontier, Alaskan y Raptor, entre otras. Mandanos tu consulta y lo revisamos.",
  },
  {
    slug: "discover-cs",
    name: "Discover CS",
    line: "Línea Discover",
    status: "proximamente",
    statusLabel: "Próximamente",
    forWho: "En desarrollo.",
    intro: "Estamos desarrollando el Discover CS. Dejanos tu WhatsApp y te avisamos cuando salga.",
    price: null,
    hero: null,
    gallery: [],
    dryWeightKg: null,
    specs: {
      peso: null,
      largo: null,
      ancho: null,
      alto: null,
      plazas: null,
      agua: null,
      energia: null,
    },
    extraSpecs: [],
    equipment: [],
    cabins: null,
    pickups: null,
  },
  {
    slug: "discover-cs-raptor",
    name: "Discover CS Raptor",
    line: "Línea Discover",
    status: "proximamente",
    statusLabel: "Próximamente",
    forWho: "En desarrollo.",
    intro:
      "Estamos desarrollando el Discover CS Raptor. Dejanos tu WhatsApp y te avisamos cuando salga.",
    price: null,
    hero: null,
    gallery: [],
    dryWeightKg: null,
    specs: {
      peso: null,
      largo: null,
      ancho: null,
      alto: null,
      plazas: null,
      agua: null,
      energia: null,
    },
    extraSpecs: [],
    equipment: [],
    cabins: null,
    pickups: null,
  },
];

export const availableModels = models.filter((m) => m.status !== "proximamente");
export const upcomingModels = models.filter((m) => m.status === "proximamente");
export const getModel = (slug: string) => models.find((m) => m.slug === slug);

/* ------------------------------------------------------------------ */
/* Las 5 ventajas (tal como las publican) + equipamiento común          */
/* ------------------------------------------------------------------ */

export const advantages: {
  title: string;
  text: string;
  image: SiteImage;
}[] = [
  {
    title: "El peso va sobre el eje trasero",
    text: "La distribución del peso está ubicada sobre el eje trasero del vehículo: mejor manejo y estabilidad, sin necesidad de reforzar la suspensión.",
    image: images.dc.perfil,
  },
  {
    title: "Casco de PRFV con alma de poliuretano",
    text: "Estructura de plástico reforzado con fibra de vidrio con alma de poliuretano: solidez y perfecta aislación térmica, tanto en frío como en calor.",
    image: images.dc.letras,
  },
  {
    title: "Ventanas, heladera, anafe y bacha Dometic",
    text: "Todos esos componentes son marca Dometic, referente mundial en equipamiento de motorhomes y embarcaciones.",
    image: images.t350.cocina,
  },
  {
    title: "Energía solar Victron Energy",
    text: "Instalación eléctrica y energía solar con materiales y accesorios Victron Energy, con garantía de 5 años y monitoreo de la carga a distancia por Bluetooth.",
    image: images.dc.victron,
  },
  {
    title: "Interiores con terminaciones premium",
    text: "Herrajes de cierre suave, cerraduras push lock y cantos ABS de 2 mm en todo el mobiliario.",
    image: images.dc.comedor,
  },
];

/** Lo que es común a todos los modelos (sale de las 5 ventajas). */
export const commonEquipment: string[] = [
  "Casco de PRFV con alma de poliuretano",
  "Peso distribuido sobre el eje trasero",
  "Ventanas, heladera, anafe y bacha Dometic",
  "Instalación eléctrica y solar Victron Energy, con 5 años de garantía",
  "Monitoreo de la carga por Bluetooth",
  "Herrajes de cierre suave, cerraduras push lock y cantos ABS de 2 mm",
];

export const trustStrip: string[] = [
  "PRFV con alma de poliuretano",
  "Dometic",
  "Victron Energy",
  "Fijos o desmontables",
];

/* ------------------------------------------------------------------ */
/* Configurador                                                         */
/* ------------------------------------------------------------------ */

/** Pick ups para el paso 2. Salen de lo que Tortuga publica como compatible. */
export const pickupBrands: { id: string; name: string; models: { id: string; name: string }[] }[] = [
  { id: "toyota", name: "Toyota", models: [{ id: "hilux", name: "Hilux" }] },
  { id: "volkswagen", name: "Volkswagen", models: [{ id: "amarok", name: "Amarok" }] },
  {
    id: "ford",
    name: "Ford",
    models: [
      { id: "ranger", name: "Ranger" },
      { id: "raptor", name: "Raptor" },
    ],
  },
  { id: "chevrolet", name: "Chevrolet", models: [{ id: "s10", name: "S10" }] },
  { id: "nissan", name: "Nissan", models: [{ id: "frontier", name: "Frontier" }] },
  { id: "renault", name: "Renault", models: [{ id: "alaskan", name: "Alaskan" }] },
  { id: "ram", name: "RAM", models: [{ id: "ram", name: "RAM (versión a definir)" }] },
];

export const cabinLabels: Record<Cabin, string> = {
  simple: "Cabina simple",
  doble: "Cabina doble",
};

export const optionCategories: { id: OptionCategoryId; name: string }[] = [
  { id: "pickup", name: "Pick up" },
  { id: "energia", name: "Energía" },
  { id: "confort", name: "Confort" },
  { id: "bano", name: "Baño y agua" },
  { id: "exterior", name: "Exterior" },
];

/**
 * OPCIONALES
 * La lista sale de "Opcionales disponibles" de la propuesta del Discover DC
 * (PDF de Tortuga). Los precios son VALORES DE EJEMPLO, salvo los que
 * tienen `priceStatus: "publicado"`. Cuando estén todos los precios reales,
 * pasar `examplePricing` a `false`.
 */
export const examplePricing = true;

/** Aclaración del paso de opcionales del configurador. */
export const optionsNote =
  "Opcionales de la propuesta del Discover DC. Los precios son valores de ejemplo, salvo el del tray de carga.";

export const options: ConfigOption[] = [
  {
    id: "tray",
    category: "pickup",
    name: "Tray de carga completo",
    description: "La base sobre la que va el módulo: duplica el volumen de una caja convencional.",
    price: 5200,
    priceStatus: "publicado",
    icon: "tray",
    onlyFor: ["discover-dc"],
  },
  {
    id: "suspension-neumatica",
    category: "pickup",
    name: "Suspensión neumática",
    description: "Para la pick up que lleva el camper.",
    price: 1500,
    icon: "suspension",
  },
  {
    id: "bumper",
    category: "pickup",
    name: "Bumper delantero",
    description: "Paragolpes delantero para la pick up.",
    price: 1200,
    icon: "bumper",
  },
  {
    id: "bateria-litio",
    category: "energia",
    name: "Batería extra de litio de 100 Ah",
    description: "Más autonomía para quedarte más días sin enchufe.",
    price: 1100,
    icon: "bateria",
  },
  {
    id: "inversor-victron",
    category: "energia",
    name: "Inversor de 2000 W Victron Energy",
    description: "Para usar equipos de 220 V desde la batería.",
    price: 1300,
    icon: "inversor",
    group: "inversor",
  },
  {
    id: "inversor-importado",
    category: "energia",
    name: "Inversor de 2000 W importado",
    description: "La alternativa al inversor Victron.",
    price: 500,
    icon: "inversor",
    group: "inversor",
  },
  {
    id: "starlink",
    category: "energia",
    name: "Instalación estanca para Starlink",
    description: "Deja todo listo para conectar la antena. No incluye la antena.",
    price: 250,
    icon: "starlink",
  },
  {
    id: "aire-acondicionado",
    category: "confort",
    name: "Aire acondicionado de techo 12 V",
    description: "Para dormir fresco en pleno verano.",
    price: 1800,
    icon: "clima",
  },
  {
    id: "climatizador",
    category: "confort",
    name: "Climatizador con reservorio interno 12 V",
    description: "Refresca el ambiente con el agua de su reservorio.",
    price: 900,
    icon: "climatizador",
  },
  {
    id: "calefactor",
    category: "confort",
    name: "Calefactor a gasoil de 2 kW",
    description: "Calienta el interior con el motor apagado.",
    price: 950,
    icon: "calefaccion",
  },
  {
    id: "tv",
    category: "confort",
    name: "TV LED Smart 12 V con brazo móvil",
    description: "Para ver una película desde la cama o el comedor.",
    price: 450,
    icon: "tv",
  },
  {
    id: "inodoro-seco",
    category: "bano",
    name: "Inodoro seco",
    description: "Reemplaza al inodoro de serie.",
    price: 600,
    icon: "inodoro",
    group: "inodoro",
  },
  {
    id: "inodoro-nautico",
    category: "bano",
    name: "Inodoro náutico con triturador",
    description: "Reemplaza al inodoro de serie.",
    price: 700,
    icon: "inodoro",
    group: "inodoro",
  },
  {
    id: "inodoro-casette",
    category: "bano",
    name: "Inodoro a casette",
    description: "Reemplaza al inodoro de serie.",
    price: 650,
    icon: "inodoro",
    group: "inodoro",
  },
  {
    // El T-350 ya lo trae de serie.
    id: "duchador",
    category: "bano",
    name: "Duchador exterior frío-calor",
    description: "Ducha por fuera del camper, con agua fría y caliente.",
    price: 200,
    icon: "ducha",
    onlyFor: ["t-380", "discover-dc"],
  },
  {
    id: "toldo",
    category: "exterior",
    name: "Toldo lateral manual",
    description: "3,5 m de ancho por 2,5 m de salida.",
    price: 750,
    icon: "toldo",
  },
  {
    id: "gabinete",
    category: "exterior",
    name: "Gabinete metálico exterior de guardado",
    description: "Lugar extra por fuera para herramientas y equipo.",
    price: 400,
    icon: "gabinete",
  },
  {
    id: "portaequipaje",
    category: "exterior",
    name: "Portaequipaje sobre panel solar",
    description: "Carga arriba sin perder el panel.",
    price: 500,
    icon: "rack",
  },
  {
    id: "patas-electricas",
    category: "exterior",
    name: "Patas eléctricas 12 V",
    description: "Patas elevables con accionamiento eléctrico.",
    price: 2000,
    icon: "patas",
  },
];

/** Opcionales disponibles para un modelo. */
export const optionsFor = (slug: string) =>
  options.filter((o) => !o.onlyFor || o.onlyFor.includes(slug));

/** Los 3 opcionales del configurador simplificado del home. */
export const homeConfigurator = {
  optionIds: ["toldo", "bateria-litio", "calefactor"],
};

export const provinces = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
  "Fuera de Argentina",
];

export const timeframes = [
  "Lo antes posible",
  "En 1 a 3 meses",
  "En 3 a 6 meses",
  "Más adelante",
  "Todavía estoy averiguando",
];

/* ------------------------------------------------------------------ */
/* Home: comparativa, proceso, en ruta, FAQ                             */
/* ------------------------------------------------------------------ */

/** Filas de la comparativa. Cada valor sigue el orden de `availableModels`. */
export const comparison: { label: string; values: (string | Pending)[] }[] = [
  { label: "Pick up", values: ["Doble cabina", null, "Doble cabina"] },
  { label: "Peso", values: ["650 kg", null, "790 kg en seco"] },
  { label: "Plazas", values: ["4", null, "4"] },
  { label: "Cama principal", values: ["1,60 × 1,95 m", null, "1,40 × 1,95 m"] },
  { label: "Cama secundaria", values: ["Comedor convertible", null, "1,00 × 1,95 m"] },
  { label: "Agua", values: ["90 L + 90 L grises", null, "90 L + 90 L grises"] },
  { label: "Panel solar", values: ["380 W", null, "420 W"] },
  { label: "Batería", values: ["Gel, 100 Ah", null, "Litio, 100 Ah"] },
];

export const workSteps: { title: string; text: string; time: string | Pending }[] = [
  {
    title: "Elegís y configurás",
    text: "Elegís el modelo para tu pick up y le sumás los opcionales que quieras. Ves el número en el momento.",
    time: "5 minutos, desde el celular",
  },
  {
    title: "Presupuesto",
    text: "Nos mandás tu configuración por WhatsApp. La revisamos con vos y te pasamos el presupuesto final.",
    time: null,
  },
  {
    title: "Fabricación",
    text: "Fabricamos tu camper: casco de PRFV, carpintería, instalación eléctrica y equipamiento.",
    time: null,
  },
  {
    title: "Montaje y entrega",
    text: "Lo montamos sobre tu pick up, lo probamos con vos y salís andando.",
    time: null,
  },
];

export const onTheRoad = {
  title: "Tortuga en ruta",
  text: "Eventos, unidades entregadas y el día a día de la fábrica están en nuestro Instagram.",
  items: [
    {
      title: "Expo Rodantear 2026",
      text: "Recorrimos la expo y pasamos por el stand de Verzet para ver lo último en tecnología suiza para el baño del camper.",
      // En su posteo del 24/10/2026 aclaran que este año no fueron expositores oficiales.
      pending: "Ediciones en las que Tortuga expuso [A confirmar].",
    },
    {
      title: "Discover DC, el lanzamiento",
      text: "El nuevo modelo se presentó montado sobre una Toyota Hilux con tray de carga.",
      pending: null,
    },
  ],
  images: [images.dc.trasera, images.dc.hilux, images.t350.trasera, images.dc.modulo],
};

export type FaqTopic = "pickup" | "camper" | "compra";

export const faqTopics: { id: FaqTopic; name: string }[] = [
  { id: "pickup", name: "Tu pick up" },
  { id: "camper", name: "El camper" },
  { id: "compra", name: "Compra y entrega" },
];

export const faq: { q: string; a: string; topic: FaqTopic; pending?: string }[] = [
  {
    q: "¿Sirve para mi pick up?",
    topic: "pickup",
    a: "Hacemos campers fijos o desmontables solo para pick ups, doble o simple cabina, y buscamos el centro de gravedad óptimo en cada modelo. Se montan en las más comunes: Toyota Hilux, Volkswagen Amarok, Ford Ranger, Chevrolet S10, Nissan Frontier, Renault Alaskan, Raptor y RAM, entre otras. Si la tuya no está en la lista, escribinos con marca, modelo y cabina y te decimos qué modelo le va.",
  },
  {
    q: "¿Hay que modificar la suspensión?",
    topic: "pickup",
    a: "No. El peso del camper va ubicado sobre el eje trasero del vehículo, y eso mejora el manejo y la estabilidad sin necesidad de reforzar la suspensión. El T-350, por ejemplo, pesa 650 kg.",
    pending: "Recomendaciones según la capacidad de carga de cada pick up [A confirmar].",
  },
  {
    q: "¿Necesito papeles o registro especial?",
    topic: "compra",
    a: "Es una consulta legal que depende de la normativa de tránsito y de tu jurisdicción, así que preferimos no darte una respuesta a medias.",
    pending: "Respuesta [A confirmar] con Tortuga antes de publicarla.",
  },
  {
    q: "¿Se puede desmontar?",
    topic: "pickup",
    a: "Sí. El camper tiene cuatro patas elevables: lo bajás de la pick up, queda apoyado sobre sus patas y la camioneta vuelve a ser tu vehículo de todos los días.",
    pending: "Tiempo de montaje y desmontaje [A confirmar].",
  },
  {
    q: "¿Qué trae de serie?",
    topic: "camper",
    a: "El T-350 y el Discover DC traen heladera de 80 litros a compresor, anafe doble con bacha, baño con ducha, calefón de 6 litros, tanques de 90 L de aguas blancas y grises, panel solar con equipos Victron Energy, instalación de 220 V y cuatro patas elevables. El detalle completo está en la página de cada modelo.",
    pending: "Equipamiento del T-380 [A confirmar].",
  },
  {
    q: "¿De qué está hecho?",
    topic: "camper",
    a: "El casco es de PRFV (plástico reforzado con fibra de vidrio) con alma de poliuretano: liviano, sólido y con aislación térmica para el frío y el calor. En el Discover DC la carrocería es íntegramente de panel sándwich PRFV + poliuretano + PRFV, con propiedades acústicas, térmicas e ignífugas.",
  },
  {
    q: "¿Cómo funciona la energía y el monitoreo Victron?",
    topic: "camper",
    a: "El panel solar carga la batería durante el día a través de un regulador Victron Energy, y también podés enchufar el camper a 220 V. Regulador, cargador inteligente y protector de batería son Victron: tienen 5 años de garantía y se monitorean por Bluetooth desde el celular.",
  },
  {
    q: "¿Qué garantía tiene?",
    topic: "compra",
    a: "Todos los componentes Victron Energy tienen 5 años de garantía.",
    pending: "Garantía del casco, la carpintería y el resto del equipamiento [A confirmar].",
  },
  {
    q: "¿Cuáles son los plazos de entrega?",
    topic: "compra",
    a: "Depende del modelo y de cómo lo configures. A veces hay unidades disponibles para entrega inmediata: escribinos y te decimos qué hay hoy.",
    pending: "Plazo de fabricación [A confirmar].",
  },
  {
    q: "¿Cuáles son las formas de pago?",
    topic: "compra",
    a: "Los precios se publican en dólares. En el Discover DC, los valores son más IVA en caso de ser facturados.",
    pending: "Medios de pago, seña y financiación [A confirmar].",
  },
];

/** Modelos agrupados por línea, en el orden en que aparecen en `models`. */
export const modelLines: { name: string; models: Model[] }[] = models.reduce<
  { name: string; models: Model[] }[]
>((acc, m) => {
  const group = acc.find((g) => g.name === m.line);
  if (group) group.models.push(m);
  else acc.push({ name: m.line, models: [m] });
  return acc;
}, []);

/** Bajada de cada línea en el home. */
export const lineIntros: Record<string, string> = {
  "Línea T":
    "Campers livianos y compactos para pick ups doble cabina, con el peso sobre el eje trasero. El T-350 pesa 650 kg con cuatro plazas y baño completo.",
  "Línea Discover":
    "Campers técnicos que se acercan a los espacios de un motorhome. El Discover DC va sobre un tray de carga; el CS y el CS Raptor están en desarrollo.",
};

/**
 * UNIDADES ENTREGADAS Y TESTIMONIOS — [A confirmar]
 * Estructura lista para cargar lo que pase Tortuga: foto de la unidad,
 * modelo, pick up, lugar y testimonio con permiso del cliente.
 * Mientras un dato esté en `null`, la interfaz lo muestra como pendiente.
 * Nunca cargar testimonios que no sean reales.
 */
export type Delivery = {
  model: string | Pending;
  pickup: string | Pending;
  place: string | Pending;
  quote: string | Pending;
  client: string | Pending;
  image: SiteImage | Pending;
};

export const deliveries: { title: string; text: string; items: Delivery[] } = {
  title: "Clientes en ruta",
  text: "Unidades entregadas y lo que cuentan quienes ya viajan con su Tortuga.",
  items: [
    { model: "T-350", pickup: null, place: null, quote: null, client: null, image: null },
    { model: "Discover DC", pickup: null, place: null, quote: null, client: null, image: null },
    { model: null, pickup: null, place: null, quote: null, client: null, image: null },
  ],
};
