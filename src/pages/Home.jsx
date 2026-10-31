import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllProducts } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getDashboardPath, isFarmerRole } from "../utils/auth.js";

const SearchIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
  </svg>
);

const CartIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h2l1.4 11.2a2 2 0 0 0 2 1.8h8.8a2 2 0 0 0 1.95-1.55L21 8H6M10 20h.01M17 20h.01" />
  </svg>
);

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(Array.isArray(data) ? [...data].reverse() : []))
      .catch(() => setError(t("networkError")))
      .finally(() => setLoading(false));
  }, [t]);

  const productCategories = useMemo(() => {
    const categoryMap = new Map();
    products.forEach((product) => {
      if (product.categoryName && !categoryMap.has(product.categoryName)) {
        categoryMap.set(product.categoryName, product.image);
      }
    });
    return Array.from(categoryMap, ([label, image]) => ({ label, image }));
  }, [products]);
  const featuredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = `${product.name || ""} ${product.farmerName || ""}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  }).slice(0, 6), [products, search, selectedCategory]);

  const addProduct = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    navigate("/cart");
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-[#eef6ee]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 md:grid-cols-[1.05fr_.95fr] md:px-8 md:py-16">
          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full bg-[#d7ebd8] px-3 py-1 text-xs font-bold text-[#17623b]">{t("localMarketplace")}</p>
            <h1 className="max-w-xl text-4xl font-black leading-[1.35] tracking-tight text-[#173b2a] sm:text-5xl">{t("heroTitle")}</h1>
            <p className="mt-4 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">{t("heroText")}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/product" className="rounded-xl bg-[#17623b] px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#124d2e]">{t("findProducts")}</Link>
              <Link to={isFarmerRole(user?.role) ? getDashboardPath(user.role) : "/register"} className="rounded-xl border border-[#17623b] bg-white px-5 py-3 text-center text-sm font-bold text-[#17623b] transition hover:bg-emerald-50">{t("startSelling")}</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
              <span>✓ {t("clearPrices")}</span><span>✓ {t("directFromFarmers")}</span><span>✓ {t("country")}</span>
            </div>
          </div>
          <div className="relative h-64 overflow-hidden rounded-[2rem] shadow-lg sm:h-80 md:h-[25rem]">
            <img src="/images/hero-bg.jpg" alt="កសិករនៅវាលស្រែ" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173b2a]/45 to-transparent" />
            <div className="absolute bottom-5 left-5 rounded-xl bg-white/95 px-4 py-3 shadow-lg">
              <p className="text-xs text-slate-500">{t("localMarketplace")}</p><p className="text-lg font-black text-[#17623b]">{t("freshFromFarm")}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-14 px-5 py-12 md:px-8">
        <section>
          <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-bold text-[#d59620]">{t("browseAll")}</p><h2 className="mt-1 text-2xl font-black text-[#173b2a]">{t("productCategories")}</h2></div><Link to="/product" className="text-sm font-bold text-[#17623b] hover:underline">{t("browseAll")} →</Link></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {productCategories.length > 0 ? productCategories.map((category) => <Link to={`/product?category=${encodeURIComponent(category.label)}`} key={category.label} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div className="h-24 overflow-hidden bg-emerald-50"><img src={category.image || "/images/hero-bg.jpg"} alt={category.label} className="h-full w-full object-cover opacity-90 transition group-hover:scale-105" /></div><p className="px-2 py-3 text-center text-xs font-bold text-slate-700">{category.label}</p></Link>) : <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">{t("noCategories")}</div>}
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold text-[#d59620]">{t("newFromFarmers")}</p><h2 className="mt-1 text-2xl font-black text-[#173b2a]">{t("popularProducts")}</h2></div><Link to="/product" className="text-sm font-bold text-[#17623b] hover:underline">{t("viewAllProducts")} →</Link></div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-400 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100"><SearchIcon /><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full py-2 text-sm outline-none" placeholder={t("searchProducts")} aria-label={t("searchProducts")} /></label>
            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none"><option value="all">{t("all")}</option>{productCategories.map((category) => <option key={category.label}>{category.label}</option>)}</select>
          </div>
          {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          {loading ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-slate-200" />)}</div> : featuredProducts.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-500">{t("noProducts")}</div> : <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{featuredProducts.map((product) => { const out = Number(product.quantity) <= 0; return <article key={product.id} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Link to={`/product/${product.id}`} className="block"><div className="relative h-40 overflow-hidden bg-emerald-50 sm:h-56"><img src={product.image || "/images/hero-bg.jpg"} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-bold text-[#17623b]">{product.categoryName || t("products")}</span></div></Link><div className="p-3.5 sm:p-4"><h3 className="line-clamp-2 min-h-[3rem] text-sm font-black text-slate-800 sm:text-base">{product.name}</h3><p className="mt-1 text-xs text-slate-500">{t("seller", { name: product.farmerName || t("country") })}</p><div className="mt-3 flex items-end justify-between gap-2"><div><p className="text-lg font-black text-[#17623b]">${Number(product.price || 0).toFixed(2)}</p><p className={`text-[11px] font-semibold ${out ? "text-red-500" : "text-slate-400"}`}>{out ? t("outOfStock") : t("inStock", { count: product.quantity || 0 })}</p></div><button type="button" disabled={out} onClick={() => addProduct(product)} className="flex items-center gap-1 rounded-lg bg-[#17623b] px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-[#124d2e] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"><CartIcon /> {t("add")}</button></div></div></article>; })}</div>}
        </section>

        <section className="grid gap-4 rounded-3xl bg-[#173b2a] p-6 text-white sm:grid-cols-4 sm:p-8">
          {[["directFromFarmers", "tagline"], ["clearPrices", "showingProducts"], ["findByProvince", "products"], ["easyContact", "contact"]].map(([titleKey, textKey]) => <div key={titleKey} className="border-b border-white/10 pb-4 last:border-0 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 sm:last:border-0"><h3 className="font-bold text-[#f2bd4b]">{t(titleKey)}</h3><p className="mt-1 text-xs leading-6 text-emerald-100/75">{t(textKey)}</p></div>)}
        </section>
      </main>
    </div>
  );
};

export default Home;
