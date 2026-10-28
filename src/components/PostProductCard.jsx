import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useTranslation } from "react-i18next";

const PostProductCard = ({ onProductPosted }) => {
    const { t } = useTranslation();
    const { user } = useAuth(); 
    const fileInputRef = useRef(null); // Ref to manually clear the file input field later

    const [categories, setCategories] = useState([]); 
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        image: '', // This will now hold the Base64 image string representation
        farmerId: user?.id || user?.userId || 0, 
        categoryId: '' 
    });

    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true); 
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // 1. Fetch categories dynamically from Backend API on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:2829/api/v1/categories', {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                
                if (!response.ok) throw new Error('Failed to load product categories');
                
                const data = await response.json();
                setCategories(data);
                
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: data[0].id }));
                }
            } catch (err) {
                console.error("Category Fetch Error:", err);
                setErrorMessage("Unable to fetch categories. Please refresh.");
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // 2. Sync dynamic user session data
    useEffect(() => {
        if (user) {
            const currentId = user.id || user.userId || 0;
            setFormData(prev => ({
                ...prev,
                farmerId: currentId
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['price', 'quantity', 'farmerId', 'categoryId'].includes(name)
                ? (value === '' ? '' : Number(value)) 
                : value
        }));
    };

    // New handler to process image files selected from device storage
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Optional Validation: Restrict to standard images under 2MB
        if (file.size > 2 * 1024 * 1024) {
            setErrorMessage("Image is too large! Please choose an image smaller than 2MB.");
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                image: reader.result // Contains the full Base64 Data URL string
            }));
            setErrorMessage(''); // Clear errors if conversion succeeded
        };
        reader.onerror = () => {
            setErrorMessage("Failed to read image file asset layout.");
        };
        reader.readAsDataURL(file);
    };

    const handleCategorySelect = (id) => {
        setFormData(prev => ({
            ...prev,
            categoryId: Number(id)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        if (!formData.farmerId || formData.farmerId === 0) {
            setErrorMessage('Account ID not found. Please log out and log in again.');
            setLoading(false);
            return;
        }

        if (!formData.categoryId) {
            setErrorMessage('Please select a valid category.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:2829/api/v1/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '' 
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    quantity: formData.quantity,
                    image: formData.image, // Sends Base64 payload data string to backend structural entity mapper
                    categoryId: formData.categoryId,
                    farmerId: formData.farmerId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.message || (data.errors ? data.errors.map(err => err.defaultMessage).join(", ") : 'Failed to post product');
                throw new Error(errorMsg);
            }

            setSuccessMessage('Product successfully posted to the market!');
            
            // Reset the form state fully
            setFormData({
                name: '',
                description: '',
                price: 0,
                quantity: 0,
                image: '',
                farmerId: user?.id || user?.userId || 0,
                categoryId: categories.length > 0 ? categories[0].id : ''
            });

            // Reset the DOM elements file input field ref cleanly
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            if (onProductPosted) onProductPosted();
            
        } catch (err) {
            console.error("Submission Error:", err);
            setErrorMessage(err.message || 'Could not connect to the server');
        } finally {
            setLoading(false);
        }
    };

    const isUserUnlinked = !formData.farmerId || formData.farmerId === 0;

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 text-white">
                <h3 className="text-xl font-bold">{t("postProduct")}</h3>
                <p className="text-emerald-100/80 text-xs mt-1">{t("manageProducts")}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {isUserUnlinked && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs">
                        <p className="font-bold">{t("accountUnavailable")}</p>
                        <p>{t("accountUnavailableHelp")}</p>
                    </div>
                )}

                {successMessage && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm font-medium">{successMessage}</div>}
                {errorMessage && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium">{errorMessage}</div>}

                {/* Product Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase">{t("productName")}</label>
                    <input type="text" name="name" required disabled={isUserUnlinked} value={formData.name} onChange={handleChange} className="p-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>

                {/* Price & Quantity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase">{t("price")}</label>
                        <input type="number" name="price" required disabled={isUserUnlinked} min="0" step="0.01" value={formData.price || ''} onChange={handleChange} className="p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase">{t("quantity")}</label>
                        <input type="number" name="quantity" required disabled={isUserUnlinked} min="0" value={formData.quantity || ''} onChange={handleChange} className="p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" />
                    </div>
                </div>

                {/* Product Category Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600 uppercase">{t("category")}</label>
                    
                    {categoriesLoading ? (
                        <div className="text-xs text-slate-400 p-2 animate-pulse">{t("loadingCategories")}</div>
                    ) : categories.length === 0 ? (
                        <div className="text-xs text-slate-400 p-2">{t("noCategoriesAvailable")}</div>
                    ) : (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {categories.map((cat) => {
                                const isSelected = formData.categoryId === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button" 
                                        disabled={isUserUnlinked}
                                        onClick={() => handleCategorySelect(cat.id)}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                                            isSelected 
                                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" 
                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* MODIFIED: Local Device File Image Upload Layout with Visual Sandbox Preview Panel */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase">{t("productImage")}</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        
                        {/* Live Image Preview Window */}
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            )}
                        </div>

                        {/* Interactive File Input Selector */}
                        <div className="flex-1 flex flex-col justify-center">
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                accept="image/*" 
                                disabled={isUserUnlinked}
                                onChange={handleFileChange} 
                                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer w-full"
                            />
                            <p className="text-[10px] text-slate-400 mt-1.5">{t("imageHelp")}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase">{t("description")}</label>
                    <textarea name="description" rows="3" disabled={isUserUnlinked} value={formData.description} onChange={handleChange} className="p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" />
                </div>

                {/* Submit Action Button */}
                <button type="submit" disabled={loading || isUserUnlinked || categoriesLoading} className="w-full py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 transition-colors cursor-pointer">
                    {loading ? t("loading") : t("submit")}
                </button>
            </form>
        </div>
    );
};

export default PostProductCard;