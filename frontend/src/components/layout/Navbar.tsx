import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, LayoutDashboard, LogIn, LogOut, User, CalendarCheck, Sun, Moon, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { useLocaleStore } from "@/stores/locale.store";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const localeOptions: { value: Locale; label: string; flag: string }[] = [
  { value: "th", label: "ภาษาไทย", flag: "🇹🇭" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
];

export function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { locale, setLocale } = useLocaleStore();
  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLink = (path: string, exact = true) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      exact
        ? location.pathname === path ? "text-primary" : "text-muted-foreground"
        : location.pathname.startsWith(path) ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">CarRental</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={navLink("/")}>{t("nav.vehicles", locale)}</Link>
          {isAuthenticated && !isAdmin && (
            <Link to="/my-reservations" className={navLink("/my-reservations")}>
              {t("nav.myReservations", locale)}
            </Link>
          )}
          {isAdmin && (
            <>
              <Link to="/admin" className={navLink("/admin")}>{t("nav.dashboard", locale)}</Link>
              <Link to="/admin/vehicles" className={navLink("/admin/vehicles")}>
                {t("nav.manageVehicles", locale)}
              </Link>
              <Link to="/admin/reservations" className={navLink("/admin/reservations")}>
                {t("nav.reservations", locale)}
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-1">
          {/* Locale Dropdown */}
          <div className="relative" ref={langRef}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 px-2"
              onClick={() => setLangOpen(!langOpen)}
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">{locale}</span>
            </Button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border bg-card shadow-lg py-1 z-50">
                {localeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setLocale(opt.value); setLangOpen(false); }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-accent ${
                      locale === opt.value ? "text-primary font-medium" : "text-foreground"
                    }`}
                  >
                    <span>{opt.flag}</span>
                    <span className="flex-1 text-left">{opt.label}</span>
                    {locale === opt.value && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === "light" ? "Dark mode" : "Light mode"}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <>
              <span className="hidden lg:inline text-sm text-muted-foreground ml-1">
                {user?.firstName} {user?.lastName}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{t("nav.logout", locale)}</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-1" />
                {t("nav.login", locale)}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
        <div className="flex items-center justify-around h-14">
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 text-xs ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Car className="h-5 w-5" />
            {t("nav.vehicles", locale)}
          </Link>
          {isAuthenticated && !isAdmin && (
            <Link
              to="/my-reservations"
              className={`flex flex-col items-center gap-0.5 text-xs ${
                location.pathname === "/my-reservations" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <CalendarCheck className="h-5 w-5" />
              {t("nav.bookings", locale)}
            </Link>
          )}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className={`flex flex-col items-center gap-0.5 text-xs ${
                  location.pathname === "/admin" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                {t("nav.dashboard", locale)}
              </Link>
              <Link
                to="/admin/reservations"
                className={`flex flex-col items-center gap-0.5 text-xs ${
                  location.pathname.startsWith("/admin/reservations") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <CalendarCheck className="h-5 w-5" />
                {t("nav.bookings", locale)}
              </Link>
            </>
          )}
          <Link
            to={isAuthenticated ? "#" : "/login"}
            onClick={isAuthenticated ? logout : undefined}
            className="flex flex-col items-center gap-0.5 text-xs text-muted-foreground"
          >
            <User className="h-5 w-5" />
            {isAuthenticated ? t("nav.logout", locale) : t("nav.login", locale)}
          </Link>
        </div>
      </nav>
    </header>
  );
}
