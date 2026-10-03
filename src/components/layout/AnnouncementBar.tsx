import { Icon, type IconName } from "@/components/ui/Icon";

const ITEMS: { icon: IconName; text: string }[] = [
  { icon: "package", text: "تركيب مجاني داخل الرياض وجدة والدمام" },
  { icon: "shield", text: "ضمان 3 سنوات على النظام وقطع أصلية 100%" },
  { icon: "headset", text: "فنيون معتمدون — زيارة صيانة خلال 24 ساعة" },
  { icon: "card", text: "قسّمها على 4 دفعات بدون فوائد مع تابي وتمارا" },
  { icon: "truck", text: "شحن مجاني للطلبات فوق 500 ر.س لكل مدن المملكة" },
  { icon: "rotate", text: "عقود صيانة سنوية تشمل تغيير الشمعات" },
];

/** Infinite marquee of store-wide value props (pauses on hover / reduced motion). */
export function AnnouncementBar() {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pe-10">
      {ITEMS.map((item) => (
        <span key={item.text} className="flex items-center gap-2 whitespace-nowrap text-[12px] font-medium">
          <Icon name={item.icon} size={14} className="text-aqua-300" />
          {item.text}
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-ink-950 text-ink-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_120px_at_20%_0%,rgba(192,145,47,0.22),transparent_70%)]" />
      <div className="group relative flex overflow-hidden py-2">
        <div className="marquee-track flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {row}
          {row}
        </div>
      </div>
    </div>
  );
}
