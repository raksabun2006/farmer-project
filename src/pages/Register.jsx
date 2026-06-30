import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router'; 

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
    const navigate = useNavigate();
    const fileInputRef = useRef(null); 
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const [profileFile, setProfileFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const submissionData = new FormData();
            
            Object.keys(formData).forEach(key => {
                submissionData.append(key, formData[key]);
            });

            if (profileFile) {
                submissionData.append('profileImage', profileFile);
            }

            const response = await fetch('http://localhost:2829/api/v1/auth/register', {
                method: 'POST',
                body: submissionData 
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    const detailedErrors = data.errors.map(err => err.defaultMessage).join(", ");
                    throw new Error(detailedErrors);
                }
                throw new Error(data.message || 'ការចុះឈ្មោះបានបរាជ័យ');
            }

            setSuccessMessage('គណនីរបស់អ្នកត្រូវបានបង្កើតដោយជោគជ័យ');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error("Register Error:", err);
            setErrorMessage(err.message || 'មិនអាចតភ្ជាប់ជាមួយម៉ាស៊ីនមេបានទេ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-50 font-sans">
            
            {/* ផ្នែកខាងឆ្វេង៖ ផ្ទាំងរូបភាពលម្អ */}
            <div
                className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/images/farmer.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
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

            {/* ផ្នែកខាងស្តាំ៖ Form ចុះឈ្មោះ */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white relative z-10 shadow-2xl lg:shadow-none overflow-y-auto">
                <div className="mx-auto w-full max-w-md space-y-7 animate-fadeIn my-auto">
                    
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">
                            ចុះឈ្មោះគណនី
                        </h2>
                        <p className="text-slate-500 text-sm mt-2 font-medium">
                            សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីចូលរួមក្នុង <span className="text-emerald-600 font-semibold">ផ្សារកសិករ</span>។
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Section 1: Account Information */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                                ១. ព័ត៌មានគណនី
                            </h3>
                            
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">ឈ្មោះគណនី (Username) *</label>
                                    <input type="text" name="username" required minLength={3} maxLength={20} value={formData.username} onChange={handleChange} placeholder="username" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition bg-slate-50/50 focus:bg-white text-slate-800 text-sm font-medium" />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">អ៊ីមែល (Email) *</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="example@gmail.com" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition bg-slate-50/50 focus:bg-white text-slate-800 text-sm font-medium" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">លេខកូដសម្ងាត់ *</label>
                                        <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} placeholder="យ៉ាងតិច ៦ ខ្ទង់" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition bg-slate-50/50 focus:bg-white text-slate-800 text-sm font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">តួនាទីក្នុងប្រព័ន្ធ *</label>
                                        <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition bg-slate-50/50 focus:bg-white text-slate-800 text-sm font-semibold cursor-pointer">
                                            <option value="FARMER">កសិករ (Farmer)</option>
                                            <option value="CUSTOMER">អ្នកទិញ (Customer)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Personal Information */}
                        <div className="space-y-3 pt-2">
                            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                                ២. ព័ត៌មានផ្ទាល់ខ្លួន
                            </h3>
                            
                            <div className="space-y-3">
                                {/* ផ្នែកជ្រើសរើសនិងបង្ហាញរូបភាពកែប្រែថ្មីនៅទីនេះ */}
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">រូបភាពប្រវត្តិរូប (Profile Image)</label>
                                    <div className="flex items-center gap-4 mt-2 p-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-100">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center font-bold px-1 bg-slate-100">
                                                    គ្មានរូបភាព
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 w-full">
                                            <input 
                                                type="file" 
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={handleFileChange} 
                                                className="hidden" 
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                className="w-max px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 rounded-lg text-xs font-bold shadow-sm transition"
                                            >
                                                ជ្រើសរើសរូបភាព...
                                            </button>
                                            <p className="text-[10px] text-slate-400">គាំទ្រប្រភេទឯកសារ PNG, JPG ឬ JPEG</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">ឈ្មោះពេញ</label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="ឈ្មោះពេញរបស់អ្នក" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition bg-slate-50/50 focus:bg-white text-slate-800 text-sm font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">លេខទូរស័ព្ទ</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="012 345 678" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition bg-slate-50/50 focus:bg-white text-slate-800 text-sm font-medium" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase">រាជធានី / ខេត្ត *</label>
                                    <select name="province" value={formData.province} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition bg-slate-50/50 focus:bg-white text-slate-800 text-sm font-medium cursor-pointer">
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
                                        <span>កំពុងបង្កើតគណនី...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>ចុះឈ្មោះបង្កើតគណនី</span>
                                        <span className="text-xs"></span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Redirect Link */}
                    <div className="pt-4 border-t border-slate-100 text-center lg:text-left">
                        <p className="text-sm text-slate-500 font-medium">
                            មានគណនីរួចហើយមែនទេ?{" "}
                            <Link
                                to="/login"
                                className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline inline-flex items-center gap-1 transition"
                            >
                                ចូលប្រើប្រាស់នៅទីនេះ
                            </Link>
                        </p>
                    </div>
                    
                </div>
            </div>

        </div>
    );
};

export default Register;