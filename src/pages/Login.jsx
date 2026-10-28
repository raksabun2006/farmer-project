import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { loginUser } from "../api/auth.js";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

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
        
        if (role === 'FARMER' || role === 'ROLE_FARMER') {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    } catch (err) {
        const fallbackMsg = t("networkError");
        const serverMessage = err.response?.data?.message || err.message;
        setError(serverMessage && serverMessage !== "No message available" ? serverMessage : fallbackMsg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
                  <div
  className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/farmer.jpg')", // Your image path
  }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

  <div className="absolute inset-0 flex flex-col justify-between p-16 text-white z-10 max-w-2xl">
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-max text-xs font-bold tracking-wider uppercase border border-white/10">
      វេទិកាទំនើបសម្រាប់កសិករខ្មែរ
    </div>

    <div className="space-y-4 mb-8">
      <h1 className="text-4xl font-extrabold tracking-tight leading-tight xl:text-5xl">
        ប្រព័ន្ធគ្រប់គ្រង និងចែកចាយ <br />
        ផលិតផលកសិកម្មជាតិ
      </h1>

      <p className="text-emerald-100/80 font-medium leading-relaxed max-w-md text-sm xl:text-base">
        ចូលរួមជាមួយបណ្តាញកសិកម្មវៃឆ្លាត ដើម្បីពង្រីកសក្តានុពលទីផ្សារ
        និងបង្កើនប្រាក់ចំណូលរបស់អ្នកប្រកបដោយចីរភាព។
      </p>
    </div>

    <p className="text-xs text-gray-300">
      © 2026 ផ្សារកសិករ (Farmer Marketplace). រក្សាសិទ្ធិគ្រប់យ៉ាង។
    </p>
  </div>
</div>

      
      {/* 🟢 ផ្នែកខាងឆ្វេង៖ Form ចូលប្រើប្រាស់ (Responsive Full Screen Container) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white relative z-10 shadow-2xl lg:shadow-none">
        
        <div className="mx-auto w-full max-w-md space-y-8 animate-fadeIn">
          
          {/* Branding / Header */}
          <div className="text-center lg:text-left">
            <div className="inline-flex p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl text-3xl mb-4 shadow-sm ring-4 ring-emerald-50/50">
              
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">
              {t("login")}
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              {t("tagline")}
            </p>
          </div>

          {/* Styled Error Alert */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-4 rounded-xl border border-red-100 flex items-start gap-2.5 shadow-sm animate-shake">
              <span className="text-base mt-0.5"></span>
              <div className="font-semibold">{error}</div>
            </div>
          )}

          {/* Form Elements */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input: Username */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">
                {t("username")}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-sm">
                
                </span>
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition bg-slate-50/50 focus:bg-white text-slate-800 font-medium placeholder-slate-400 text-sm sm:text-base"
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
              <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">
                {t("password")}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-sm">
                
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition bg-slate-50/50 focus:bg-white text-slate-800 font-medium tracking-wide placeholder-slate-400 text-sm sm:text-base"
                  placeholder={t("passwordPlaceholder")}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                {/* ប៊ូតុង បើក/បិទ មើលលេខសម្ងាត់ */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition text-sm focus:outline-none"
                >
                  {showPassword ? "បិទ" : "បើក"}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Space (Optional Layout Addition) */}
            <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600" />
                save
              </label>
              <a href="#" className="text-emerald-600 font-semibold hover:underline">{t("forgotPassword")}</a>
            </div>

            {/* Button: Submit */}
            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-150 shadow-lg text-sm sm:text-base flex items-center justify-center gap-2 ${
                loading
                  ? "bg-slate-400 cursor-not-allowed shadow-none"
                  : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-emerald-600/20"
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
          <div className="pt-4 border-t border-slate-100 text-center lg:text-left">
            <p className="text-sm text-slate-500 font-medium">
              មិនទាន់មានគណនីប្រើប្រាស់?{" "}
              <Link
                to="/register"
                className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline inline-flex items-center gap-1 transition"
              >
                បង្កើតគណនីថ្មីនៅទីនេះ
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;