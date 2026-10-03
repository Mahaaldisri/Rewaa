import type {
  City,
  DescriptionBlock,
  PaymentMethod,
  Product,
  ProductQuestion,
  RelatedProduct,
  Review,
  ServicePlan,
  Variant,
} from "@/types/product";
import { buildImages, photo } from "./images";

/* ------------------------------------------------------------------ */
/* Helpers — dates are relative to "now" so the countdown always runs  */
/* ------------------------------------------------------------------ */
const hoursFromNow = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

/* ------------------------------------------------------------------ */
/* Option groups (generic engine: swatch = housing colour, chip = size)*/
/* ------------------------------------------------------------------ */
const FINISHES = [
  { id: "pearl-white", value: "pearl-white", label: "أبيض لؤلؤي", swatch: "linear-gradient(135deg,#ffffff,#dfe7ef)", note: "الأكثر طلبًا" },
  { id: "ocean-blue", value: "ocean-blue", label: "أزرق محيطي", swatch: "linear-gradient(135deg,#38b5ea,#16306b)" },
  { id: "graphite", value: "graphite", label: "أسود جرافيت", swatch: "linear-gradient(135deg,#3c4e67,#091426)" },
  { id: "steel", value: "steel", label: "ستانلس ستيل", swatch: "linear-gradient(135deg,#e7edf3,#8da4bb)", note: "هيكل معدني" },
] as const;

const STAGES = [
  { id: "s5", value: "5", label: "5 مراحل" },
  { id: "s7", value: "7", label: "7 مراحل", note: "موصى به" },
  { id: "s9", value: "9", label: "9 مراحل + UV" },
  { id: "s12", value: "12", label: "فلتر مباشر 600G", note: "بدون خزان" },
] as const;

const STAGE_BASE: Record<string, { price: number; compareAt: number; weight: number; gpd: number }> = {
  s5: { price: 890, compareAt: 1150, weight: 9800, gpd: 75 },
  s7: { price: 1290, compareAt: 1690, weight: 11200, gpd: 100 },
  s9: { price: 1790, compareAt: 2290, weight: 12600, gpd: 100 },
  s12: { price: 2450, compareAt: 2990, weight: 10400, gpd: 600 },
};

const FINISH_DELTA: Record<string, number> = {
  "pearl-white": 0,
  "ocean-blue": 60,
  graphite: 90,
  steel: 240,
};

/** Per-combination inventory overrides — everything else is generated. */
const OVERRIDES: Record<string, Partial<Variant>> = {
  "pearl-white|s7": { stock: 4 },
  "pearl-white|s12": { stock: 0, status: "out_of_stock" },
  "ocean-blue|s5": { stock: 0, status: "out_of_stock" },
  "ocean-blue|s9": { stock: 26 },
  "graphite|s7": { stock: 3 },
  "graphite|s12": { stock: 0, status: "coming_soon", availableAt: hoursFromNow(24 * 11) },
  "steel|s5": { stock: 0, status: "out_of_stock" },
  "steel|s7": { stock: 2 },
  "steel|s12": { stock: 0, status: "coming_soon", availableAt: hoursFromNow(24 * 24) },
};

/* ------------------------------------------------------------------ */
/* Gallery — images are tagged with the finish they belong to          */
/* ------------------------------------------------------------------ */
const FINISH_IMAGES: Record<string, string[]> = {
  "pearl-white": ["img-1", "img-2", "img-3"],
  "ocean-blue": ["img-4", "img-5"],
  graphite: ["img-3", "img-6"],
  steel: ["img-5", "img-6"],
};

function buildVariants(): Variant[] {
  const variants: Variant[] = [];
  for (const finish of FINISHES) {
    for (const stage of STAGES) {
      const key = `${finish.id}|${stage.id}`;
      const base = STAGE_BASE[stage.id];
      const price = base.price + FINISH_DELTA[finish.id];
      const override = OVERRIDES[key] ?? {};
      const stock = override.stock ?? 9 + ((price * 3) % 34);
      const status =
        override.status ?? (stock === 0 ? "out_of_stock" : stock <= 5 ? "low_stock" : "in_stock");

      variants.push({
        id: `var-${finish.id}-${stage.id}`,
        sku: `RWA-RO${stage.value}-${finish.value.slice(0, 3).toUpperCase()}`,
        barcode: `6281${String(price).padStart(6, "0")}${variants.length}`,
        selection: { finish: finish.id, stages: stage.id },
        price,
        compareAtPrice: base.compareAt + FINISH_DELTA[finish.id],
        costCurrency: "SAR",
        stock,
        lowStockThreshold: 5,
        status,
        weightGrams: base.weight,
        imageIds: FINISH_IMAGES[finish.id],
        ...override,
      });
    }
  }
  return variants;
}

