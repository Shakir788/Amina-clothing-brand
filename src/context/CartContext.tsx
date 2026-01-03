"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Product ka type define kar rahe hain
type CartItem = {
  id: string;
  name: string; // English name store karenge simplicity ke liye
  price: string;
  image: string;
  slug: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any, lang: string) => void;
  removeFromCart: (id: string) => void;
  toggleCart: () => void;
  isCartOpen: boolean;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // LocalStorage se purana cart load karo (Agar user wapas aaye)
  useEffect(() => {
    const savedCart = localStorage.getItem("amina-cart");
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  // Jab bhi cart change ho, save kar lo
  useEffect(() => {
    localStorage.setItem("amina-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any, lang: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      
      // Agar item pehle se hai, to quantity badha do
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      // Naya item add karo
      // Note: Hum price string "450 DHS" se number nikal rahe hain calculation ke liye
      return [...currentItems, {
        id: product.id,
        name: product.name.en || product.name, // Hamesha English naam save karenge logic ke liye
        price: product.price,
        image: product.image,
        slug: product.slug,
        quantity: 1
      }];
    });
    setIsCartOpen(true); // Cart khul jaye add karte hi
  };

  const removeFromCart = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Total Price Calculate karna (Thoda tricky kyunki price text mein hai "450 DHS")
  const cartTotal = items.reduce((total, item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    return total + (priceNum * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, toggleCart, isCartOpen, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}