import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cartApi, setScenario as setApiScenario, wishlistApi, compareApi, type ScenarioId } from "@/services/api";
import { ApiError, type Product } from "@/types/product";
import { readJSON, writeJSON } from "@/lib/localStore";
import { computeCartTotals, type CartTotals } from "@/lib/cart-logic";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export interface CartLine {
  id: string;
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  selectionLabel: string;
  unitPrice: number;
  quantity: number;
  image?: string;
}

export type ToastTone = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface StoreValue {
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  cartBump: boolean;
  addingToCart: boolean;
  addToCart: (line: Omit<CartLine, "id">, opts?: { silent?: boolean }) => Promise<boolean>;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string, opts?: { silent?: boolean }) => void;
  clearCart: () => void;
  couponCode: string;
  couponInput: string;
  setCouponInput: (value: string) => void;
  applyCoupon: () => void;
  removeCoupon: () => void;
  cartTotals: CartTotals;
  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Pick<Product, "id" | "name">) => Promise<void>;
  compare: string[];
  isCompared: (productId: string) => boolean;
  toggleCompare: (product: Pick<Product, "id" | "name">) => Promise<void>;
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  scenario: ScenarioId;
  changeScenario: (id: ScenarioId) => void;
}

const StoreContext = createContext<StoreValue | null>(null);
const CART_KEY = "rewaa_cart";
const COUPON_KEY = "rewaa_cart_coupon";

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => readJSON<CartLine[]>(CART_KEY, []));
  const [couponCode, setCouponCode] = useState<string>(() => readJSON<string>(COUPON_KEY, ""));
  const [couponInput, setCouponInput] = useState(couponCode);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartBump, setCartBump] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [scenario, setScenarioState] = useState<ScenarioId>("default");
  const bumpTimer = useRef<number | null>(null);

  useEffect(() => writeJSON(CART_KEY, cart), [cart]);
  useEffect(() => writeJSON(COUPON_KEY, couponCode), [couponCode]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
      const duration = toast.duration ?? (toast.tone === "error" ? 6000 : 3800);
      window.setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast]
  );

  const addToCart = useCallback<StoreValue["addToCart"]>(
    async (line, opts) => {
      setAddingToCart(true);
      try {
        await cartApi.addItem({
          productId: line.productId,
          variantId: line.variantId,
          sku: line.sku,
          quantity: line.quantity,
          selectionLabel: line.selectionLabel,
          unitPrice: line.unitPrice,
        });

        setCart((prev) => {
          const existing = prev.find((item) => item.variantId === line.variantId);
          if (existing) {
            return prev.map((item) =>
              item.variantId === line.variantId
                ? { ...item, quantity: Math.min(99, item.quantity + line.quantity) }
                : item
            );
          }
          return [...prev, { ...line, id: `line-${line.variantId}` }];
        });

        setCartBump(true);
        if (bumpTimer.current) window.clearTimeout(bumpTimer.current);
        bumpTimer.current = window.setTimeout(() => setCartBump(false), 500);

        if (!opts?.silent) {
          pushToast({
            tone: "success",
            title: "تمت إضافة المنتج إلى السلة",
            description: `${line.name} — ${line.selectionLabel} (${line.quantity})`,
          });
        }
        return true;
      } catch (error) {
        pushToast({
          tone: "error",
          title: "تعذّرت إضافة المنتج إلى السلة",
          description: error instanceof ApiError ? error.message : "حدث خطأ غير متوقع، حاول مرة أخرى.",
        });
        return false;
      } finally {
        setAddingToCart(false);
      }
    },
    [pushToast]
  );

  const updateCartQuantity = useCallback<StoreValue["updateCartQuantity"]>((variantId, quantity) => {
    setCart((prev) =>
      prev.map((line) => (line.variantId === variantId ? { ...line, quantity: Math.max(1, Math.min(99, quantity)) } : line))
    );
  }, []);

  const removeFromCart = useCallback<StoreValue["removeFromCart"]>(
    (variantId, opts) => {
      setCart((prev) => {
        const removed = prev.find((line) => line.variantId === variantId);
        if (removed && !opts?.silent) {
          pushToast({ tone: "info", title: "تمت إزالة المنتج من السلة", description: removed.name, duration: 2600 });
        }
        return prev.filter((line) => line.variantId !== variantId);
      });
    },
    [pushToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode("");
    setCouponInput("");
  }, []);

  const applyCoupon = useCallback(() => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponCode(code);
  }, [couponInput]);

  const removeCoupon = useCallback(() => {
    setCouponCode("");
    setCouponInput("");
  }, []);

  const toggleWishlist = useCallback<StoreValue["toggleWishlist"]>(
    async (product) => {
      const active = !wishlist.includes(product.id);
      setWishlist((prev) => (active ? [...prev, product.id] : prev.filter((id) => id !== product.id)));
      try {
        await wishlistApi.toggle(product.id, active);
        pushToast({
          tone: active ? "success" : "info",
          title: active ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة",
          description: product.name,
          duration: 2600,
        });
      } catch {
        setWishlist((prev) => (active ? prev.filter((id) => id !== product.id) : [...prev, product.id]));
        pushToast({ tone: "error", title: "تعذّر تحديث المفضلة", description: "تحقق من اتصالك وحاول مجددًا." });
      }
    },
    [wishlist, pushToast]
  );

  const toggleCompare = useCallback<StoreValue["toggleCompare"]>(
    async (product) => {
      const active = !compare.includes(product.id);
      if (active && compare.length >= 4) {
        pushToast({
          tone: "warning",
          title: "وصلت للحد الأقصى للمقارنة",
          description: "يمكنك مقارنة 4 منتجات في الوقت نفسه.",
        });
        return;
      }
      setCompare((prev) => (active ? [...prev, product.id] : prev.filter((id) => id !== product.id)));
      await compareApi.toggle(product.id, active);
      pushToast({
        tone: "info",
        title: active ? "أُضيف إلى قائمة المقارنة" : "أُزيل من قائمة المقارنة",
        description: product.name,
        duration: 2400,
      });
    },
    [compare, pushToast]
  );

  const changeScenario = useCallback((id: ScenarioId) => {
    setApiScenario(id);
    setScenarioState(id);
  }, []);

  const cartTotals = useMemo(() => computeCartTotals(cart, couponCode), [cart, couponCode]);

  const value = useMemo<StoreValue>(() => {
    const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
    const cartTotal = cart.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
    return {
      cart,
      cartCount,
      cartTotal,
      cartBump,
      addingToCart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      couponCode,
      couponInput,
      setCouponInput,
      applyCoupon,
      removeCoupon,
      cartTotals,
      wishlist,
      isWishlisted: (id: string) => wishlist.includes(id),
      toggleWishlist,
      compare,
      isCompared: (id: string) => compare.includes(id),
      toggleCompare,
      toasts,
      pushToast,
      dismissToast,
      scenario,
      changeScenario,
    };
  }, [
    cart,
    cartBump,
    addingToCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    couponCode,
    couponInput,
    applyCoupon,
    removeCoupon,
    cartTotals,
    wishlist,
    toggleWishlist,
    compare,
    toggleCompare,
    toasts,
    pushToast,
    dismissToast,
    scenario,
    changeScenario,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
