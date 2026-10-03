import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { RelatedProduct } from "@/types/product";
import { mockProduct, mockRelated } from "@/data/mockProduct";
import { productApi } from "@/services/api";
import { useStore } from "@/store/StoreProvider";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ProductRail } from "@/components/product/ProductCard";
import { PaymentGlyphs } from "@/components/product/PaymentMethods";
import { Skeleton } from "@/components/ui/primitives";

const CATEGORIES: { label: string; icon: IconName; href: string; tint: string }[] = [
  { label: "أنظمة التناضح العكسي", icon: "droplet", href: "/p/water-filters/rewaa-pro-ro7", tint: "bg-aqua-50 text-aqua-700" },
  { label: "الشمعات وقطع الغيار", icon: "layers", href: "/c/cartridges", tint: "bg-flow-50 text-flow-700" },
  { label: "أجهزة التحلية", icon: "package", href: "/c/desalination", tint: "bg-brand-50 text-brand-700" },
  { label: "المضخات والمعدات", icon: "bolt", href: "/c/pumps-equipment", tint: "bg-warning-soft text-warning" },
  { label: "فلاتر مركزية للمنزل", icon: "store", href: "/c/whole-house", tint: "bg-aqua-50 text-aqua-700" },
  { label: "خدمات الصيانة", icon: "headset", href: "/services/maintenance", tint: "bg-flow-50 text-flow-700" },
];

const STEPS: { icon: IconName; title: string; body: string }[] = [
  { icon: "search", title: "اختر نظامك", body: "حدد عدد المراحل واللون المناسب لمطبخك من بين 16 تشكيلة." },
  { icon: "headset", title: "احجز موعد التركيب", body: "فني معتمد يصلك خلال 48 ساعة في المدن المخدومة." },
  { icon: "droplet", title: "استمتع بمياه نقية", body: "تقرير قياس TDS موثّق قبل وبعد التركيب مباشرة." },
  { icon: "rotate", title: "صيانة دورية", body: "تذكير تلقائي وزيارات ضمن باقة العناية السنوية." },
];

