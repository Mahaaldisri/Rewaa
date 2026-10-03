import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import type { Address } from "@/types/auth";
import type { Order, OrderStatus } from "@/types/order";
import { useAuth } from "@/store/AuthProvider";
import { useStore } from "@/store/StoreProvider";
import { addressApi, ordersApi } from "@/services/api";
import { formatDate, formatMoney } from "@/lib/format";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/primitives";
import { AddressForm, type AddressFormValues } from "@/components/checkout/AddressForm";
import { LogoMark } from "@/components/brand/Logo";
import { cn } from "@/utils/cn";

type Tab = "orders" | "addresses" | "profile";

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "orders", label: "طلباتي", icon: "package" },
  { id: "addresses", label: "العناوين", icon: "mapPin" },
  { id: "profile", label: "الملف الشخصي", icon: "user" },
];

const STATUS_META: Record<OrderStatus, { label: string; tone: string; icon: IconName }> = {
  processing: { label: "قيد المعالجة", tone: "bg-warning-soft text-warning", icon: "clock" },
  confirmed: { label: "تم التأكيد", tone: "bg-info-soft text-info", icon: "check" },
  preparing: { label: "جارٍ التجهيز", tone: "bg-aqua-50 text-aqua-700", icon: "package" },
  shipped: { label: "تم الشحن", tone: "bg-brand-50 text-brand-700", icon: "truck" },
  delivered: { label: "تم التسليم", tone: "bg-success-soft text-success", icon: "badgeCheck" },
  cancelled: { label: "ملغي", tone: "bg-danger-soft text-danger", icon: "close" },
};

