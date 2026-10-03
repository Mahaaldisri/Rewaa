import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { ToastViewport } from "@/components/ui/ToastViewport";

/** Shared chrome for every route — header/footer stay mounted across navigations. */
export function AppLayout() {
  const location = useLocation();

  // Scroll to top on every route change (checkout steps handle their own scroll).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[110] focus:rounded-md focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-aqua-300"
      >
        تخطَّ إلى المحتوى الرئيسي
      </a>

      <AnnouncementBar />
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
      <ToastViewport />
    </div>
  );
}
