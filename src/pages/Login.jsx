import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { loginUser } from "../api/auth.js";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { getDashboardPath } from "../utils/auth.js";

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const data = await loginUser(formData);
        const { token, username, role, id } = data;
        if (!token) {
            throw new Error('No authentication token received from server.');
        }
        login(token, { username, role, id }); 
        
        navigate(getDashboardPath(role));
    } catch (err) {
        const fallbackMsg = t("networkError");
        const serverMessage = err.response?.data?.message || err.message;
        setError(serverMessage && serverMessage !== "No message available" ? serverMessage : fallbackMsg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#f3f8f3] xl:grid xl:grid-cols-[1.05fr_.95fr]">
      <div
  className="relative hidden min-h-dvh overflow-hidden bg-cover bg-center xl:block"
  style={{
    backgroundImage: "url('/images/farmer.jpg')",
  }}
>
  <div className="absolute inset-0 bg-[#123b28]/65" aria-hidden="true"></div>

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-[#123b28] via-transparent to-black/20" aria-hidden="true"></div>

  <div className="absolute inset-0 z-10 flex max-w-2xl flex-col justify-between p-8 text-white xl:p-16">
    <div className="flex w-max items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold tracking-wider backdrop-blur-md">
      <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(167,243,208,0.15)]" aria-hidden="true"></span>
      {t("localMarketplace")}
    </div>

    <div className="mb-8 max-w-xl space-y-5">
      <h1 className="text-4xl font-black leading-[1.3] tracking-tight xl:text-5xl">
        {t("heroTitle")}
      </h1>

      <p className="max-w-md text-sm font-medium leading-relaxed text-emerald-100/80 xl:text-base">
        {t("createAccountDescription")}
      </p>
    </div>

    <p className="text-xs text-gray-300">
      © 2026 {t("brand")} · {t("country")}
    </p>
  </div>
</div>

      
      <div className="relative flex min-h-dvh w-full flex-col justify-start overflow-y-auto bg-white px-4 py-6 sm:justify-center sm:px-10 sm:py-12 xl:px-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-50 xl:hidden" aria-hidden="true"></div>
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-lime-50 xl:hidden" aria-hidden="true"></div>
        
        <div className="relative mx-auto w-full max-w-md space-y-6 sm:space-y-7">
          
          {/* Branding / Header */}
          <div className="text-center xl:text-left">
            <div className="mb-4 flex items-center justify-center gap-3 sm:mb-6 xl:justify-start">
              <img src="/images/logo.png" alt={t("brand")} className="h-10 w-10 object-contain drop-shadow-sm sm:h-12 sm:w-12" />
              <div><p className="font-black text-emerald-800">{t("brand")}</p><p className="text-xs text-slate-400">{t("country")}</p></div>
            </div>
            <div className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {t("localMarketplace")}
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-800 sm:text-4xl">
              {t("login")}
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500 sm:leading-7">
              {t("tagline")}
            </p>
          </div>

          {/* Styled Error Alert */}
          {error && (
            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-600 shadow-sm sm:text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">!</span>
              <div className="font-semibold">{error}</div>
            </div>
          )}

          {/* Form Elements */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            {/* Input: Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-bold text-slate-700">
                {t("username")}
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 sm:py-3.5 sm:text-base"
                  placeholder={t("usernamePlaceholder")}
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm font-medium tracking-wide text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 sm:py-3.5 sm:text-base"
                  placeholder={t("passwordPlaceholder")}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                    {showPassword ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.5 5 8.5 5a16.7 16.7 0 0 1-3.2 3.5M6.7 6.7C4.8 8 3.5 10 3.5 10S6.8 15 12 15c.8 0 1.5-.1 2.2-.3" />
                      </>
                    ) : (
                      <>
                        <path d="M2.5 12s3.3-5 9.5-5 9.5 5 9.5 5-3.3 5-9.5 5-9.5-5-9.5-5Z" />
                        <circle cx="12" cy="12" r="2.2" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember & Forgot Space (Optional Layout Addition) */}
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-1 text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 accent-emerald-600 focus:ring-emerald-500" />
                {t("rememberMe")}
              </label>
              <a href="#forgot-password" className="font-semibold text-emerald-600 hover:underline">{t("forgotPassword")}</a>
            </div>

            {/* Button: Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition duration-150 hover:-translate-y-0.5 active:translate-y-0 sm:py-4 sm:text-base ${
                loading
                  ? "bg-slate-400 cursor-not-allowed shadow-none"
                  : "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("checkingCredentials")}</span>
                </>
              ) : (
                <>
                  <span>{t("login")}</span>
                  <span className="text-xs">➔</span>
                </>
              )}
            </button>
          </form>

          {/* Redirection area area footer links */}
          <div className="border-t border-slate-100 pt-5 text-center xl:text-left">
            <p className="text-sm text-slate-500 font-medium">
              {t("noAccount")}{" "}
              <Link
                to="/register"
                className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline inline-flex items-center gap-1 transition"
              >
                {t("createAccountHere")}
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;