export function AccountPage() {
  const { user, isAuthenticated, logout, initializing } = useAuth();
  const { pushToast } = useStore();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab) ?? "orders";

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);
    ordersApi
      .list({ userId: user.id })
      .then(setOrders)
      .finally(() => setLoadingOrders(false));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoadingAddresses(true);
    addressApi
      .list(user.id)
      .then(setAddresses)
      .finally(() => setLoadingAddresses(false));
  }, [user]);

  if (initializing) {
    return (
      <div className="container-x py-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-6 h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login?redirect=/account" replace />;
  }

  const setTab = (next: Tab) => setParams({ tab: next });

  const saveAddress = async (values: AddressFormValues) => {
    setSavingAddress(true);
    try {
      if (editingAddress) {
        const updated = { ...editingAddress, ...values };
        await addressApi.update(user.id, updated);
        setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        pushToast({ tone: "success", title: "تم تحديث العنوان", duration: 2200 });
      } else {
        const created = await addressApi.create(user.id, values);
        setAddresses((prev) => (created.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev).concat(created));
        pushToast({ tone: "success", title: "تمت إضافة العنوان", duration: 2200 });
      }
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch {
      pushToast({ tone: "error", title: "تعذّر حفظ العنوان" });
    } finally {
      setSavingAddress(false);
    }
  };

  const removeAddress = async (id: string) => {
    await addressApi.remove(user.id, id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    pushToast({ tone: "info", title: "تم حذف العنوان", duration: 2000 });
  };

  const makeDefault = async (id: string) => {
    const updated = await addressApi.setDefault(user.id, id);
    setAddresses(updated);
  };

  return (
    <div className="bg-ambient">
      <div className="container-x py-6 sm:py-9">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-surface p-5 shadow-hair sm:p-6">
          <div className="flex items-center gap-3.5">
            <span className="grid size-14 place-items-center rounded-2xl bg-ink-950 font-display text-xl font-extrabold text-aqua-300">
              {user.name.slice(0, 1)}
            </span>
            <div>
              <p className="font-display text-[16px] font-extrabold text-ink-950">{user.name}</p>
              <p className="text-[12px] text-ink-500">{user.email} · {user.phone}</p>
              <p className="mt-0.5 text-[11px] text-ink-400">عضو منذ {formatDate(user.createdAt)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
              pushToast({ tone: "info", title: "تم تسجيل الخروج", duration: 2000 });
            }}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink-200 bg-surface px-4 text-[12.5px] font-semibold text-ink-600 transition hover:border-danger/30 hover:text-danger"
          >
            <Icon name="arrowLeft" size={14} />
            تسجيل الخروج
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1.5 overflow-x-auto no-scrollbar" role="tablist" aria-label="أقسام الحساب">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2.5 text-[12.5px] font-bold transition",
                tab === t.id ? "bg-ink-950 text-aqua-200" : "bg-surface text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50"
              )}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {/* --------------------------------- Orders --------------------------------- */}
          {tab === "orders" && (
            <div className="space-y-3">
              {loadingOrders ? (
                Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)
              ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-ink-200 bg-surface p-10 text-center">
                  <Icon name="package" size={28} className="mx-auto text-ink-300" />
                  <p className="mt-3 font-display text-[14px] font-bold text-ink-900">لا توجد طلبات بعد</p>
                  <Link to="/" className="mt-3 inline-flex text-[12.5px] font-semibold text-brand-700 hover:underline">
                    ابدأ التسوق الآن
                  </Link>
                </div>
              ) : (
                orders.map((order) => {
                  const meta = STATUS_META[order.status];
                  return (
                    <Link
                      key={order.id}
                      to={`/account/orders/${order.id}`}
                      className="flex flex-wrap items-center gap-4 rounded-xl border border-ink-100 bg-surface p-4 shadow-hair transition hover:border-brand-200 hover:shadow-card"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-paper-deep p-2">
                        {order.items[0]?.image ? (
                          <img src={order.items[0].image} alt="" className="size-full rounded-md object-cover" />
                        ) : (
                          <LogoMark className="size-full" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 font-mono text-[12.5px] font-bold text-ink-900">
                          {order.number}
                          <span className={cn("inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-[10px] font-bold", meta.tone)}>
                            <Icon name={meta.icon} size={10} />
                            {meta.label}
                          </span>
                        </p>
                        <p className="mt-1 line-clamp-1 text-[12px] text-ink-500">
                          {order.items.map((i) => i.name).join("، ")}
                        </p>
                        <p className="mt-0.5 text-[11px] text-ink-400">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-end">
                        <p className="font-display text-[15px] font-extrabold tabular-nums text-ink-950">
                          {formatMoney(order.total)}
                        </p>
                        <p className="mt-1 flex items-center justify-end gap-1 text-[11px] font-semibold text-brand-700">
                          التفاصيل
                          <Icon name="chevronLeft" size={12} />
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}

          {/* -------------------------------- Addresses -------------------------------- */}
          {tab === "addresses" && (
            <div className="space-y-3">
              {loadingAddresses ? (
                <Skeleton className="h-24 w-full rounded-xl" />
              ) : (
                addresses.map((address) => (
                  <div key={address.id} className="flex flex-wrap items-start gap-3 rounded-xl border border-ink-100 bg-surface p-4 shadow-hair">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon name="mapPin" size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-[13px] font-bold text-ink-900">
                        {address.label}
                        {address.isDefault && (
                          <span className="rounded-xs bg-aqua-50 px-1.5 py-0.5 text-[10px] font-bold text-aqua-700">افتراضي</span>
                        )}
                      </p>
                      <p className="mt-1 text-[12px] leading-5 text-ink-500">
                        {address.fullName} · {address.phone}
                        <br />
                        {address.district}، {address.street} — {address.cityName}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-1.5">
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => makeDefault(address.id)}
                          className="rounded-md border border-ink-200 px-2.5 py-1.5 text-[11px] font-semibold text-ink-600 transition hover:bg-ink-50"
                        >
                          اجعله افتراضيًا
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddress(address);
                          setShowAddressForm(true);
                        }}
                        className="rounded-md border border-ink-200 px-2.5 py-1.5 text-[11px] font-semibold text-ink-600 transition hover:bg-ink-50"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAddress(address.id)}
                        className="rounded-md border border-ink-200 px-2.5 py-1.5 text-[11px] font-semibold text-ink-600 transition hover:border-danger/30 hover:text-danger"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))
              )}

              {showAddressForm ? (
                <div className="rounded-xl border border-ink-100 bg-surface p-4">
                  <h3 className="mb-3 font-display text-[13.5px] font-bold text-ink-900">
                    {editingAddress ? "تعديل العنوان" : "عنوان جديد"}
                  </h3>
                  <AddressForm
                    initial={editingAddress}
                    onSubmit={saveAddress}
                    submitting={savingAddress}
                    onCancel={() => {
                      setShowAddressForm(false);
                      setEditingAddress(null);
                    }}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 py-3.5 text-[12.5px] font-semibold text-ink-600 transition hover:border-brand-300 hover:text-brand-800"
                >
                  <Icon name="plus" size={14} />
                  إضافة عنوان جديد
                </button>
              )}
            </div>
          )}

          {/* --------------------------------- Profile --------------------------------- */}
          {tab === "profile" && (
            <div className="max-w-lg space-y-3 rounded-xl border border-ink-100 bg-surface p-5 shadow-hair">
              {[
                { label: "الاسم الكامل", value: user.name, icon: "user" as const },
                { label: "البريد الإلكتروني", value: user.email, icon: "message" as const },
                { label: "رقم الجوال", value: user.phone, icon: "phone" as const },
              ].map((field) => (
                <div key={field.label} className="flex items-center gap-3 rounded-lg bg-ink-50/60 p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-surface text-ink-500 shadow-hair">
                    <Icon name={field.icon} size={16} />
                  </span>
                  <div>
                    <p className="text-[11px] text-ink-400">{field.label}</p>
                    <p className="text-[13px] font-semibold text-ink-900" dir="ltr">
                      {field.value}
                    </p>
                  </div>
                </div>
              ))}
              <p className="flex items-center gap-1.5 pt-1 text-[11.5px] text-ink-400">
                <Icon name="info" size={13} />
                لتحديث بياناتك الشخصية تواصل مع الدعم الفني على 920001234
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
