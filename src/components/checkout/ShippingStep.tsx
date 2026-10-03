import type { Address } from "@/types/auth";
import type { ShippingMethodId } from "@/types/order";
import { mockProduct } from "@/data/mockProduct";
import { estimateDelivery } from "@/lib/product-logic";
import { formatDate, formatMoney } from "@/lib/format";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

const { shipping } = mockProduct;

const METHODS: { id: ShippingMethodId; label: string; icon: IconName; hint: string }[] = [
  { id: "standard", label: "شحن قياسي", icon: "truck", hint: "الخيار الأكثر اقتصادًا" },
  { id: "express", label: "شحن سريع", icon: "bolt", hint: "أولوية في التجهيز والتوصيل" },
  { id: "same_day", label: "توصيل في نفس اليوم", icon: "package", hint: "للرياض وجدة والدمام فقط" },
  { id: "pickup", label: "استلام من المعرض", icon: "store", hint: "بدون رسوم شحن" },
];

interface Props {
  address: Address;
  orderValue: number;
  selected: ShippingMethodId;
  onSelect: (id: ShippingMethodId, cost: number, label: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function ShippingStep({ address, orderValue, selected, onSelect, onBack, onContinue }: Props) {
  const city = shipping.cities.find((c) => c.id === address.cityId) ?? shipping.cities[0];
  const branches = shipping.branches.filter((b) => b.city === address.cityName);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-lg bg-ink-50 px-3.5 py-2.5 text-[12px] text-ink-600">
        <Icon name="mapPin" size={14} className="text-ink-400" />
        التوصيل إلى: <strong className="text-ink-900">{address.district}، {city.name}</strong>
      </div>

      <div className="space-y-2.5" role="radiogroup" aria-label="طريقة الشحن">
        {METHODS.map((method) => {
          const blocked =
            (method.id === "same_day" && !city.sameDayAvailable) ||
            (method.id === "pickup" && branches.length === 0);
          const estimate = estimateDelivery(city, shipping, method.id, orderValue);
          const isSelected = selected === method.id;

          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={blocked}
              onClick={() => onSelect(method.id, estimate.cost, method.label)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-4 text-start transition",
                isSelected ? "border-brand-600 bg-brand-50/50 shadow-hair" : "border-ink-100 bg-surface hover:border-ink-300",
                blocked && "cursor-not-allowed opacity-50"
              )}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
                  isSelected ? "bg-brand-700 text-white" : "bg-ink-50 text-ink-500"
                )}
              >
                <Icon name={method.icon} size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[13px] font-bold text-ink-900">{method.label}</span>
                  <span className="text-[13px] font-extrabold tabular-nums text-ink-900">
                    {blocked ? "—" : estimate.cost === 0 ? "مجاني" : formatMoney(estimate.cost)}
                  </span>
                </span>
                <span className="mt-0.5 block text-[11.5px] text-ink-500">
                  {blocked ? "غير متاح لهذا العنوان" : method.hint}
                </span>
                {!blocked && method.id !== "pickup" && (
                  <span className="mt-1 block text-[11px] font-medium text-brand-700">
                    التسليم المتوقع: {formatDate(estimate.from.toISOString())} – {formatDate(estimate.to.toISOString())}
                  </span>
                )}
                {!blocked && method.id === "pickup" && branches[0] && (
                  <span className="mt-1 block text-[11px] text-ink-500">{branches[0].name} — {branches[0].address}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-12 items-center gap-2 rounded-lg border border-ink-200 bg-surface px-5 text-[13px] font-semibold text-ink-700 transition hover:bg-ink-50"
        >
          <Icon name="arrowRight" size={16} />
          رجوع
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-700 font-display text-[14px] font-extrabold text-white shadow-brand transition hover:bg-brand-800 active:scale-[0.98]"
        >
          متابعة إلى الدفع
          <Icon name="arrowLeft" size={16} />
        </button>
      </div>
    </div>
  );
}