const images = buildImages([
  { id: 36847822, alt: "نظام تنقية مياه رواء برو مركّب بالكامل بمراحله السبع", ratio: "landscape", optionIds: ["pearl-white"] },
  { id: 27176108, alt: "تعبئة زجاجة مياه من حنفية الفلتر في مطبخ منزلي", ratio: "landscape", optionIds: ["pearl-white"] },
  { id: 7533891, alt: "حنفية الفلتر المستقلة مثبّتة بجانب حوض المطبخ", ratio: "landscape", optionIds: ["pearl-white", "graphite"] },
  { id: 6857798, alt: "صب مياه مفلترة صافية في كوب زجاجي", ratio: "landscape", optionIds: ["ocean-blue"] },
  { id: 6853442, alt: "مياه نقية بعد المرور على مراحل التنقية", ratio: "landscape", optionIds: ["ocean-blue", "steel"] },
  { id: 6419128, alt: "فني رواء المعتمد أثناء تركيب وصلات النظام", ratio: "landscape", optionIds: ["graphite", "steel"] },
  { id: 29226620, alt: "ربط خط التغذية ومحبس الأمان أثناء التركيب", ratio: "landscape", optionIds: ["shared"] },
  { id: 16509869, alt: "صيانة دورية وتغيير الشمعات بأدوات متخصصة", ratio: "landscape", optionIds: ["shared"] },
  { id: 12142829, alt: "تفاصيل وصلات وأنابيب النظام عالية الجودة", ratio: "portrait", optionIds: ["shared"] },
  { id: 7653312, alt: "عائلة تشرب مياهًا مفلترة بأمان في المنزل", ratio: "landscape", optionIds: ["shared"] },
  { id: 34938442, alt: "فحص ضغط التشغيل والتأكد من عدم وجود تسريب", ratio: "landscape", optionIds: ["shared"] },
]);

/* ------------------------------------------------------------------ */
/* Description blocks                                                  */
/* ------------------------------------------------------------------ */
const description: DescriptionBlock[] = [
  {
    id: "story",
    title: "نظرة عامة على النظام",
    body: [
      "رواء برو RO-7 نظام تنقية مياه منزلي يعمل بتقنية التناضح العكسي (Reverse Osmosis) بسبع مراحل، صُمّم خصيصًا لطبيعة المياه في المملكة حيث ترتفع نسبة الأملاح الذائبة الكلية (TDS) والعسر. يخفّض النظام نسبة الأملاح بما يصل إلى 98% ويزيل الكلور والرواسب والمعادن الثقيلة والروائح، ثم يعيد إضافة المعادن المفيدة عبر مرحلة الحجر الصحي والميناء ليعطي مذاقًا متوازنًا وليس «مسطحًا».",
      "يُركّب النظام أسفل حوض المطبخ مع حنفية مستقلة أنيقة، ويعمل بضغط الشبكة مع مضخة تعزيز عند الحاجة. التركيب يتم بواسطة فنيي رواء المعتمدين ويشمل فحص جودة المياه قبل وبعد التركيب وتسليم تقرير قياس TDS موثّق.",
    ],
  },
  {
    id: "stages",
    title: "مراحل التنقية السبع",
    bullets: [
      "المرحلة 1: شمعة رواسب بولي بروبيلين 5 ميكرون — تحجز الرمل والصدأ والعوالق",
      "المرحلة 2: كربون حبيبي GAC — يزيل الكلور والروائح والطعم غير المستساغ",
      "المرحلة 3: كربون مضغوط CTO — يحمي الممبرين من بقايا الكلور",
      "المرحلة 4: ممبرين RO 100 جالون/يوم — يفصل حتى 98% من الأملاح الذائبة",
      "المرحلة 5: فلتر كربون ما بعد المعالجة T33 — تلميع نهائي للمذاق",
      "المرحلة 6: مرحلة المعادن (Mineral) — إعادة الكالسيوم والمغنيسيوم",
      "المرحلة 7: الحجر الصحي والقلوي — رفع درجة الحموضة pH إلى المستوى المتوازن",
    ],
  },
  {
    id: "why",
    title: "لماذا تختاره؟",
    bullets: [
      "خفض TDS حتى 98% — مع تقرير قياس قبل وبعد التركيب",
      "ممبرين منشأ أمريكي/كوري معتمد وقابل للاستبدال محليًا",
      "تركيب مجاني بواسطة فني معتمد خلال 48 ساعة من الطلب",
      "شمعات قياسية 10 إنش متوفرة دائمًا — لا ارتباط بمقاس احتكاري",
      "محبس أمان وحسّاس تسريب يقطع المياه تلقائيًا عند حدوث خلل",
      "استهلاك كهرباء منخفض، ويعمل بدون كهرباء في طرازات الضغط المباشر",
      "تذكير تلقائي بموعد تغيير الشمعات عبر رسالة نصية",
    ],
  },
  {
    id: "box",
    title: "محتويات العبوة",
    bullets: [
      "وحدة التنقية كاملة بالمراحل المختارة",
      "خزان ضغط 12 لتر مع محبس الخزان (عدا الطرازات المباشرة)",
      "حنفية مياه مستقلة بتصميم مطابق للّون المختار",
      "مضخة تعزيز ومحوّل كهربائي 24 فولت",
      "طقم وصلات وأنابيب 1/4 إنش ومحبس تغذية وخط صرف",
      "جهاز قياس TDS رقمي (هدية ضمن العرض الحالي)",
      "دليل التشغيل العربي وبطاقة الضمان وجدول مواعيد الصيانة",
    ],
  },
  {
    id: "usage",
    title: "التركيب والتشغيل",
    bullets: [
      "يُركّب أسفل حوض المطبخ — المساحة المطلوبة 40 × 25 × 50 سم تقريبًا",
      "يُفضّل وجود مخرج كهرباء قريب للطرازات المزوّدة بمضخة",
      "عند التشغيل الأول يُصرَف خزان كامل ثم يُعاد تعبئته",
      "اضبط ضغط الخزان على 0.5 بار عند الخزان الفارغ",
      "راجع قراءة TDS شهريًا — ارتفاعها فوق 50 ppm يعني قرب انتهاء الممبرين",
    ],
    tone: "info",
  },
  {
    id: "warnings",
    title: "تحذيرات وملاحظات مهمة",
    bullets: [
      "لا يُستخدم مع مياه ملوّثة ميكروبيولوجيًا دون مرحلة التعقيم UV",
      "أوقف التغذية وافصل الكهرباء قبل أي عملية صيانة أو تغيير شمعات",
      "لا تترك النظام متوقفًا أكثر من أسبوعين دون تصريف الخزان",
      "التركيب الذاتي أو عبر فني غير معتمد يُسقط الضمان",
      "يُحفظ بعيدًا عن أشعة الشمس المباشرة ودرجات الحرارة فوق 45°",
    ],
    tone: "warning",
  },
];

