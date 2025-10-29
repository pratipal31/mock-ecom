import React from "react";
import { ShoppingBag, ShoppingCart, Minus, Plus, X } from "lucide-react";
import type { CartItem } from "../types";

interface Props {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<Props> = ({ cart, onRemove, onUpdateQty, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="text-orange-500" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <p className="text-gray-400 text-sm mt-2">
              Add some delicious items to get started!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mt-1">₹{item.price} each</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2 py-1">
                      <button
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="text-gray-600 hover:text-orange-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.qty <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold text-gray-800 w-8 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="text-gray-600 hover:text-orange-500 p-1"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <span className="font-bold text-gray-800 w-20 text-right">
                      ₹{item.price * item.qty}
                    </span>

                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-700">
                  Total Amount:
                </span>
                <span className="text-3xl font-bold text-orange-600">
                  ₹{total}
                </span>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;