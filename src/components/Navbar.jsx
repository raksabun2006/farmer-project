import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  // Helper function revised to catch dynamic deep-linked conversation routes
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-xl sticky top-0 z-50 border-b-4 border-amber-500 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group transition transform active:scale-95 shrink-0">
            <div className="relative overflow-hidden bg-white/10 p-1.5 rounded-xl border border-white/10 shadow-inner group-hover:bg-white/20 transition">
              <img 
                className="h-8 w-auto object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:rotate-6" 
                src="/images/logo.png" 
                alt="Farmer Market Logo" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl uppercase text-amber-400 font-black tracking-widest font-sans drop-shadow-sm">
                KSK
              </span>
              <span className="text-[9px] text-emerald-200 font-medium tracking-tight -mt-1">
                FARMER MARKET
              </span>
            </div>
          </Link>

          {/* Desktop Menu Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 font-medium text-[14px]">
            {[
              { path: "/", label: "ទំព័រដើម" },
              { path: "/product", label: "ផលិតផល" },
              { path: "/about", label: "អំពីយើង" },
              { path: "/contact", label: "ទំនាក់ទំនង" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-xl transition-all duration-200 hover:text-amber-300 relative font-semibold ${
                  isActive(link.path) ? "text-amber-300 bg-white/5" : "text-white/90 hover:bg-white/5"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-amber-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Accessories (Dashboard, Cart, User Actions) */}
          <div className="hidden md:flex items-center gap-3 border-l border-emerald-600/60 pl-5">
            
            {/* Dashboard Button (Only visible to users with ROLE_FARMER) */}
            {user?.role === "ROLE_FARMER" && (
              <Link
                to="/farmer"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md ${
                  isActive("/farmer")
                    ? "bg-amber-600 text-white border border-amber-400 shadow-amber-600/20"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10 hover:shadow-lg"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
                ទៅកាន់ Dashboard
              </Link>
            )}

            {/* Shopping Cart Button */}
            <Link 
              to="/cart" 
              className={`relative p-2.5 rounded-xl transition duration-200 border text-white/90 active:scale-95 ${
                isActive("/cart") 
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/10" 
                  : "bg-emerald-800/40 border-white/5 hover:bg-emerald-800/80 hover:text-amber-300 hover:border-white/10"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {cart?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center min-w-5 border-2 border-emerald-700 shadow-md animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Session Conditionals */}
            {user ? (
              <div className="relative group py-2">
                <button className="flex items-center gap-2 bg-emerald-800/40 hover:bg-emerald-800/80 border border-white/5 hover:border-white/10 p-1.5 pr-3 rounded-xl transition cursor-pointer select-none">
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-400 bg-emerald-900 shrink-0 shadow-inner flex items-center justify-center">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user?.username || "Profile"} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-emerald-200">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    )}
                  </div>
                  <span className="max-w-[80px] truncate text-xs font-bold text-emerald-5  tracking-wide">{user?.username}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-emerald-300 transition-transform group-hover:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Desktop Dropdown Card Popover */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  <div className="px-4 py-1.5 border-b border-slate-50 mb-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">គណនីរបស់អ្នក</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{user?.username}</p>
                  </div>
                  
                  {user?.role === "ROLE_FARMER" && (
                    <Link
                      to="/farmer"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5V21m-15-11.545 15-5.454m-15 0v11.545M6.75 15.545v.008M6.75 18v.008M10.5 11v.008M10.5 14v.008M14.25 11v.008M14.25 14v.008" />
                      </svg>
                      គ្រប់គ្រងចំការ
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition border-t border-slate-50 mt-1 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M19.5 12l-3-3m3 3-3 3m3-3H9" />
                    </svg>
                    ចាកចេញ
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-white/90 hover:text-amber-300 font-semibold text-sm transition py-2"
                >
                  ចូលប្រើ
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-sm transition shadow-md shadow-amber-500/10 hover:shadow-lg"
                >
                  ចុះឈ្មោះ
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Actions / Toggle Wrapper Button */}
          <div className="flex md:hidden items-center gap-2">

            {/* Mobile Shopping Cart Button */}
            <Link 
              to="/cart" 
              className={`relative p-2 rounded-xl transition ${
                isActive("/cart") ? "bg-amber-500 text-slate-950" : "bg-emerald-800/40 text-white"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-4.5 border border-emerald-700 shadow">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {/* Hamburger Toggle */}
            <button
              className="p-2 bg-emerald-800/40 rounded-xl hover:bg-emerald-800/80 transition text-white active:scale-95"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Popout Panel Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-emerald-800/95 border-t border-emerald-600/50 backdrop-blur-lg animate-fadeIn">
          <div className="px-4 pt-3 pb-6 flex flex-col gap-2">
            {[
              { path: "/", label: "ទំព័រដើម" },
              { path: "/product", label: "ផលិតផល" },
              { path: "/about", label: "អំពីយើង" },
              { path: "/contact", label: "ទំនាក់ទំនង" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.path) ? "bg-amber-500 text-slate-950 shadow" : "text-emerald-100 hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive("/orders") ? "bg-amber-500 text-slate-950 shadow" : "text-emerald-100 hover:bg-white/5"
                }`}
              >
                ប្រវត្តិបញ្ជាទិញ
              </Link>
            )}

            <hr className="border-emerald-700/60 my-2" />

            {user ? (
              <div className="flex flex-col gap-3 bg-emerald-900/30 p-3 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-amber-400 bg-emerald-950 shrink-0 flex items-center justify-center shadow">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user?.username} className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-200">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">គណនីចូលប្រើ</span>
                    <span className="text-white text-sm font-black">{user?.username}</span>
                  </div>
                </div>

                {user?.role === "ROLE_FARMER" && (
                  <Link
                    to="/farmer"
                    onClick={() => setMenuOpen(false)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-center text-sm shadow transition"
                  >
                    ទៅកាន់ Dashboard
                  </Link>
                )}

                <button 
                  onClick={handleLogout} 
                  className="bg-red-600 hover:bg-red-700 font-bold px-4 py-2.5 rounded-xl text-center text-sm transition shadow cursor-pointer"
                >
                  ចាកចេញ
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-1">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="border border-white/20 hover:bg-white/5 px-4 py-2.5 rounded-xl text-center text-sm font-bold transition"
                >
                  ចូលប្រើ
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-center text-sm shadow"
                >
                  ចុះឈ្មោះ
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;