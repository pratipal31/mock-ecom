import { useState } from "react";
import type { CartItem, Receipt } from "../types";

interface CheckoutModalProps {
  cartItems: CartItem[];
  onClose: () => void;
  onSuccess: (receipt: Receipt) => void;
}

export default function CheckoutModal({
  cartItems,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems }),
      });
      const data = await res.json();
      onSuccess(data);
    } catch (err) {
      console.error("Checkout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            placeholder="Name"
            className="border p-2 rounded"
            onChange={handleChange}
            value={form.name}
          />
          <input
            name="email"
            placeholder="Email"
            className="border p-2 rounded"
            onChange={handleChange}
            value={form.email}
          />
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Checkout"}
          </button>
        </form>
        <button className="text-red-500 mt-3" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
