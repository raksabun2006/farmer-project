import React, { useState } from 'react';
import ChatBox from '../../components/ChatBox';


const ProductDetail = ({ product, onClose }) => {
    if (!product) return null;

    const [activeChat, setActiveChat] = useState(false);

    const {
        id,
        name,
        description,
        price,
        quantity,
        image,
        farmerId,
        farmerName,
        categoryName
    } = product;

    // ទាញយកទិន្នន័យអ្នកប្រើប្រាស់ដែលកំពុង Login ជាប់ពី LocalStorage
    const savedUser = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-none">
                
                {/* Product Image Side */}
                <div className="w-full md:w-1/2 bg-slate-50 relative h-64 md:h-auto min-h-[250px]">
                    {image ? (
                        <img 
                            src={image} 
                            alt={name} 
                            className="w-full h-full object-cover"
                            onError={(e) => { 
                                e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop"; 
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-100">
                            <span className="text-xs font-medium">គ្មានរូបភាពផលិតផល</span>
                        </div>
                    )}
                    
                    {categoryName && (
                        <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            {categoryName}
                        </span>
                    )}
                </div>

                {/* Content Info Side */}
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-6 overflow-y-auto">
                    
                    {/* Header Details */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <span className="text-[10px] font-mono tracking-wider text-slate-400 block uppercase mb-0.5">
                                    PRODUCT ID: #{id}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                                    {name}
                                </h2>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition font-bold text-sm cursor-pointer"
                                aria-label="Close modal"
                            >
                                X
                            </button>
                        </div>

                        {/* Price & Stock Display */}
                        <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-emerald-700/80 uppercase tracking-wider">តម្លៃលក់</p>
                                <p className="text-2xl font-black text-emerald-600 mt-0.5">
                                    ${Number(price).toFixed(2)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ចំនួនស្តុក</p>
                                <p className={`text-base font-bold mt-1 ${quantity > 0 ? 'text-slate-800' : 'text-red-500'}`}>
                                    {quantity > 0 ? `${quantity} គីឡូក្រាម` : 'អស់ពីស្តុក'}
                                </p>
                            </div>
                        </div>


                        <div className="space-y-1.5">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">ព័ត៌មានលម្អិតពីផលិតផល</h4>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-32 overflow-y-auto">
                                {description || "មិនមានការពិពណ៌នាបន្ថែមសម្រាប់កសិផលនេះទេ។"}
                            </p>
                        </div>

                   
                        {savedUser && savedUser.id !== farmerId && (
                            <button
                                onClick={() => setActiveChat(true)}
                                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white text-center py-3 rounded-xl font-bold text-sm shadow-sm transition active:scale-98 cursor-pointer"
                            >
                                ផ្ញើសារទៅកាន់អ្នកលក់
                            </button>
                        )}
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs mt-auto">
                        {farmerName && (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                                    {farmerName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-slate-400 font-medium text-[10px] uppercase">អ្នកផ្គត់ផ្គង់</p>
                                    <p className="font-bold text-slate-700">{farmerName}</p>
                                </div>
                            </div>
                        )}
                        
                        <button 
                            onClick={onClose}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer active:scale-98"
                        >
                            បិទផ្ទាំងនេះ
                        </button>
                    </div>

                </div>
            </div>
            {activeChat && (
                <ChatBox 
                    currentUserId={savedUser?.id}
                    receiverId={farmerId}
                    receiverName={farmerName}
                    onClose={() => setActiveChat(false)}
                />

            )}
        </div>
    );
};

export default ProductDetail;