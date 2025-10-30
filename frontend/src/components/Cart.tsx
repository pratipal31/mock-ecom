// src/components/Cart.tsx
import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from './CartContext';

interface CartProps {
  onBackClick: () => void;
}

const Cart = ({ onBackClick }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button 
            onClick={onBackClick}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={onBackClick} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">{getTotalItems()} items</p>
            </div>
          </div>
          <button onClick={clearCart} className="text-red-600 hover:text-red-700 font-medium text-sm">
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.qty - 1)} 
                        className="p-1 hover:bg-white rounded"
                      >
                        <Minus className="h-4 w-4 text-gray-700" />
                      </button>
                      <span className="font-medium w-8 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.qty + 1)} 
                        className="p-1 hover:bg-white rounded"
                      >
                        <Plus className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition mb-3">
                Proceed to Checkout
              </button>
              <button onClick={onBackClick} className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;