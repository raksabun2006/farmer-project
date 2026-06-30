import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const CartPage = () => {
  const { cart, updateQty, clearCart } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const deliveryFee = subtotal > 0 ? 1.50 : 0; 
  const total = subtotal + deliveryFee;

  const handleFinalCheckout = async () => {
    if (!user) {
      alert("សូមចូលក្នុងប្រព័ន្ធជាមុនសិន!");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("កន្ត្រកទំនិញរបស់អ្នកទទេស្អាត។");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customerId: user.id || user.userId, 
      items: cart.map(i => ({ 
        productId: i.id, 
        quantity: i.qty || 1, 
        price: i.price 
      }))
    };

    try {
      const res = await fetch("http://localhost:2829/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (res.ok) {
        if (clearCart) clearCart(); 
        navigate(`/order-confirmation/${data.id || ""}`);
      } else {
        alert("បរាជ័យក្នុងការបញ្ជាទិញ: " + (data.message || "សូមពិនិត្យទិន្នន័យឡើងវិញ"));
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("មិនអាចតភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេបានទេ។");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans min-h-[70vh]">
      <h1 className="text-3xl font-black text-slate-800 mb-8 border-b border-slate-100 pb-4">
        ពិនិត្យកន្ត្រកទំនិញ <span className="text-emerald-600 text-lg font-bold">({cart.length} មុខ)</span>
      </h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 shadow-sm rounded-3xl max-w-md mx-auto p-8 space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">កន្ត្រកទំនិញរបស់អ្នកទទេស្អាត</h3>
            <p className="text-slate-400 text-sm">មិនទាន់មានទំនិញនៅក្នុងកន្ត្រករបស់អ្នកនៅឡើយទេ។</p>
          </div>
          <Link 
            to="/" 
            className="inline-block bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-md"
          >
            ទៅកាន់ទំព័រដើម
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Items List */}
          <div className="lg:col-span-2 bg-white border border-slate-100 shadow-md rounded-3xl p-6 md:p-8 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-slate-50 last:border-0 gap-4">
                
                {/* Item Info with Rendered Image */}
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-800 text-base mb-1 line-clamp-1">{item.name}</h4>
                    <span className="text-xs text-slate-400 font-semibold block">តម្លៃរាយ: ${Number(item.price).toFixed(2)}</span>
                  </div>
                </div>

                {/* Counter & Price Controls */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-8 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl shadow-inner">
                    <button 
                      type="button" 
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-slate-600 hover:text-red-500 hover:bg-red-50/20 active:scale-95 transition text-base" 
                      onClick={() => updateQty(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="font-extrabold w-8 text-center text-slate-800 text-sm">{item.qty || 1}</span>
                    <button 
                      type="button" 
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/20 active:scale-95 transition text-base" 
                      onClick={() => updateQty(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-black text-slate-900 text-lg min-w-[70px] text-right">
                    ${(item.price * (item.qty || 1)).toFixed(2)}
                  </span>
                </div>

              </div>
            ))}
          </div>
          
          {/* Right Column: Pricing Invoice Summary Card */}
          <div className="bg-white border border-slate-100 shadow-md rounded-3xl p-6 md:p-8 space-y-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-black text-slate-800 border-b border-slate-50 pb-3">
              ព័ត៌មានការទូទាត់
            </h3>
            
            <div className="space-y-4 text-sm font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>តម្លៃសរុបទំនិញ</span>
                <span className="text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>ថ្លៃសេវាដឹកជញ្ជូន</span>
                <span className="text-slate-800">${deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center">
                <span className="text-base text-slate-800 font-bold">ទឹកប្រាក់សរុប</span>
                <span className="text-2xl font-black text-emerald-600">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleFinalCheckout} 
              disabled={isSubmitting}
              className={`w-full text-white py-4 rounded-2xl font-black transition-all shadow-md transform active:scale-95 flex items-center justify-center gap-2 text-base select-none ${
                isSubmitting 
                  ? "bg-slate-300 cursor-not-allowed text-slate-500" 
                  : "bg-emerald-800 hover:bg-emerald-700 cursor-pointer hover:shadow-xl shadow-emerald-800/10"
              }`}
            >
              {isSubmitting ? (
                <span className="animate-pulse">កំពុងដំណើរការបញ្ជាទិញ...</span>
              ) : (
                <span>ទិញឥឡូវនេះ</span>
              )}
            </button>
            
            <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed">
              រាល់ការចុចបញ្ជាទិញ លោកអ្នកនឹងយល់ព្រមទៅលើលក្ខខណ្ឌសេវាកម្មទិញទំនិញរបស់យើងខ្ញុំ។
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;