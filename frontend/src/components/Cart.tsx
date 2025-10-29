import { useEffect, useState } from "react";
import type { CartItem } from "../types";

interface CartProps {
  onCheckout: () => void;
}

export default function Cart({ onCheckout }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    const res = await fetch("http://localhost:5000/api/cart");
    const data = await res.json();
    setCartItems(data.items);
    setTotal(data.total);
  };

  const removeItem = async (id: string) => {
    await fetch(`http://localhost:5000/api/cart/${id}`, { method: "DELETE" });
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₹{item.price * item.qty}</span>
              <button
                className="text-red-500"
                onClick={() => removeItem(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
          <div className="font-semibold mt-4">Total: ₹{total}</div>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
            onClick={onCheckout}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
