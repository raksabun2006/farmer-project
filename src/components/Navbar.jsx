import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getDashboardPath, isFarmerRole } from "../utils/auth.js";

const SearchIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
  </svg>
);

const CartIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 4h2l1.4 11.2a2 2 0 0 0 2 1.8h8.8a2 2 0 0 0 1.95-1.55L21 8H6M10 20h.01M17 20h.01" />
  </svg>
);

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const links = [
    { path: "/", label: t("home") },
    { path: "/product", label: t("products") },
    { path: "/about", label: t("about") },
    { path: "/contact", label: t("contact") },
  ];

  const currentLocale = location.pathname.startsWith("/km") ? "km" : location.pathname.startsWith("/en") ? "en" : "";
  const localizedPath = (path, locale = currentLocale) => `${locale ? `/${locale}` : ""}${path === "/" ? "" : path}`;
  const isActive = (path) => {
    const currentPath = currentLocale ? location.pathname.replace(`/${currentLocale}`, "") || "/" : location.pathname;
    return path === "/" ? currentPath === "/" : currentPath.startsWith(path);
  };
  const changeLanguage = (locale) => {
    i18n.changeLanguage(locale);
    navigate(localizedPath(currentLocale ? location.pathname.replace(`/${currentLocale}`, "") || "/" : location.pathname, locale === "en" ? "" : locale));
  };
  const submitSearch = (event) => {
    event.preventDefault();
    navigate(localizedPath(query.trim() ? `/product?search=${encodeURIComponent(query.trim())}` : "/product"));
    setMenuOpen(false);
  };

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="bg-[#173b2a] px-5 py-1.5 text-center text-xs text-emerald-50">
        {t("tagline")}
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          <Link to={localizedPath("/")} className="flex shrink-0 items-center gap-2.5" aria-label={t("home")}>
            <img src="/images/logo.png" alt="" className="h-10 w-10 object-contain" />
            <div className="leading-tight">
              <p className="text-base font-black text-[#17623b]">{t("brand")}</p>
              <p className="text-[10px] font-semibold text-slate-400">{t("country")}</p>
            </div>
          </Link>

          <form onSubmit={submitSearch} className="hidden max-w-md flex-1 md:flex">
            <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-[#f7faf7] px-3 text-slate-400 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
              <SearchIcon />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent py-2.5 text-sm text-slate-700 outline-none" placeholder={t("search")} aria-label={t("search")} />
            </label>
          </form>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link key={link.path} to={localizedPath(link.path)} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive(link.path) ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center rounded-lg border border-slate-200 px-1 py-1 text-xs font-bold sm:flex" aria-label={t("language")}>
              <button type="button" onClick={() => changeLanguage("en")} className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 ${i18n.language === "en" ? "bg-emerald-100 text-emerald-700" : "text-slate-400"}`} aria-label={t("english")} title={t("english")}><img src="/images/flag-us.svg" alt="" className="h-4 w-6 rounded-[2px] object-cover shadow-sm" />EN</button>
              <span className="text-slate-300">|</span>
              <button type="button" onClick={() => changeLanguage("km")} className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 ${i18n.language === "km" ? "bg-emerald-100 text-emerald-700" : "text-slate-400"}`} aria-label={t("khmer")} title={t("khmer")}><img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg" alt="" className="h-4 w-6 rounded-[2px] object-cover shadow-sm" />KM</button>
            </div>
            <Link to={localizedPath("/cart")} className="relative rounded-lg p-2 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700" aria-label={t("cart")}>
              <CartIcon />
              {cart.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f2bd4b] px-1 text-[10px] font-black text-[#173b2a]">{cart.length}</span>}
            </Link>
            {user && isFarmerRole(user.role) && (
              <Link to={localizedPath(getDashboardPath(user.role))} className="hidden rounded-xl border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 sm:block">
                {t("dashboard")}
              </Link>
            )}
            {user ? (
              <button type="button" onClick={signOut} className="hidden rounded-xl bg-[#17623b] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#124d2e] sm:block">{t("logout")}</button>
            ) : (
              <Link to={localizedPath("/login")} className="hidden rounded-xl bg-[#17623b] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#124d2e] sm:block">{t("login")}</Link>
            )}
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-slate-600 lg:hidden" aria-label={t("openMenu")} aria-expanded={menuOpen}>
              <span className="block h-0.5 w-5 bg-current" /><span className="my-1 block h-0.5 w-5 bg-current" /><span className="block h-0.5 w-5 bg-current" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-100 pb-4 pt-3 lg:hidden">
            <form onSubmit={submitSearch} className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400">
              <SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent py-2 text-sm outline-none" placeholder={t("search")} aria-label={t("search")} />
            </form>
            <div className="grid grid-cols-2 gap-1">
              {links.map((link) => <Link key={link.path} to={localizedPath(link.path)} onClick={() => setMenuOpen(false)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${isActive(link.path) ? "bg-emerald-50 text-emerald-700" : "text-slate-600"}`}>{link.label}</Link>)}
              <div className="col-span-2 flex gap-2 px-3 py-2 sm:hidden">
                <button type="button" onClick={() => changeLanguage("en")} className={`flex items-center gap-1.5 rounded border px-3 py-1 text-xs font-bold ${i18n.language === "en" ? "border-emerald-500 text-emerald-700" : "border-slate-200 text-slate-400"}`} aria-label={t("english")} title={t("english")}><img src="/images/flag-us.svg" alt="" className="h-4 w-6 rounded-[2px] object-cover shadow-sm" />EN</button>
                <button type="button" onClick={() => changeLanguage("km")} className={`flex items-center gap-1.5 rounded border px-3 py-1 text-xs font-bold ${i18n.language === "km" ? "border-emerald-500 text-emerald-700" : "border-slate-200 text-slate-400"}`} aria-label={t("khmer")} title={t("khmer")}><img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg" alt="" className="h-4 w-6 rounded-[2px] object-cover shadow-sm" />KM</button>
              </div>
              {user && isFarmerRole(user.role) && <Link to={localizedPath(getDashboardPath(user.role))} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700">{t("dashboard")}</Link>}
              {user ? <button type="button" onClick={signOut} className="text-left rounded-lg px-3 py-2 text-sm font-semibold text-red-600">{t("logout")}</button> : <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700">{t("login")}</Link>}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
