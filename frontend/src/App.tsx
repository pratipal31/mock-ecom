import React, { useState } from "react";
import { ShoppingBag, Check, ShoppingCart } from "lucide-react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import type { CartItem, Product, Receipt } from "./types";

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const products: Product[] = [
    { id: "1", name: "Aloo Paratha", price: 80 },
    { id: "2", name: "Paneer Butter Masala", price: 180 },
    { id: "3", name: "Chicken Biryani", price: 220 },
    { id: "4", name: "Dosa", price: 100 },
    { id: "5", name: "Pasta Primavera", price: 150 },
    { id: "6", name: "Butter Chicken", price: 240 },
  ];

  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    let updatedCart: CartItem[];

    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, qty: 1 }];
    }

    setCart(updatedCart);
  };

  const handleRemove = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const handleCheckoutSuccess = (data: Receipt) => {
    setReceipt(data);
    setCart([]);
    setShowCheckout(false);
    setTimeout(() => setReceipt(null), 5000);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag size={32} />
              <h1 className="text-3xl font-bold">FoodieCart</h1>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <ShoppingCart size={20} />
              <span className="font-semibold">{cartItemCount}</span>
            </div>
          </div>
        </div>
      </header>

      <ProductList products={products} onAddToCart={handleAddToCart} />
      
      {cart.length > 0 && (
        <Cart
          cart={cart}
          onRemove={handleRemove}
          onUpdateQty={handleUpdateQty}
          onCheckout={() => setShowCheckout(true)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {receipt && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white p-6 rounded-xl shadow-2xl max-w-sm z-50">
          <div className="flex items-start gap-3">
            <div className="bg-white rounded-full p-2">
              <Check className="text-green-500" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Order Confirmed! 🎉</h3>
              <p className="text-green-100 text-sm">
                Total: ₹{receipt.total}
              </p>
              <p className="text-green-100 text-xs mt-1">
                {new Date(receipt.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;