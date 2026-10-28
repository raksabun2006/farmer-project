import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllProducts } from "../../api/auth.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const ProductPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [category, setCategory] = useState(() => searchParams.get("category") || "all");
  const [stockOnly, setStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setError(t("networkError")))
      .finally(() => setLoading(false));
  }, [t]);

  const categories = useMemo(() => [...new Set(products.map((product) => product.categoryName).filter(Boolean))], [products]);
  const filteredProducts = useMemo(() => products.filter((product) => {
    const text = `${product.name || ""} ${product.farmerName || ""}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (category === "all" || product.categoryName === category) && (!stockOnly || Number(product.quantity) > 0);
  }), [products, search, category, stockOnly]);

  const addProduct = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    navigate("/cart");
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-8 rounded-3xl bg-[#eef6ee] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold text-[#d59620]">{t("localMarketplace")}</p>
        <h1 className="mt-2 text-3xl font-black text-[#173b2a] sm:text-4xl">{t("products")}</h1>
        <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">{t("heroText")}</p>
      </div>
      <div className="mb-7 grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("searchProducts")} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" aria-label={t("searchProducts")} />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 outline-none"><option value="all">{t("all")}</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600"><input type="checkbox" checked={stockOnly} onChange={(event) => setStockOnly(event.target.checked)} className="h-4 w-4 accent-emerald-600" /> {t("availableOnly")}</label>
      </div>
      <div className="mb-5 flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">{t("showingProducts", { count: filteredProducts.length })}</p><Link to="/" className="text-sm font-bold text-[#17623b] hover:underline">{t("backHome")}</Link></div>
      {error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-slate-200" />)}</div> : filteredProducts.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center text-sm text-slate-500">{t("noProducts")}</div> : <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{filteredProducts.map((product) => { const out = Number(product.quantity) <= 0; return <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Link to={`/product/${product.id}`} className="block"><div className="h-40 overflow-hidden bg-emerald-50 sm:h-52"><img src={product.image || "/images/hero-bg.jpg"} alt={product.name} className="h-full w-full object-cover" /></div></Link><div className="p-3.5"><p className="mb-1 text-[10px] font-bold text-emerald-700">{product.categoryName || t("products")}</p><h2 className="line-clamp-2 min-h-[3rem] text-sm font-black text-slate-800">{product.name}</h2><p className="mt-1 text-xs text-slate-500">{t("seller", { name: product.farmerName || t("country") })}</p><div className="mt-3 flex items-end justify-between gap-2"><div><p className="font-black text-[#17623b]">${Number(product.price || 0).toFixed(2)}</p><p className={`text-[10px] ${out ? "text-red-500" : "text-slate-400"}`}>{out ? t("outOfStock") : t("inStock", { count: product.quantity || 0 })}</p></div><button type="button" disabled={out} onClick={() => addProduct(product)} className="rounded-lg bg-[#17623b] px-2.5 py-2 text-[11px] font-bold text-white disabled:bg-slate-200 disabled:text-slate-400">{t("addToCart")}</button></div></div></article>; })}</div>}
    </div>
  );
};

export default ProductPage;
