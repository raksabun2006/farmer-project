import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllProducts } from "../api/auth";
import { useCart } from "../context/CartContext";

const Home = () => {
  const { user } = useAuth();
  const { addToCart } = useCart(); 
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const productData = await getAllProducts();
        setProducts(Array.isArray(productData) ? productData.reverse() : []);
      } catch (err) {
        console.error(err);
        setError("សូមអភ័យទោស, មិនអាចទាញយកទិន្នន័យបានទេ។");
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Filter Unique categories out of string variables
  const derivedCategories = useMemo(() => {
    const uniqueCategories = new Set();
    products.forEach((prod) => {
      if (prod.categoryName && prod.categoryName.trim() !== "") {
        uniqueCategories.add(prod.categoryName.trim());
      }
    });
    return Array.from(uniqueCategories);
  }, [products]);

  // Aggregate Total Quantities dynamically per Category Tag
  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((prod) => {
      if (prod.categoryName) {
        const catName = prod.categoryName.trim();
        counts[catName] = (counts[catName] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Filter products by category & search query, sort by stock, then select top 3
  const displayedProducts = useMemo(() => {
    const filtered = products.filter((prod) => {
      const matchesCategory = selectedCategory === "ALL" || prod.categoryName === selectedCategory;
      const matchesSearch = 
        prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        prod.farmerName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort by quantity descending (highest stock first) and take top 3
    return filtered.sort((a, b) => (b.quantity || 0) - (a.quantity || 0)).slice(0, 3);
  }, [products, selectedCategory, searchQuery]);

  const handleAddToCartAndGo = (product) => {
    if (!user) {
      alert("សូមចូលក្នុងប្រព័ន្ធជាមុនសិន ដើម្បីធ្វើការបញ្ជាទិញ។");
      navigate("/login");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
    });

    navigate("/cart"); 
  };

  return (
    <div className="space-y-16 pb-24 bg-slate-50/30 px-4 md:px-8">
      {/* Banner Hero Section */}
      <section className="relative text-white rounded-3xl p-8 md:p-16 overflow-hidden shadow-xl">
        <img
          src="https://www.karpit.news/wp-content/uploads/2024/09/photo_1_2024-09-11_08-58-12.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="font-siemreap relative z-10 max-w-2xl space-y-6">
            <span className="inline-block bg-emerald-700/50 text-amber-300 font-bold text-xs md:text-sm px-4 py-1.5 rounded-full border border-emerald-600/30">
              ផលិតផលក្នុងស្រុក ១០០%
            </span>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-relaxed text-white">
              គាំទ្រផលិតផលខ្មែរ <br /> <span className="text-amber-300">ដើម្បីកសិករខ្មែរ</span>
            </h1>

            {user && (user.role === "FARMER" || user.role === "farmer") && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/farmer")}
                  className="group flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs md:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 cursor-pointer transform active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21 A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                  ទៅកាន់ផ្ទាំងគ្រប់គ្រងកសិករ
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Filter Buttons & Search Field Section */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition shrink-0 cursor-pointer ${
                selectedCategory === "ALL" 
                  ? "bg-emerald-600 text-white border-emerald-600" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              ទាំងអស់ ({products.length})
            </button>

            {derivedCategories.map((catName) => (
              <button
                key={catName}
                type="button"
                onClick={() => setSelectedCategory(catName)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition shrink-0 cursor-pointer ${
                  selectedCategory === catName 
                    ? "bg-emerald-600 text-white border-emerald-600" 
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {catName} ({categoryCounts[catName] || 0})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.602Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="ស្វែងរកឈ្មោះផលិតផល ឬកសិករ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>
        </div>
      </section>

      {error && <div className="text-red-500 text-center py-4 font-medium">{error}</div>}

      {/* Main Display Grid */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black text-slate-800">ផលិតផលលក់ដាច់ខ្លាំង (មានស្តុកច្រើន)</h2>

        {loading ? (
          <div className="text-center py-10 text-slate-500">កំពុងផ្ទុកទិន្នន័យ...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
            {displayedProducts.length === 0 ? (
              <div className="text-center py-20 text-slate-400 col-span-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 text-slate-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25m-2.25-2.25 2.25-2.25m-2.25 2.25-2.25-2.25M3.75 7.5h16.5M5.497 5.12a2.25 2.25 0 0 1 1.947-1.12h9.112a2.25 2.25 0 0 1 1.947 1.12l1.531 2.38a1.125 1.125 0 0 1-.947 1.73H4.912a1.125 1.125 0 0 1-.947-1.73l1.532-2.38Z" />
                </svg>
                <span className="font-bold text-sm tracking-wide">មិនមានផលិតផលទេក្នុងពេលនេះ។</span>
              </div>
            ) : (
              displayedProducts.map((prod) => {
                const isOutOfStock = prod.quantity <= 0;
                return (
                  <div 
                    key={prod.id} 
                    className="bg-white border border-slate-100 rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between group max-w-sm w-full mx-auto transition-all duration-300 relative overflow-hidden"
                  >
                    <div>
                      {/* Image Section */}
                      <div className="relative h-60 bg-slate-50 rounded-2xl overflow-hidden mb-4 shadow-inner">
                        <img 
                          src={prod.image || "https://placehold.co/400x300?text=No+Image"} 
                          alt={prod.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        />
                        
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-800 text-[11px] font-black px-3 py-1.5 rounded-xl shadow-sm border border-white/40">
                          {prod.categoryName || "ផលិតផលខ្មែរ"}
                        </span>

                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-red-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md border border-red-400 uppercase tracking-wider">
                              អស់ពីស្តុក
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="px-1">
                        <h3 className="font-black text-slate-800 text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-emerald-700 transition duration-200">
                          {prod.name}
                        </h3>
                        
                        <div className="flex flex-col gap-0.5">
                          <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            លក់ដោយ៖ <span className="font-semibold text-slate-600">{prod.farmerName || "កសិករខ្មែរ"}</span>
                          </p>
                          
                          <p className={`text-[11px] font-bold ${isOutOfStock ? "text-red-500" : "text-amber-600"}`}>
                            {isOutOfStock ? "មិនអាចកម្ម៉ង់បានទេ" : `មានក្នុងស្តុក: ${prod.quantity || 0}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & CTA Button Footer */}
                    <div className="border-t border-slate-100/80 pt-3.5 flex justify-between items-center mt-5 px-1">
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">តម្លៃសរុប</span>
                        <span className="text-emerald-600 font-black text-2xl tracking-tight">
                          ${Number(prod.price).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCartAndGo(prod)}
                        disabled={isOutOfStock}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black transition-all transform active:scale-95 ${
                          isOutOfStock 
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none" 
                            : "bg-emerald-800 hover:bg-amber-500 text-white hover:text-slate-950 cursor-pointer shadow-md shadow-emerald-800/10 hover:shadow-amber-500/20"
                        }`}
                      >
                        {!isOutOfStock && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.119-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        )}
                        {isOutOfStock ? "អស់ពីស្តុក" : "កុម្ម៉ង់ទិញ"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>

      {/* Trust & Value Proposition Badges Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col justify-center shadow-sm">
          <h4 className="font-bold text-slate-800 text-sm mb-1">ស្រស់ៗពីចម្ការ</h4>
          <p className="text-slate-400 text-xs leading-relaxed">ធានាគុណភាពផលិតផលធម្មជាតិពិតៗ ប្រមូលផលផ្ទាល់ពីដៃកសិករខ្មែរ។</p>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col justify-center shadow-sm">
          <h4 className="font-bold text-slate-800 text-sm mb-1">តម្លៃសមរម្យយុត្តិធម៌</h4>
          <p className="text-slate-400 text-xs leading-relaxed">ទិញដោយផ្ទាល់ដោយមិនឆ្លងកាត់ឈ្មួញកណ្តាល ជួយបង្កើនចំណូលកសិករ។</p>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col justify-center shadow-sm">
          <h4 className="font-bold text-slate-800 text-sm mb-1">រួមគ្នាគាំទ្រសហគមន៍</h4>
          <p className="text-slate-400 text-xs leading-relaxed">រាល់ការបញ្ជាទិញរបស់អ្នក គឺជាកម្លាំងចិត្ត និងការអភិវឌ្ឍន៍វិស័យកសិកម្មជាតិ。</p>
        </div>
      </section>
    </div>
  );
};

export default Home;