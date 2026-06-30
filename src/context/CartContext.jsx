import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart data from localStorage if it exists
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("local_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Keep localStorage updated whenever the cart items change
  useEffect(() => {
    localStorage.setItem("local_cart", JSON.stringify(cart));
  }, [cart]);

  // Standardized Add To Cart Function
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  // Change quantity (+1 or -1) or remove item if qty drops below 1
  const updateQty = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            return { ...item, qty: item.qty + amount };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.error("useCart must be used within a CartProvider");
  }
  return context;
};