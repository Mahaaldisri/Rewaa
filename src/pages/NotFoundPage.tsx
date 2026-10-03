import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/brand/Logo";

/**
 * Friendly fallback for any route that isn't implemented yet.
 * Used both as the catch-all 404 and for in-progress storefront sections
 * (category listings, help centre, etc.) so no link in the app ever dead-ends
 * on a blank browser error page.
 */
export function NotFoundPage() {
  return (
    <div className="bg-ambient">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-fine opacity-[0.35]" aria-hidden="true" />
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid size-20 place-items-center rounded-2xl bg-surface p-4 shadow-lift ring-1 ring-ink-100">
          <LogoMark className="size-full" />
        </span>

        <h1 className="mt-6 font-display text-2xl font-extrabold text-ink-950 sm:text-3xl">
          هذه الصفحة قيد الإنشاء
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-6 text-ink-500">
          فريق رواء يعمل على إضافة هذا القسم قريبًا. يمكنك في الوقت الحالي استكشاف نظام تنقية المياه رواء برو
          أو العودة إلى الصفحة الرئيسية لمتابعة التسوق.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-700 px-5 font-display text-[13.5px] font-bold text-white shadow-brand transition hover:bg-brand-800 active:scale-[0.98]"
          >
            <Icon name="chevronRight" size={16} />
            العودة للرئيسية
          </Link>
          <Link
            to="/p/water-filters/rewaa-pro-ro7"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-ink-200 bg-surface px-5 text-[13px] font-semibold text-ink-700 transition hover:bg-ink-50"
          >
            تصفّح نظام RO-7
          </Link>
        </div>

        <a
          href="tel:920001234"
          className="mt-8 inline-flex items-center gap-1.5 text-[12px] text-ink-400 transition hover:text-brand-700"
        >
          <Icon name="headset" size={13} />
          تحتاج مساعدة؟ تواصل مع الدعم الفني على 920001234
        </a>
      </div>
    </div>
  );
}
