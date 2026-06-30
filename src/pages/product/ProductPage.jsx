import { useState, useEffect } from 'react';
import HeroSection from '../../components/HeroSection';
import ProductDetail from './ProductDetail'; 
import { useNavigate } from 'react-router-dom'; // Changed to match project navigation standard
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:2829/api/v1/products")
            .then(res => res.json())
            .then(data => setProducts(data || []))
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    const handleQuickAddToCart = (product) => {
        if (!user) {
            alert("សូមចូលក្នុងប្រព័ន្ធជាមុនសិន ដើម្បីធ្វើការបញ្ជាទិញ។");
            navigate("/login");
            return;
        }

        // Add item using identical object schema mapped by your Cart Context
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image // Sends the image asset to render inside the Cart Page row items
        });

        // Instantly redirect client to your summary view
        navigate("/cart");
    };

    const filteredProducts = products.filter(p => 
        p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-8">
            <HeroSection />
            <h1 className="text-3xl font-bold mb-8">ផលិតផលទាំងអស់</h1>
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="ស្វែងរកផលិតផល..."
                    className="w-full md:w-1/3 p-3 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Products Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(p => (
                    <div key={p.id} className="border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-lg transition flex flex-col justify-between bg-white">
                        <div>
                            <img src={p.image || "https://placehold.co/400x300?text=No+Image"} alt={p.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                            <h2 className="font-bold text-lg line-clamp-1 text-slate-800">{p.name}</h2>
                            <p className="text-emerald-600 font-black text-xl mt-1">${Number(p.price).toFixed(2)}</p>
                        </div>
                        
                        {/* Split Action Footer Buttons */}
                        <div className="flex gap-2 mt-4">
                            <button 
                                type="button"
                                onClick={() => setSelectedProduct(p)}
                                className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                            >
                                លម្អិត
                            </button>
                            
                            <button 
                                type="button"
                                onClick={() => handleQuickAddToCart(p)}
                                className="flex-1 text-center bg-emerald-800 hover:bg-amber-500 text-white hover:text-slate-950 py-2.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.119-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                កុម្ម៉ង់ទិញ
                            </button>
                        </div>
                    
                    </div>
                ))}
            </div>
            
            {/* Show message if no products match */}
            {filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 mt-10">មិនមានផលិតផលដែលអ្នកស្វែងរកទេ។</p>
            )}

            {/* Dynamic Product Detail Modal Context Trigger */}
            {selectedProduct && (
                <ProductDetail 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                />
            )}
        </div>
    );
};

export default ProductsPage;