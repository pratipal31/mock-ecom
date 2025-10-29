import { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import type { Product, CartItem, Receipt } from "./types";

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart");
      const data = await res.json();
      setCartItems(data.items);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Add product to cart
  const handleAddToCart = async (product: Product) => {
    try {
      await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, qty: 1 }),
      });
      fetchCart(); // refresh cart
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Checkout success handler
  const handleCheckoutSuccess = (data: Receipt) => {
    setReceipt(data);
    setCartItems([]);
    setShowCheckout(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700">🛒 Mock E-Com Cart</h1>
        <p className="text-gray-600">Add, remove, and checkout mock products</p>
      </header>

      <main className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ProductList onAddToCart={handleAddToCart} />
        </div>
        <div>
          <Cart onCheckout={() => setShowCheckout(true)} />
        </div>
      </main>

      {/* Checkout modal */}
      {showCheckout && (
        <CheckoutModal
          cartItems={cartItems}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Receipt</h2>
            <p>Total: ₹{receipt.total}</p>
            <p>Date: {new Date(receipt.timestamp).toLocaleString()}</p>
            <button
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md"
              onClick={() => setReceipt(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
