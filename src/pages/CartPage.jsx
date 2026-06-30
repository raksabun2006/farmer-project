import { useNavigate } from "react-router-dom"; 
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; 

const CartPage = () => {
  const { cart, updateQty } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Flow Step 2: Buy Now / Finalize Checkout order creation
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

    const orderData = {
      customerId: user.id || user.userId, 
      items: cart.map(i => ({ 
        productId: i.id, 
        quantity: i.qty, 
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
        // Safe check: clears cart local state if function exists in your context
        // clearCart(); 
        navigate(`/order-confirmation/${data.id}`);
      } else {
        alert("បរាជ័យក្នុងការបញ្ជាទិញ: " + (data.message || "សូមពិនិត្យទិន្នន័យឡើងវិញ"));
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("មិនអាចតភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេបានទេ។");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-2xl mt-10">
      <h1 className="text-2xl font-black mb-6">កន្ត្រកទំនិញ (Checkout)</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          មិនមានទំនិញនៅក្នុងកន្ត្រកនៅឡើយទេ។
        </div>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center py-4 border-b">
              <span className="font-medium text-slate-800">{item.name}</span>
              <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-lg">
                <button 
                  type="button" 
                  className="px-2 font-bold hover:text-red-500" 
                  onClick={() => updateQty(item.id, -1)}
                >
                  -
                </button>
                <span className="font-bold w-4 text-center">{item.qty}</span>
                <button 
                  type="button" 
                  className="px-2 font-bold hover:text-emerald-600" 
                  onClick={() => updateQty(item.id, 1)}
                >
                  +
                </button>
              </div>
              <span className="font-bold text-slate-900">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          
          <button 
            onClick={handleFinalCheckout} 
            className="w-full bg-emerald-700 hover:bg-emerald-600 transition text-white py-3 rounded-xl mt-6 font-bold cursor-pointer"
          >
            ទិញឥឡូវនេះ (សរុប: ${total.toFixed(2)})
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;