/* ------------------------------------------------------------------ */
/* Installation & maintenance plans (sales + service business)         */
/* ------------------------------------------------------------------ */
const servicePlans: ServicePlan[] = [
  {
    id: "plan-basic",
    name: "تركيب أساسي",
    price: 0,
    badge: "مجاني",
    durationMonths: 0,
    highlights: [
      "زيارة فني معتمد وتركيب كامل",
      "فحص TDS قبل وبعد التركيب",
      "ضمان التركيب 90 يومًا",
    ],
  },
  {
    id: "plan-care",
    name: "باقة العناية — سنة",
    price: 390,
    badge: "الأكثر اختيارًا",
    durationMonths: 12,
    recommended: true,
    highlights: [
      "كل مزايا التركيب الأساسي",
      "زيارتا صيانة دورية خلال السنة",
      "تغيير شمعات المراحل 1–3 مجانًا",
      "أولوية في مواعيد البلاغات",
    ],
  },
  {
    id: "plan-total",
    name: "باقة شاملة — سنتان",
    price: 690,
    durationMonths: 24,
    highlights: [
      "كل مزايا باقة العناية لمدة سنتين",
      "تغيير الممبرين مرة واحدة مجانًا",
      "زيارات طوارئ غير محدودة",
      "تمديد الضمان إلى 4 سنوات",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Shipping configuration (Saudi market)                               */
/* ------------------------------------------------------------------ */
const cities: City[] = [
  { id: "riyadh", name: "الرياض", region: "منطقة الرياض", standardEta: [1, 2], expressEta: [1, 1], sameDayAvailable: true },
  { id: "jeddah", name: "جدة", region: "منطقة مكة المكرمة", standardEta: [1, 3], expressEta: [1, 1], sameDayAvailable: true },
  { id: "dammam", name: "الدمام", region: "المنطقة الشرقية", standardEta: [2, 3], expressEta: [1, 2], sameDayAvailable: true },
  { id: "khobar", name: "الخبر", region: "المنطقة الشرقية", standardEta: [2, 3], expressEta: [1, 2], sameDayAvailable: false },
  { id: "makkah", name: "مكة المكرمة", region: "منطقة مكة المكرمة", standardEta: [2, 4], expressEta: [1, 2], sameDayAvailable: false },
  { id: "madinah", name: "المدينة المنورة", region: "منطقة المدينة المنورة", standardEta: [2, 4], expressEta: [1, 2], sameDayAvailable: false },
  { id: "buraidah", name: "بريدة", region: "منطقة القصيم", standardEta: [2, 4], expressEta: [2, 3], sameDayAvailable: false },
  { id: "taif", name: "الطائف", region: "منطقة مكة المكرمة", standardEta: [3, 5], expressEta: [2, 3], sameDayAvailable: false },
  { id: "abha", name: "أبها", region: "منطقة عسير", standardEta: [3, 5], expressEta: [2, 3], sameDayAvailable: false },
  { id: "tabuk", name: "تبوك", region: "منطقة تبوك", standardEta: [3, 5], expressEta: [2, 4], sameDayAvailable: false },
  { id: "hail", name: "حائل", region: "منطقة حائل", standardEta: [3, 5], expressEta: [2, 4], sameDayAvailable: false },
  { id: "jazan", name: "جازان", region: "منطقة جازان", standardEta: [4, 6], expressEta: [2, 4], sameDayAvailable: false },
];

const paymentMethods: PaymentMethod[] = [
  { id: "mada", name: "mada", nameAr: "مدى", kind: "card", enabled: true, note: "الدفع المحلي الأسرع" },
  { id: "visa", name: "Visa", nameAr: "فيزا", kind: "card", enabled: true },
  { id: "mastercard", name: "Mastercard", nameAr: "ماستركارد", kind: "card", enabled: true },
  { id: "amex", name: "American Express", nameAr: "أمريكان إكسبريس", kind: "card", enabled: true },
  { id: "applepay", name: "Apple Pay", nameAr: "آبل باي", kind: "wallet", enabled: true, note: "دفع بلمسة واحدة" },
  { id: "googlepay", name: "Google Pay", nameAr: "جوجل باي", kind: "wallet", enabled: true },
  { id: "stcpay", name: "stc pay", nameAr: "إس تي سي باي", kind: "wallet", enabled: true },
  { id: "tabby", name: "Tabby", nameAr: "تابي", kind: "bnpl", enabled: true, note: "قسّمها على 4" },
  { id: "tamara", name: "Tamara", nameAr: "تمارا", kind: "bnpl", enabled: true, note: "قسّمها على 3" },
  { id: "cod", name: "Cash on Delivery", nameAr: "الدفع عند الاستلام", kind: "cod", enabled: true, note: "رسوم 20 ر.س" },
  { id: "bank", name: "Bank Transfer", nameAr: "تحويل بنكي", kind: "bank", enabled: true, note: "للمنشآت والفواتير الضريبية" },
];

/* ------------------------------------------------------------------ */
/* The product object — single source of truth for the whole page      */
/* ------------------------------------------------------------------ */
export const mockProduct: Product = {
  id: "prd_ro7_84c21",
  sku: "RWA-RO7-PEA",
  name: "نظام تنقية مياه رواء برو – 7 مراحل بتقنية التناضح العكسي",
  nameEn: "Rewaa Pro RO-7 Reverse Osmosis Water Purification System",
  slug: "water-filters/rewaa-pro-ro7",
  brand: "رواء برو",
  brandSlug: "rewaa-pro",
  shortDescription:
    "نظام RO منزلي بسبع مراحل يخفّض الأملاح الذائبة حتى 98% ويعيد إضافة المعادن المفيدة. يشمل التركيب المجاني بواسطة فني معتمد وتقرير قياس TDS قبل وبعد التركيب.",
  description,
  category: { id: "cat-water", name: "فلاتر ومعالجة المياه", slug: "water-filters" },
  subcategory: { id: "cat-ro", name: "أنظمة التناضح العكسي", slug: "ro-systems" },
  breadcrumbs: [
    { label: "الرئيسية", href: "/" },
    { label: "فلاتر ومعالجة المياه", href: "/c/water-filters" },
    { label: "أنظمة التناضح العكسي", href: "/c/water-filters/ro-systems" },
    { label: "رواء برو", href: "/b/rewaa-pro" },
    { label: "رواء برو RO-7", href: "/p/water-filters/rewaa-pro-ro7" },
  ],
  price: 1290,
  compareAtPrice: 1690,
  currency: "SAR",
  vatPercent: 15,
  costPrice: 640,
  images,
  optionGroups: [
    {
      id: "finish",
      name: "لون الهيكل والحنفية",
      type: "swatch",
      hint: "يغيّر صور المنتج ولون الحنفية",
      options: FINISHES.map((f) => ({ ...f })),
    },
    {
      id: "stages",
      name: "عدد مراحل التنقية",
      type: "chip",
      hint: "الأسعار شاملة الضريبة والتركيب",
      options: STAGES.map((s) => ({ ...s })),
    },
  ],
  variants: buildVariants(),
  defaultVariantId: "var-pearl-white-s7",
  rating: 4.7,
  reviewCount: 968,
  ratingBreakdown: { 5: 652, 4: 212, 3: 61, 2: 26, 1: 17 },
  soldCount: 5240,
  badges: [
    { id: "b-install", label: "تركيب مجاني", tone: "brand", icon: "package" },
    { id: "b-bestseller", label: "الأكثر مبيعًا", tone: "aqua", icon: "flame" },
    { id: "b-sale", label: "عرض خاص", tone: "danger", icon: "tag" },
    { id: "b-warranty", label: "ضمان 3 سنوات", tone: "success", icon: "shield" },
  ],
  promotions: [
    {
      id: "promo-flash",
      type: "flash_sale",
      title: "حملة المياه النقية",
      description: "خصم 24% على طراز الـ 7 مراحل مع تركيب مجاني — ينتهي قريبًا",
      value: 24,
      endsAt: hoursFromNow(29.4),
      tone: "danger",
      highlight: true,
      terms: ["يسري على الطرازات المتوفرة فقط", "التركيب داخل نطاق المدن المخدومة"],
    },
    {
      id: "promo-coupon",
      type: "coupon",
      title: "كوبون إضافي 100 ر.س",
      description: "استخدم الكود عند إتمام الطلب للطلبات فوق 900 ر.س",
      code: "REWAA100",
      value: 100,
      endsAt: hoursFromNow(96),
      tone: "brand",
      terms: ["مرة واحدة لكل عميل", "يُطبَّق بعد خصم العرض الحالي"],
    },
    {
      id: "promo-gift",
      type: "free_gift",
      title: "جهاز قياس TDS رقمي مجانًا",
      description: "لقياس جودة المياه بنفسك قبل وبعد الفلتر — قيمته 95 ر.س",
      tone: "aqua",
    },
    {
      id: "promo-service",
      type: "buy_x_get_y",
      title: "أول زيارة صيانة مجانية",
      description: "زيارة فحص وتنظيف بعد 6 أشهر من التركيب دون رسوم",
      tone: "aqua",
    },
    {
      id: "promo-shipping",
      type: "free_shipping",
      title: "شحن وتركيب مجاني",
      description: "على جميع الطلبات التي تتجاوز 500 ر.س داخل المدن المخدومة",
      value: 500,
      tone: "brand",
    },
    {
      id: "promo-bundle",
      type: "bundle",
      title: "طقم الشمعات السنوي — وفّر 120 ر.س",
      description: "أضف طقم الشمعات البديلة من قسم «اشترِ معه» بسعر مخفّض",
      value: 120,
      tone: "brand",
    },
    {
      id: "promo-multibuy",
      type: "multi_buy",
      title: "خصم المشاريع: 2 أو أكثر بخصم 12%",
      description: "للفلل والمكاتب والمنشآت — يُطبَّق تلقائيًا في السلة",
      value: 12,
      tone: "aqua",
    },
    {
      id: "promo-expired",
      type: "percentage",
      title: "عرض اليوم الوطني",
      description: "انتهى هذا العرض",
      value: 35,
      startsAt: daysAgo(40),
      endsAt: daysAgo(12),
      tone: "brand",
    },
  ],
  servicePlans,
  shipping: {
    freeShippingThreshold: 500,
    flatRate: 29,
    expressRate: 59,
    carriers: [
      { id: "rewaa-tech", name: "فرق رواء الفنية", kind: "standard", price: 0, etaLabel: "توصيل وتركيب خلال 1–3 أيام" },
      { id: "smsa", name: "سمسا إكسبرس", kind: "standard", price: 29, etaLabel: "2–4 أيام عمل" },
      { id: "naqel", name: "ناقل إكسبرس", kind: "express", price: 59, etaLabel: "24 ساعة للمدن الرئيسية" },
      { id: "rewaa-same-day", name: "تركيب رواء الفوري", kind: "same_day", price: 99, etaLabel: "خلال 6 ساعات" },
    ],
    cities,
    branches: [
      { id: "br-rkd", city: "الرياض", name: "رواء – طريق الملك عبدالله", address: "طريق الملك عبدالله، حي المغرزات", hours: "8 ص – 10 م", stock: 14, distanceKm: 3.4 },
      { id: "br-exit9", city: "الرياض", name: "رواء – مخرج 9 الصناعية", address: "طريق الدمام، المنطقة الصناعية الثانية", hours: "8 ص – 8 م", stock: 6, distanceKm: 11.2 },
      { id: "br-jdr", city: "جدة", name: "رواء – طريق الأمير سلطان", address: "طريق الأمير سلطان، حي الزهراء", hours: "9 ص – 11 م", stock: 0, distanceKm: 12.6 },
      { id: "br-dmm", city: "الدمام", name: "رواء – الدمام", address: "شارع الملك فهد، حي الفيصلية", hours: "9 ص – 10 م", stock: 5, distanceKm: 7.8 },
    ],
    international: false,
    note: "التركيب المجاني يشمل المدن المخدومة؛ خارجها تُحتسب رسوم انتقال الفني حسب المسافة. أيام العمل من السبت إلى الخميس.",
  },
  paymentMethods,
  installmentProviders: [
    { id: "tabby", name: "Tabby", nameAr: "تابي", installments: 4, apr: 0, minAmount: 100, maxAmount: 10000, feePercent: 0, accent: "#22b573" },
    { id: "tamara", name: "Tamara", nameAr: "تمارا", installments: 3, apr: 0, minAmount: 150, maxAmount: 10000, feePercent: 0, accent: "#22a9e0" },
    { id: "rewaa-split", name: "REWAA Split", nameAr: "تقسيط رواء", installments: 6, apr: 0, minAmount: 900, maxAmount: 40000, feePercent: 2.5, accent: "#16306b" },
  ],
  specifications: [
    { label: "العلامة التجارية", value: "رواء برو (Rewaa Pro)", group: "عام" },
    { label: "رقم الموديل", value: "RWA-RO7-2026", group: "عام" },
    { label: "نوع النظام", value: "تناضح عكسي RO تحت الحوض", group: "عام" },
    { label: "الاستخدام", value: "منزلي / مكاتب حتى 8 أفراد", group: "عام" },
    { label: "بلد التجميع", value: "المملكة العربية السعودية", group: "عام" },
    { label: "عدد المراحل", value: "7 مراحل", group: "الأداء" },
    { label: "إنتاجية الممبرين", value: "100 جالون / يوم (≈ 378 لتر)", group: "الأداء" },
    { label: "نسبة إزالة الأملاح", value: "حتى 98% من TDS", group: "الأداء" },
    { label: "مخرجات TDS التقديرية", value: "من 450 ppm إلى أقل من 25 ppm", group: "الأداء" },
    { label: "درجة الحموضة بعد المعالجة", value: "pH 7.2 – 7.8", group: "الأداء" },
    { label: "ضغط التشغيل", value: "0.3 – 4 بار (مع مضخة تعزيز)", group: "التشغيل" },
    { label: "درجة حرارة المياه", value: "5° – 45° مئوية", group: "التشغيل" },
    { label: "الكهرباء", value: "100–240 فولت / 24 فولت DC", group: "التشغيل" },
    { label: "استهلاك الطاقة", value: "24 واط", group: "التشغيل" },
    { label: "نسبة مياه الصرف", value: "1 : 2 تقريبًا", group: "التشغيل" },
    { label: "سعة الخزان", value: "12 لتر (3.2 جالون) معدني مبطّن", group: "المكونات" },
    { label: "مقاس الشمعات", value: "قياسي 10 إنش — متوفر محليًا", group: "المكونات" },
    { label: "مادة الهيكل", value: "ABS غذائي مقاوم للصدمات", group: "المكونات" },
    { label: "أبعاد الوحدة", value: "38 × 22 × 46 سم", group: "المكونات" },
    { label: "الوزن", value: "11.2 كجم (فارغ)", group: "المكونات" },
    { label: "اعتمادات الجودة", value: "مطابقة لمواصفة SASO ومعايير NSF للمواد", group: "الضمان" },
    { label: "الضمان", value: "36 شهرًا على الوحدة والمضخة", group: "الضمان" },
    { label: "دورة تغيير الشمعات", value: "المراحل 1–3 كل 6 أشهر · الممبرين كل 24 شهرًا", group: "الضمان" },
  ],
  seller: {
    id: "slr-rewaa",
    name: "مؤسسة رواء لتقنيات المياه",
    rating: 4.9,
    ordersFulfilled: 36480,
    responseTime: "خلال 30 دقيقة",
    verified: true,
    since: "2015",
  },
  tags: ["فلتر مياه", "تناضح عكسي", "RO", "تنقية مياه", "تركيب فلاتر", "صيانة فلاتر"],
  releasedAt: daysAgo(150),
  warranty: {
    months: 36,
    provider: "مؤسسة رواء — الوكيل والمركز المعتمد",
    summary:
      "ضمان 36 شهرًا على الوحدة والمضخة والخزان ضد عيوب الصناعة، مع قطع غيار أصلية ومركز صيانة في 4 مدن.",
  },
  returns: {
    days: 14,
    summary: "إرجاع خلال 14 يومًا للوحدات غير المركّبة وبحالتها الأصلية، أو استبدال فوري عند وجود عيب صناعة.",
    conditions: [
      "أن تكون الوحدة غير مركّبة وبكامل ملحقاتها وتغليفها الأصلي",
      "إرفاق رقم الطلب والفاتورة الضريبية",
      "الوحدات المركّبة تخضع للاستبدال أو الإصلاح وليس للإرجاع النقدي",
      "تُستثنى الشمعات والممبرين المفتوحة لأسباب صحية",
      "يُرد المبلغ خلال 3–7 أيام عمل إلى وسيلة الدفع الأصلية",
    ],
  },
  meta: {
    title: "فلتر مياه رواء برو RO-7 | 7 مراحل مع تركيب مجاني – رواء",
    description:
      "نظام تنقية مياه منزلي 7 مراحل بتقنية التناضح العكسي، يخفّض الأملاح حتى 98%. تركيب مجاني بفني معتمد، ضمان 3 سنوات، وعقود صيانة سنوية في جميع مدن السعودية.",
    canonical: "https://www.rewaa.sa/ar/water-filters/rewaa-pro-ro7",
    keywords: ["فلتر مياه", "فلتر 7 مراحل", "تناضح عكسي", "تركيب فلاتر مياه", "صيانة فلاتر", "السعودية"],
  },
};

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */
export const mockReviews: Review[] = [
  {
    id: "rev-1",
    productId: mockProduct.id,
    author: "عبدالله الحربي",
    avatarHue: 212,
    city: "الرياض",
    rating: 5,
    title: "قراءة TDS نزلت من 620 إلى 21",
    body: "مياه البيت عندنا كانت عسرة ومالحة. الفني جاء في اليوم التالي للطلب وركّب الجهاز خلال ساعتين وترك كل شيء نظيفًا. قاس الـ TDS قبل التركيب 620 وبعده 21 وأعطاني ورقة موثّقة بالقراءتين. طعم الماء صار ممتازًا وزوجتي لاحظت الفرق في طعم الشاي والقهوة.",
    createdAt: daysAgo(4),
    verifiedPurchase: true,
    variantLabel: "أبيض لؤلؤي • 7 مراحل",
    images: [photo(36847822, 480, 480), photo(6419128, 480, 480)],
    helpfulCount: 73,
    sellerReply: {
      body: "شكرًا لك أ. عبدالله 💧 سعداء بالنتيجة، وسنراسلك بتذكير تغيير الشمعات بعد 6 أشهر ضمن باقة العناية.",
      createdAt: daysAgo(3),
    },
  },
  {
    id: "rev-2",
    productId: mockProduct.id,
    author: "نورة العتيبي",
    avatarHue: 190,
    city: "جدة",
    rating: 5,
    title: "وفّرنا شراء قوارير المياه نهائيًا",
    body: "كنا نشتري كراتين مياه أسبوعيًا. بعد تركيب الفلتر توقفنا تمامًا، والتكلفة استرجعناها خلال أقل من سنة. الحنفية شكلها أنيق وما خربت منظر المطبخ، والصوت أثناء التعبئة خفيف جدًا.",
    createdAt: daysAgo(10),
    verifiedPurchase: true,
    variantLabel: "أزرق محيطي • 9 مراحل + UV",
    helpfulCount: 44,
  },
  {
    id: "rev-3",
    productId: mockProduct.id,
    author: "محمد الشهري",
    avatarHue: 150,
    city: "أبها",
    rating: 4,
    title: "ممتاز لكن الصرف أعلى مما توقعت",
    body: "الجهاز شغّال بكفاءة والمياه نظيفة. الملاحظة الوحيدة أن نسبة مياه الصرف ملحوظة، والفني شرح لي أنها طبيعية في أنظمة RO ووجّهني لاستخدام خط الصرف لري الحديقة. أربع نجوم فقط بسبب هذه النقطة وليست عيبًا في المنتج.",
    createdAt: daysAgo(18),
    verifiedPurchase: true,
    variantLabel: "أبيض لؤلؤي • 7 مراحل",
    helpfulCount: 29,
  },
  {
    id: "rev-4",
    productId: mockProduct.id,
    author: "سارة القحطاني",
    avatarHue: 265,
    city: "الدمام",
    rating: 5,
    title: "خدمة الصيانة هي الفرق الحقيقي",
    body: "اشتريت باقة العناية السنوية ولا أندم. اتصلت لما لاحظت ضعف في التدفق، وجاء الفني في نفس اليوم واكتشف أن الفلتر الأول متسخ بسبب أعمال الشبكة في الحي، غيّره بدون أي رسوم. التعامل محترف جدًا.",
    createdAt: daysAgo(26),
    verifiedPurchase: true,
    variantLabel: "ستانلس ستيل • 7 مراحل",
    images: [photo(16509869, 480, 480)],
    helpfulCount: 51,
  },
  {
    id: "rev-5",
    productId: mockProduct.id,
    author: "فهد الدوسري",
    avatarHue: 24,
    city: "الرياض",
    rating: 3,
    title: "جيد لكن يحتاج مساحة أكبر مما هو مذكور",
    body: "الوحدة والخزان أخذا مساحة كبيرة تحت الحوض، واضطر الفني لنقل بعض الأغراض. لو كان لديك خزانة صغيرة أنصح بطراز الفلتر المباشر بدون خزان. الأداء نفسه ممتاز.",
    createdAt: daysAgo(35),
    verifiedPurchase: true,
    variantLabel: "أسود جرافيت • 7 مراحل",
    helpfulCount: 22,
  },
  {
    id: "rev-6",
    productId: mockProduct.id,
    author: "ريم الزهراني",
    avatarHue: 330,
    city: "المدينة المنورة",
    rating: 5,
    title: "تركيب نظيف وشرح وافٍ",
    body: "الفني شرح لي طريقة الاستخدام وكيف أقرأ جهاز الـ TDS وسجّل لي مواعيد الصيانة في التطبيق. حتى أنه نظّف مكان العمل قبل أن يغادر. تجربة تستحق التقدير.",
    createdAt: daysAgo(48),
    verifiedPurchase: true,
    variantLabel: "أبيض لؤلؤي • 5 مراحل",
    images: [photo(29226620, 480, 480), photo(7533891, 480, 480)],
    helpfulCount: 38,
  },
  {
    id: "rev-7",
    productId: mockProduct.id,
    author: "خالد المطيري",
    avatarHue: 8,
    city: "تبوك",
    rating: 2,
    title: "تأخر موعد التركيب يومين",
    body: "المنتج ممتاز لكن موعد التركيب تأجل يومين عن الوعد لأن تبوك خارج نطاق الفرق المباشرة. خدمة العملاء اعتذرت وأعطتني زيارة صيانة إضافية مجانية، وهذا تصرف جيد لكن التأخير أزعجني.",
    createdAt: daysAgo(59),
    verifiedPurchase: true,
    variantLabel: "أبيض لؤلؤي • 7 مراحل",
    helpfulCount: 12,
    sellerReply: {
      body: "نعتذر أ. خالد عن التأخير، تم توسيع تغطية فرق تبوك هذا الشهر وأصبح موعد التركيب خلال 72 ساعة كحد أقصى.",
      createdAt: daysAgo(57),
    },
  },
  {
    id: "rev-8",
    productId: mockProduct.id,
    author: "لمى البقمي",
    avatarHue: 96,
    city: "بريدة",
    rating: 4,
    title: "سعر منافس مقابل المواصفات",
    body: "قارنت بين ثلاث علامات بنفس المواصفات وكان الفرق أن رواء تشمل التركيب والضمان لثلاث سنوات. الشمعات متوفرة محليًا وهذه نقطة مهمة جدًا تجنّبك الارتباط بمقاسات احتكارية.",
    createdAt: daysAgo(72),
    verifiedPurchase: true,
    variantLabel: "أزرق محيطي • 7 مراحل",
    helpfulCount: 26,
  },
];

/* ------------------------------------------------------------------ */
/* Customer questions                                                  */
/* ------------------------------------------------------------------ */
export const mockQuestions: ProductQuestion[] = [
  {
    id: "q-1",
    productId: mockProduct.id,
    author: "سلطان",
    city: "الرياض",
    question: "هل يحتاج الجهاز إلى كهرباء؟ وكم يستهلك شهريًا؟",
    createdAt: daysAgo(5),
    helpfulCount: 19,
    answer: {
      body: "نعم، طرازات 7 و9 مراحل مزوّدة بمضخة تعزيز تعمل على 24 فولت باستهلاك 24 واط فقط — أقل من 3 ريالات شهريًا تقريبًا. أما طراز الفلتر المباشر 600G فيعمل بضغط الشبكة في المناطق ذات الضغط المرتفع.",
      answeredBy: "الدعم الفني – رواء",
      createdAt: daysAgo(4),
    },
  },
  {
    id: "q-2",
    productId: mockProduct.id,
    author: "أمل",
    city: "جدة",
    question: "كم تكلفة تغيير الشمعات سنويًا؟ وهل أستطيع تغييرها بنفسي؟",
    createdAt: daysAgo(9),
    helpfulCount: 24,
    answer: {
      body: "طقم شمعات المراحل 1–3 بسعر 145 ر.س ويُغيَّر كل 6 أشهر، والممبرين 260 ر.س كل سنتين تقريبًا. يمكنك تغييرها بنفسك بمفتاح الشمعات المرفق، لكن ننصح بزيارة الفني ضمن باقة العناية للحفاظ على الضمان وضبط الضغط.",
      answeredBy: "الدعم الفني – رواء",
      createdAt: daysAgo(8),
    },
  },
  {
    id: "q-3",
    productId: mockProduct.id,
    author: "ماجد",
    city: "الدمام",
    question: "مياه الحي عندنا TDS حوالي 1100، هل 7 مراحل تكفي أم أحتاج مرحلة إضافية؟",
    createdAt: daysAgo(14),
    helpfulCount: 16,
    answer: {
      body: "نعم تكفي؛ الممبرين يتعامل مع المياه حتى 2000 ppm. لكن مع TDS فوق 1000 ننصح بتغيير شمعة الرواسب كل 4 أشهر بدل 6، ويفضّل إضافة فلتر مُليّن قبلي إذا كان العسر مرتفعًا — يمكن لفني الزيارة تقييم ذلك مجانًا.",
      answeredBy: "م. تركي – قسم الهندسة",
      createdAt: daysAgo(13),
    },
  },
  {
    id: "q-4",
    productId: mockProduct.id,
    author: "هند",
    question: "هل التركيب يشمل الحفر في الرخام لتثبيت الحنفية؟",
    createdAt: daysAgo(21),
    helpfulCount: 11,
    answer: {
      body: "نعم، يشمل الحفر في الاستانلس أو الجرانيت القياسي بدون رسوم إضافية. في حال كان السطح رخامًا طبيعيًا سميكًا أو كوريان فتُحتسب رسوم 80 ر.س لأدوات الحفر المخصصة، ويُبلغك الفني قبل البدء.",
      answeredBy: "خدمة العملاء – رواء",
      createdAt: daysAgo(20),
    },
  },
  {
    id: "q-5",
    productId: mockProduct.id,
    author: "تركي",
    city: "حائل",
    question: "هل يوجد طراز مناسب لمطعم صغير بإنتاجية أعلى؟",
    createdAt: daysAgo(2),
    helpfulCount: 9,
    answer: {
      body: "نعم، طراز الفلتر المباشر 600G ضمن نفس الصفحة مناسب للاستخدام التجاري الخفيف، ولدينا أنظمة 1500G و3000G في قسم «مشاريع تجارية وصناعية» مع عقود صيانة مخصصة وفاتورة ضريبية.",
      answeredBy: "قسم المبيعات المؤسسية",
      createdAt: daysAgo(1),
    },
  },
  {
    id: "q-6",
    productId: mockProduct.id,
    author: "عمر",
    city: "مكة المكرمة",
    question: "لو انتقلت لمنزل جديد، هل تنقلون الجهاز؟",
    createdAt: daysAgo(30),
    helpfulCount: 7,
  },
];

/* ------------------------------------------------------------------ */
/* Related rails                                                       */
/* ------------------------------------------------------------------ */
export const mockRelated: RelatedProduct[] = [
  { id: "rel-1", name: "طقم شمعات بديلة 3 مراحل – 10 إنش", brand: "رواء برو", slug: "cartridge-set-3", price: 145, compareAtPrice: 190, rating: 4.8, reviewCount: 612, image: photo(12142829), inStock: true, group: "similar", badge: { label: "الأكثر مبيعًا", tone: "aqua" } },
  { id: "rel-2", name: "ممبرين RO أصلي 100 جالون/يوم", brand: "Vontron", slug: "ro-membrane-100", price: 260, compareAtPrice: 320, rating: 4.9, reviewCount: 284, image: photo(29248902), inStock: true, group: "similar", badge: { label: "قطعة أصلية", tone: "success" } },
  { id: "rel-3", name: "فلتر دش مضاد للكلور والترسبات", brand: "رواء هوم", slug: "shower-filter", price: 189, compareAtPrice: 240, rating: 4.5, reviewCount: 196, image: photo(34950223), inStock: true, group: "similar" },
  { id: "rel-4", name: "نظام تنقية 9 مراحل + معقّم UV", brand: "رواء برو", slug: "rewaa-pro-ro9-uv", price: 1790, compareAtPrice: 2290, rating: 4.8, reviewCount: 173, image: photo(36847822), inStock: true, group: "similar", badge: { label: "خصم 22%", tone: "danger" } },
  { id: "rel-5", name: "جهاز قياس جودة المياه TDS رقمي", brand: "AquaCheck", slug: "tds-meter", price: 95, compareAtPrice: 130, rating: 4.6, reviewCount: 430, image: photo(6857798), inStock: true, group: "bought_together", badge: { label: "هدية مع العرض", tone: "success" } },
  { id: "rel-6", name: "مضخة تعزيز ضغط 24 فولت", brand: "رواء برو", slug: "booster-pump-24v", price: 215, rating: 4.7, reviewCount: 148, image: photo(34938442), inStock: true, group: "bought_together" },
  { id: "rel-7", name: "حسّاس تسريب مع محبس إغلاق تلقائي", brand: "رواء برو", slug: "leak-stop-valve", price: 135, compareAtPrice: 165, rating: 4.4, reviewCount: 88, image: photo(16509869), inStock: true, group: "bought_together" },
  { id: "rel-8", name: "خزان ضغط معدني 12 لتر", brand: "رواء برو", slug: "pressure-tank-12l", price: 230, rating: 4.6, reviewCount: 102, image: photo(8488035), inStock: false, group: "bought_together" },
  { id: "rel-9", name: "فلتر مركزي للمنزل 20 إنش", brand: "رواء برو", slug: "whole-house-20", price: 980, compareAtPrice: 1240, rating: 4.7, reviewCount: 119, image: photo(16442684), inStock: true, group: "recently_viewed" },
  { id: "rel-10", name: "مُليّن مياه أوتوماتيكي 2 قدم", brand: "AquaSoft", slug: "water-softener-2ft", price: 2890, rating: 4.5, reviewCount: 64, image: photo(29226620), inStock: true, group: "recently_viewed" },
  { id: "rel-11", name: "براد وسخّان مياه مكتبي بفلتر", brand: "رواء هوم", slug: "office-dispenser", price: 1450, compareAtPrice: 1790, rating: 4.4, reviewCount: 77, image: photo(27176108), inStock: true, group: "recently_viewed", badge: { label: "جديد", tone: "success" } },
];
