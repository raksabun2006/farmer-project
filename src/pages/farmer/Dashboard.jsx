import { useState, useEffect } from 'react';
import { getAllProducts } from '../../api/auth';
import PostProductCard from '../../components/PostProductCard';

const CAMBODIA_PROVINCES = [
    "ភ្នំពេញ (Phnom Penh)",
    "កណ្តាល (Kandal)",
    "កំពង់ចាម (Kampong Cham)",
    "កំពង់ឆ្នាំង (Kampong Chhnang)",
    "កំពង់ធំ (Kampong Thom)",
    "កំពង់ស្ពឺ (Kampong Speu)",
    "កំពត (Kampot)",
    "កែប (Kep)",
    "កោះកុង (Koh Kong)",
    "ក្រចេះ (Kratie)",
    "តាកែវ (Takeo)",
    "ត្បូងឃ្មុំ (Tboung Khmum)",
    "បន្ទាយមានជ័យ (Banteay Meanchey)",
    "បាត់ដំបង (Battambang)",
    "ប៉ៃលិន (Pailin)",
    "ពោធិ៍សាត់ (Pursat)",
    "ព្រះសីហនុ (Preah Sihanouk)",
    "ព្រះវិហារ (Preah Vihear)",
    "ព្រៃវែង (Prey Veng)",
    "មណ្ឌលគិរី (Mondulkiri)",
    "រតនគិរី (Ratanakiri)",
    "សៀមរាប (Siem Reap)",
    "ស្ទឹងត្រែង (Stung Treng)",
    "ស្វាយរៀង (Svay Rieng)",
    "ឧត្តរមានជ័យ (Oddar Meanchey)"
];

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [profileFormData, setProfileFormData] = useState({ fullName: '', phone: '', province: '', profileImage: '' });
    const [userProfile, setUserProfile] = useState({
        id: null, username: '', email: '', role: '', fullName: '', phone: '', province: '', profileImage: ''
    });

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) {
            setUserProfile({
                id: savedUser.id || null,
                username: savedUser.username || '',
                email: savedUser.email || '',
                role: savedUser.role || '',
                fullName: savedUser.fullName || savedUser.username || 'កសិករ',
                phone: savedUser.phone || 'មិនទាន់កំណត់', 
                province: savedUser.province || 'មិនទាន់កំណត់',  
                profileImage: savedUser.profileImage || ''
            });

            fetch(`http://localhost:2829/api/v1/farmers/${savedUser.id}`)
                .then(res => res.json())
                .then(farmerData => {
                    if (farmerData?.id) {
                        const updatedData = { 
                            fullName: farmerData.fullName || '', 
                            phone: farmerData.phone || '', 
                            province: farmerData.province || '', 
                            profileImage: farmerData.profileImage || '' 
                        };
                        setUserProfile(prev => ({ 
                            ...prev, 
                            fullName: updatedData.fullName || prev.fullName,
                            phone: updatedData.phone || 'មិនទាន់កំណត់',
                            province: updatedData.province || 'មិនទាន់កំណត់',
                            profileImage: updatedData.profileImage || prev.profileImage
                        }));
                        setProfileFormData(updatedData);
                    }
                })
                .catch(err => console.warn("Profile fetch warning:", err.message));
                
            loadFarmerSales(savedUser.id, savedUser.token);
        }
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data || []);
        } catch (err) { 
            console.error("Failed to load products", err); 
        } finally { 
            setLoading(false); 
        }
    };

    const loadFarmerSales = async (farmerId, token) => {
        setLoadingOrders(true);
        try {
            const response = await fetch(`http://localhost:2829/api/v1/orders/farmer/${farmerId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Could not fetch sales");
            const data = await response.json();
            setOrders(data);
        } catch (err) { 
            console.error("Error loading sales:", err); 
        } finally { 
            setLoadingOrders(false); 
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const savedUser = JSON.parse(localStorage.getItem('user'));
            const updatePayload = {
                fullName: profileFormData.fullName.trim(),
                phone: profileFormData.phone === 'មិនទាន់កំណត់' ? '' : profileFormData.phone.trim(),
                province: profileFormData.province === 'មិនទាន់កំណត់' ? '' : profileFormData.province,
                profileImage: profileFormData.profileImage.trim()
            };

            const response = await fetch(`http://localhost:2829/api/v1/farmers/${userProfile.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${savedUser?.token}` 
                },
                body: JSON.stringify(updatePayload)
            });

            if (!response.ok) {
                const errorResponse = await response.json().catch(() => ({}));
                throw new Error(errorResponse.message || "Update failed");
            }
            
            const data = await response.json();
            
            const freshProfile = {
                ...userProfile,
                fullName: data.fullName || userProfile.fullName,
                phone: data.phone || 'មិនទាន់កំណត់',
                province: data.province || 'មិនទាន់កំណត់',
                profileImage: data.profileImage || userProfile.profileImage
            };

            setUserProfile(freshProfile);
            localStorage.setItem('user', JSON.stringify({ ...savedUser, ...data }));
            
            setIsEditingProfile(false);
            alert("កែប្រែប្រវត្តិរូបបានជោគជ័យ!");
        } catch (err) { 
            alert("បរាជ័យ៖ " + err.message); 
        } finally { 
            setEditLoading(false); 
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("តើអ្នកពិតជាចង់លុបផលិតផលនេះមែនទេ?")) {
            return;
        }

        try {
            const savedUser = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://localhost:2829/api/v1/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${savedUser?.token}`
                }
            });

            if (!response.ok) {
                const errorResponse = await response.json().catch(() => ({}));
                throw new Error(errorResponse.message || "Failed to delete product");
            }

            setProducts(prevProducts => prevProducts.filter(prod => {
                const id = prod.id || prod._id;
                return String(id) !== String(productId);
            }));
            
            alert("លុបផលិតផលបានជោគជ័យ!");
        } catch (err) {
            alert("មិនអាចលុបបានទេ៖ " + err.message);
        }
    };

    const myProducts = products.filter(prod => {
        const productFarmerId = prod.farmer?.id || prod.farmerId || prod.userId;
        return productFarmerId && userProfile.id && String(productFarmerId) === String(userProfile.id);
    });

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 bg-slate-50 min-h-screen">
            
            {/* ================= 📊 USER PROFILE WIDGET ================= */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    {userProfile.profileImage ? (
                        <img 
                            src={userProfile.profileImage} 
                            alt="User Profile" 
                            className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-500/10 shadow-inner"
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${userProfile.fullName}&background=059669&color=fff`; }}
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl uppercase ring-4 ring-emerald-500/10 shadow-md">
                            {userProfile.fullName.charAt(0)}
                        </div>
                    )}
                    
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-slate-800">{userProfile.fullName}</h2>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${userProfile.role === 'FARMER' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                {userProfile.role === 'FARMER' ? ' កសិករ (Farmer)' : 'អ្នកទិញ (Customer)'}
                            </span>
                        </div>

                        <p className="text-sm text-slate-500 font-medium">
                            @{userProfile.username} • <span className="text-slate-400 font-normal">{userProfile.email}</span>
                        </p>
                        
                        <div className="text-xs text-slate-400 flex items-center gap-4 flex-wrap pt-1">
                            <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 font-medium">
                                 លេខទូរស័ព្ទ៖ {userProfile.phone}
                            </span>
                            <span className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md text-emerald-700 font-medium">
                                 ទីតាំងខេត្ត៖ {userProfile.province}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => {
                            setProfileFormData({
                                fullName: userProfile.fullName,
                                phone: userProfile.phone !== 'មិនទាន់កំណត់' ? userProfile.phone : '',
                                province: userProfile.province !== 'មិនទាន់កំណត់' ? userProfile.province : '',
                                profileImage: userProfile.profileImage !== 'មិនទាន់កំណត់' ? userProfile.profileImage : ''
                            });
                            setIsEditingProfile(true);
                        }}
                        className="flex-1 md:flex-none text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl transition shadow-sm"
                    >
                        កែប្រែប្រវត្តិរូប
                    </button>
                </div>
            </div>

            {/* ================= 📦 ORDERS LIST SECTION ================= */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-700 mb-4">បញ្ជីការបញ្ជាទិញពីអតិថិជន</h3>
                {loadingOrders ? (
                    <p>កំពុងផ្ទុក...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 text-slate-600 font-bold">លេខសម្គាល់ (ID)</th>
                                    <th className="p-4 text-slate-600 font-bold">សរុប (Total)</th>
                                    <th className="p-4 text-slate-600 font-bold">ស្ថានភាព (Status)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? orders.map((order) => (
                                    <tr key={order.id} className="border-t hover:bg-slate-50/50">
                                        <td className="p-4 font-mono text-slate-600">#{order.id}</td>
                                        <td className="p-4 font-bold text-slate-800">${order.totalAmount}</td>
                                        <td className="p-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="p-8 text-center text-slate-400 font-medium">
                                            មិនទាន់មានការបញ្ជាទិញ
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
{isEditingProfile && (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800">កែប្រែព័ត៌មានប្រវត្តិរូប</h3>
                <button 
                    type="button"
                    onClick={() => setIsEditingProfile(false)} 
                    className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
                >
                    ✖
                </button>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4 text-sm">
  
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">ឈ្មោះពេញ (FULL NAME)</label>
                    <input 
                        type="text" 
                        value={profileFormData.fullName}
                        onChange={(e) => setProfileFormData({...profileFormData, fullName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 font-medium" 
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">លេខទូរស័ព្ទ (PHONE)</label>
                    <input 
                        type="text" 
                        value={profileFormData.phone}
                        onChange={(e) => setProfileFormData({...profileFormData, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 font-medium" 
                        required
                    />
                </div>

                {/* រាជធានី / ខេត្ត (PROVINCE) */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">រាជធានី / ខេត្ត (PROVINCE)</label>
                    <select 
                        value={profileFormData.province}
                        onChange={(e) => setProfileFormData({...profileFormData, province: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-emerald-500 font-medium text-slate-700"
                        required
                    >
                        <option value="" disabled>--- សូមជ្រើសរើសខេត្ត ---</option>
                        {CAMBODIA_PROVINCES.map((province, index) => (
                            <option key={index} value={province}>{province}</option>
                        ))}
                    </select>
                </div>

                {/* MODIFIED: Local Device Storage File Selector Layout with Preview Circle for Profile Images */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">រូបភាពប្រវត្តិរូប (PROFILE IMAGE)</label>
                    <div className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                        
                        {/* Circle Avatar Profile Sandbox Preview Window */}
                        <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {profileFormData.profileImage ? (
                                <img 
                                    src={profileFormData.profileImage} 
                                    alt="Profile Avatar" 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            )}
                        </div>

                        {/* File Picker Native Action Trigger Element */}
                        <div className="flex-1">
                            <input 
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    // File Size Check (Keeps memory payload safe under 2MB)
                                    if (file.size > 2 * 1024 * 1024) {
                                        alert("រូបភាពធំពេកទេ! សូមជ្រើសរើសរូបភាពតូចជាង 2MB (Image too large).");
                                        e.target.value = '';
                                        return;
                                    }

                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setProfileFormData({
                                            ...profileFormData,
                                            profileImage: reader.result // Base64 String value assignment mapped dynamically
                                        });
                                    };
                                    reader.readAsDataURL(file);
                                }}
                                className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer w-full"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">គាំទ្រប្រភេទ PNG, JPG ទំហំអតិបរមា 2MB</p>
                        </div>
                    </div>
                </div>

                {/* Form Action Controls */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button 
                        type="button" 
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl transition cursor-pointer"
                    >
                        បោះបង់
                    </button>
                    <button 
                        type="submit" 
                        disabled={editLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
                    >
                        {editLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'រក្សាទុក'}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

            {/* ================= 🏷️ HEADER SECTION ================= */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 md:p-8 rounded-2xl text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-wide flex items-center gap-2">
                         ផ្ទាំងគ្រប់គ្រងកសិផល
                    </h1>
                    <p className="text-emerald-100/90 text-sm mt-1">គ្រប់គ្រងផលិតផល និងតម្លៃកសិផលរបស់អ្នកឱ្យបានរហ័ស</p>
                </div>
                
                {userProfile.role === 'FARMER' && (
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className={`w-full sm:w-auto font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${
                            showForm 
                            ? 'bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-500' 
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95'
                        }`}
                    >
                        {showForm ? 'x បិទផ្ទាំងបំពេញ' : '＋ បន្ថែមផលិតផលថ្មី'}
                    </button>
                )}
            </div>

            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">ផលិតផលសរុបរបស់អ្នក</p>
                            <p className="text-2xl font-bold text-slate-800">{myProducts.length} មុខ</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= 🛠️ POST PRODUCT FORM ================= */}
            {showForm && (
                <div className="animate-fadeIn">
                    <PostProductCard 
                        currentFarmerId={userProfile.id} 
                        onProductPosted={() => {
                            loadProducts(); 
                            setShowForm(false); 
                        }} 
                    />
                </div>
            )}

            {/* ================= 🌾 DYNAMIC PRODUCT LIST GRID ================= */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                   បញ្ជីផលិតផលរបស់អ្នក
                </h3>
                
                {loading ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">កំពុងផ្ទុកទិន្នន័យផលិតផល...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myProducts.length === 0 ? (
                            <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
                                <p className="font-medium">មិនទាន់មានផលិតផលនៅក្នុងបញ្ជីនៅឡើយទេ</p>
                            </div>
                        ) : (
                            myProducts.map((prod) => {
                                const currentId = prod.id || prod._id;
                                return (
                                    <div 
                                        key={currentId} 
                                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                                    >
                                        {prod.image && (
                                            <div className="w-full h-44 bg-slate-100 overflow-hidden">
                                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}

                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                            <div>
                                                <h4 className="font-bold text-lg text-slate-800 line-clamp-1">{prod.name}</h4>
                                                <p className="text-slate-400 text-xs line-clamp-2">{prod.description}</p>
                                            </div>

                                            <div className="flex justify-between items-end pt-2 border-t border-slate-50">
                                                <div>
                                                    <p className="text-xl font-extrabold text-emerald-600">{Number(prod.price).toLocaleString()} $</p>
                                                    <p className="text-[11px] text-slate-400">ស្តុក៖ {prod.quantity || 0}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteProduct(currentId)}
                                                    className="text-slate-400 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-150"
                                                >
                                                    លុប
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;