export function HomePage() {
  const { addToCart } = useStore();
  const [featured, setFeatured] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    productApi
      .listRelated(mockProduct.id)
      .then((items) => {
        if (active) setFeatured(items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleQuickAdd = (item: RelatedProduct) => {
    void addToCart({
      productId: item.id,
      variantId: item.id,
      sku: item.slug.toUpperCase(),
      name: item.name,
      selectionLabel: item.brand,
      unitPrice: item.price,
      quantity: 1,
      image: item.image,
    });
  };

  return (
    <div className="bg-ambient">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-fine opacity-[0.3]" aria-hidden="true" />

      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="container-x pt-6 sm:pt-10">
        <div className="relative overflow-hidden rounded-2xl bg-ink-950 shadow-pop">
          <img
            src="/images/hero-kitchen.jpg"
            alt="مطبخ عصري مزوّد بنظام تنقية مياه رواء"
            className="absolute inset-0 size-full object-cover opacity-60"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-ink-950 via-ink-950/80 to-ink-950/20" />
          <div className="relative grid gap-8 px-5 py-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:py-20">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5 text-[11.5px] font-bold text-aqua-300 ring-1 ring-inset ring-white/15">
                <Icon name="bolt" size={13} filled />
                خصم 24% لفترة محدودة
              </span>
              <h1 className="mt-4 font-display text-[28px] font-extrabold leading-tight text-white text-balance sm:text-[38px]">
                مياه نقية 100% في منزلك، مع تركيب وصيانة بأيدٍ معتمدة
              </h1>
              <p className="mt-3 max-w-md text-[13.5px] leading-6 text-ink-300">
                أنظمة تناضح عكسي بـ 5 إلى 9 مراحل، تخفّض الأملاح الذائبة حتى 98%. تركيب مجاني، ضمان 3 سنوات،
                وفنيون سعوديون معتمدون في الرياض وجدة والدمام وأكثر.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link
                  to="/p/water-filters/rewaa-pro-ro7"
                  className="inline-flex h-12 items-center gap-2 rounded-lg bg-aqua-500 px-5 font-display text-[14px] font-extrabold text-ink-950 shadow-brand transition hover:bg-aqua-400 active:scale-[0.98]"
                >
                  تسوّق الآن
                  <Icon name="arrowLeft" size={17} />
                </Link>
                <a
                  href="tel:920001234"
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  <Icon name="headset" size={16} />
                  920001234
                </a>
              </div>

              <dl className="mt-8 grid max-w-md grid-cols-3 gap-3 border-t border-white/10 pt-5">
                <div>
                  <dt className="sr-only">عدد العملاء</dt>
                  <dd className="font-display text-xl font-extrabold text-white">+36,000</dd>
                  <p className="mt-0.5 text-[11px] text-ink-400">عميل راضٍ</p>
                </div>
                <div>
                  <dt className="sr-only">نسبة التنقية</dt>
                  <dd className="font-display text-xl font-extrabold text-white">98%</dd>
                  <p className="mt-0.5 text-[11px] text-ink-400">خفض الأملاح</p>
                </div>
                <div>
                  <dt className="sr-only">الضمان</dt>
                  <dd className="font-display text-xl font-extrabold text-white">3 سنوات</dd>
                  <p className="mt-0.5 text-[11px] text-ink-400">ضمان شامل</p>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------- Categories -------------------------------- */}
      <section className="container-x mt-10 sm:mt-14">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              to={cat.href}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-ink-100 bg-surface p-4 text-center shadow-hair transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
            >
              <span className={`grid size-12 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${cat.tint}`}>
                <Icon name={cat.icon} size={22} />
              </span>
              <span className="text-[12px] font-bold leading-4 text-ink-800">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* --------------------------------- Featured --------------------------------- */}
      <section className="container-x mt-12 sm:mt-16">
        {loading ? (
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-[210px] shrink-0 rounded-xl sm:w-[248px]" />
            ))}
          </div>
        ) : (
          <ProductRail
            eyebrow="الأكثر طلبًا"
            title="منتجات مختارة لك"
            subtitle="أنظمة وقطع غيار اختارها آلاف العملاء هذا الشهر."
            items={featured.length ? featured : mockRelated}
            onAdd={handleQuickAdd}
            id="rail-home-featured"
          />
        )}
      </section>

      {/* ----------------------------- How it works --------------------------------- */}
      <section className="container-x mt-14 sm:mt-20">
        <div className="mb-6 text-center">
          <p className="mb-1.5 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.16em] text-aqua-600">
            <span className="h-px w-6 bg-aqua-400" />
            كيف تحصل على مياه نقية
            <span className="h-px w-6 bg-aqua-400" />
          </p>
          <h2 className="font-display text-xl font-extrabold text-ink-950 sm:text-[26px]">رحلتك مع رواء في 4 خطوات</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative rounded-xl border border-ink-100 bg-surface p-5 shadow-hair">
              <span className="absolute -top-3 start-5 grid size-7 place-items-center rounded-full bg-ink-950 font-display text-[12px] font-bold text-aqua-300">
                {i + 1}
              </span>
              <span className="grid size-11 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <Icon name={step.icon} size={20} />
              </span>
              <h3 className="mt-3 font-display text-[14px] font-bold text-ink-900">{step.title}</h3>
              <p className="mt-1.5 text-[12.5px] leading-5 text-ink-500">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ Services banner ------------------------------ */}
      <section className="container-x mt-14 sm:mt-20">
        <div className="relative overflow-hidden rounded-2xl bg-ink-950 shadow-lift">
          <img
            src="/images/hero-technician.jpg"
            alt="فني رواء المعتمد أثناء تركيب نظام تنقية مياه"
            className="absolute inset-0 size-full object-cover opacity-50"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-ink-950/95 via-ink-950/70 to-transparent" />
          <div className="relative grid gap-6 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-flow-500/20 px-2.5 py-1 text-[11px] font-bold text-flow-300 ring-1 ring-inset ring-flow-500/30">
                باقات الصيانة
              </span>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-white text-balance">
                لا تنتظر حتى تضعف المياه — فعّل باقة العناية السنوية
              </h2>
              <p className="mt-2 max-w-lg text-[13px] leading-6 text-ink-300">
                زيارتان دوريتان، تغيير شمعات مجاني، وأولوية في البلاغات الطارئة — بدءًا من 390 ر.س سنويًا فقط.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 lg:justify-end">
              <Link
                to="/services/book"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-aqua-500 px-5 font-display text-[13.5px] font-extrabold text-ink-950 transition hover:bg-aqua-400"
              >
                <Icon name="headset" size={16} />
                احجز فني الآن
              </Link>
              <Link
                to="/p/water-filters/rewaa-pro-ro7"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                تفاصيل الباقات
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------- Trust row --------------------------------- */}
      <section className="container-x my-14 sm:my-20">
        <div className="grid gap-3 rounded-2xl border border-ink-100 bg-surface p-6 shadow-hair sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "package" as const, title: "تركيب مجاني", body: "بفني معتمد خلال 48 ساعة" },
            { icon: "shield" as const, title: "ضمان 3 سنوات", body: "على الوحدة والمضخة والخزان" },
            { icon: "card" as const, title: "دفع مرن وآمن", body: "مدى، آبل باي، تابي وتمارا" },
            { icon: "rotate" as const, title: "إرجاع خلال 14 يومًا", body: "بدون أسئلة معقّدة" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-aqua-50 text-aqua-700">
                <Icon name={item.icon} size={18} />
              </span>
              <div>
                <p className="font-display text-[13.5px] font-bold text-ink-900">{item.title}</p>
                <p className="mt-0.5 text-[11.5px] leading-4 text-ink-500">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-100 bg-surface p-4">
          <p className="text-[12px] font-semibold text-ink-600">وسائل دفع موثوقة ومعتمدة في السعودية</p>
          <PaymentGlyphs />
        </div>
      </section>
    </div>
  );
}
