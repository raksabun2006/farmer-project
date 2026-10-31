import { useState } from 'react';
import { useNavigate, Link } from 'react-router'; 
import { useTranslation } from "react-i18next";

const CAMBODIA_PROVINCES = [
    { km: "ភ្នំពេញ", en: "Phnom Penh" },
    { km: "កណ្តាល", en: "Kandal" },
    { km: "កំពង់ចាម", en: "Kampong Cham" },
    { km: "កំពង់ឆ្នាំង", en: "Kampong Chhnang" },
    { km: "កំពង់ធំ", en: "Kampong Thom" },
    { km: "កំពង់ស្ពឺ", en: "Kampong Speu" },
    { km: "កំពត", en: "Kampot" },
    { km: "កែប", en: "Kep" },
    { km: "កោះកុង", en: "Koh Kong" },
    { km: "ក្រចេះ", en: "Kratie" },
    { km: "តាកែវ", en: "Takeo" },
    { km: "ត្បូងឃ្មុំ", en: "Tboung Khmum" },
    { km: "បន្ទាយមានជ័យ", en: "Banteay Meanchey" },
    { km: "បាត់ដំបង", en: "Battambang" },
    { km: "ប៉ៃលិន", en: "Pailin" },
    { km: "ពោធិ៍សាត់", en: "Pursat" },
    { km: "ព្រះសីហនុ", en: "Preah Sihanouk" },
    { km: "ព្រះវិហារ", en: "Preah Vihear" },
    { km: "ព្រៃវែង", en: "Prey Veng" },
    { km: "មណ្ឌលគីរី", en: "Mondulkiri" },
    { km: "រតនគីរី", en: "Ratanakiri" },
    { km: "សៀមរាប", en: "Siem Reap" },
    { km: "ស្ទឹងត្រែង", en: "Stung Treng" },
    { km: "ស្វាយរៀង", en: "Svay Rieng" },
    { km: "ឧត្តរមានជ័យ", en: "Oddar Meanchey" }
];

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'FARMER',
        fullName: '',
        phone: '',
        province: 'Phnom Penh'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:2829/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    const detailedErrors = data.errors.map(err => err.defaultMessage).join(", ");
                    throw new Error(detailedErrors);
                }
                throw new Error(data.message || t("registerFailed"));
            }

            setSuccessMessage(t("registerSuccess"));
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error("Register Error:", err);
            setErrorMessage(err.message || t("serverConnectionError"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh w-full bg-[#f3f8f3] xl:grid xl:grid-cols-[1.05fr_.95fr]">
            
            {/* ផ្នែកខាងឆ្វេង៖ ផ្ទាំងរូបភាពលម្អ */}
            <div
                className="relative hidden min-h-dvh overflow-hidden bg-cover bg-center xl:block"
                style={{ backgroundImage: "url('/images/farmer.jpg')" }}
            >
                <div className="absolute inset-0 bg-[#123b28]/65"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#123b28] via-transparent to-black/20"></div>
                <div className="absolute inset-0 z-10 flex max-w-2xl flex-col justify-between p-10 text-white xl:p-16">
                    <div className="flex w-max items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold tracking-wider backdrop-blur-md">
                        {t("localMarketplace")}
                    </div>
                    <div className="space-y-4 mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight leading-tight xl:text-5xl">
                            {t("heroTitle")}
                        </h1>
                        <p className="text-emerald-100/80 font-medium leading-relaxed max-w-md text-sm xl:text-base">
                            {t("createAccountDescription")}
                        </p>
                    </div>
                    <p className="text-xs text-gray-300">
                        © 2026 {t("brand")} · {t("country")}
                    </p>
                </div>
            </div>

            {/* ផ្នែកខាងស្តាំ៖ Form ចុះឈ្មោះ */}
            <div className="relative flex min-h-dvh w-full flex-col justify-start overflow-y-auto bg-white px-4 py-6 sm:px-10 sm:py-12 xl:justify-center xl:px-14">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-50 xl:hidden" aria-hidden="true"></div>
                <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-lime-50 xl:hidden" aria-hidden="true"></div>
                <div className="relative mx-auto w-full max-w-md space-y-6 sm:space-y-7">
                    
                    {/* Header */}
                    <div className="text-center xl:text-left">
                        <div className="mb-4 flex items-center justify-center gap-3 sm:mb-5 xl:justify-start">
                            <img src="/images/logo.png" alt={t("brand")} className="h-10 w-10 object-contain drop-shadow-sm sm:h-12 sm:w-12" />
                            <div><p className="font-black text-emerald-800">{t("brand")}</p><p className="text-xs text-slate-400">{t("country")}</p></div>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-800 sm:text-4xl">
                            {t("register")}
                        </h2>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                            {t("createAccountDescription")}
                        </p>
                    </div>

                    {/* Alerts */}
                    {successMessage && (
                        <div className="bg-emerald-50 text-emerald-600 text-xs sm:text-sm p-4 rounded-xl border border-emerald-100 flex items-start gap-2.5 shadow-sm">
                            <div className="font-semibold">{successMessage}</div>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-4 rounded-xl border border-red-100 flex items-start gap-2.5 shadow-sm animate-shake">
                            <div className="font-semibold">{errorMessage}</div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        
                        {/* Section 1: Account Information */}
                        <div className="space-y-2 sm:space-y-3">
                            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                                {t("accountInformation")}
                            </h3>
                            
                            <div className="space-y-2 sm:space-y-3">
                                <div className="space-y-1">
                                    <label htmlFor="register-username" className="block text-sm font-bold text-slate-700">{t("username")} *</label>
                                    <input id="register-username" type="text" name="username" required minLength={3} maxLength={20} value={formData.username} onChange={handleChange} placeholder={t("usernamePlaceholder")} autoComplete="username" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                                </div>
                                
                                <div className="space-y-1">
                                    <label htmlFor="register-email" className="block text-sm font-bold text-slate-700">{t("email")} *</label>
                                    <input id="register-email" type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="example@gmail.com" autoComplete="email" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                                </div>

                                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                                    <div className="space-y-1">
                                        <label htmlFor="register-password" className="block text-sm font-bold text-slate-700">{t("password")} *</label>
                                        <div className="relative"><input id="register-password" type={showPassword ? "text" : "password"} name="password" required minLength={6} value={formData.password} onChange={handleChange} placeholder={t("passwordPlaceholder")} autoComplete="new-password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500" aria-label={showPassword ? t("hidePassword") : t("showPassword")}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">{showPassword ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.5 5 8.5 5a16.7 16.7 0 0 1-3.2 3.5M6.7 6.7C4.8 8 3.5 10 3.5 10S6.8 15 12 15c.8 0 1.5-.1 2.2-.3" /></> : <><path d="M2.5 12s3.3-5 9.5-5 9.5 5 9.5 5-3.3 5-9.5 5-9.5-5-9.5-5Z" /><circle cx="12" cy="12" r="2.2" /></>}</svg></button></div>
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="register-role" className="block text-sm font-bold text-slate-700">{t("role")} *</label>
                                        <select id="register-role" name="role" value={formData.role} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10">
                                            <option value="FARMER">{t("farmer")}</option>
                                            <option value="CUSTOMER">{t("customer")}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Personal Information */}
                        <div className="space-y-2 pt-1 sm:space-y-3 sm:pt-2">
                            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                                {t("personalInformation")}
                            </h3>
                            
                            <div className="space-y-2 sm:space-y-3">
                                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-slate-700">{t("fullName")}</label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t("fullNamePlaceholder")} autoComplete="name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-slate-700">{t("phone")}</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={t("phonePlaceholder")} autoComplete="tel" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-bold text-slate-700">{t("province")} *</label>
                                    <select name="province" value={formData.province} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10">
                                        {CAMBODIA_PROVINCES.map((prov, index) => (
                                            <option key={index} value={prov.en}>
                                                {prov.km} ({prov.en})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
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
                                        <span>{t("loading")}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{t("register")}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Redirect Link */}
                    <div className="pt-4 border-t border-slate-100 text-center xl:text-left">
                        <p className="text-sm text-slate-500 font-medium">
                            {t("noAccount")}{" "}
                            <Link
                                to="/login"
                                className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline inline-flex items-center gap-1 transition"
                            >
                                {t("login")}
                            </Link>
                        </p>
                    </div>
                    
                </div>
            </div>

        </div>
    );
};

export default Register;