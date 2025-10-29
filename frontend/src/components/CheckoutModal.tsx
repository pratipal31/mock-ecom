import React, { useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import type { CartItem, Receipt } from "../types";

interface Props {
  cart: CartItem[];
  onClose: () => void;
  onSuccess: (receipt: Receipt) => void;
}

const CheckoutModal: React.FC<Props> = ({ cart, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onSuccess({
        total,
        timestamp: new Date().toISOString(),
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingBag size={28} />
              Checkout
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Order Total:</span>
              <span className="text-2xl font-bold text-orange-600">
                ₹{total}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;