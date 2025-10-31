// src/components/Cart.tsx
import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { useCart } from './CartContext';
import type { CheckoutReceipt } from './CartContext';

interface CartProps {
  onBackClick: () => void;
}

const Cart = ({ onBackClick }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice, checkout } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [receipt, setReceipt] = useState<CheckoutReceipt | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const receiptData = await checkout();
    setIsCheckingOut(false);
    
    if (receiptData) {
      setReceipt(receiptData);
      setShowReceipt(true);
    } else {
      alert('Checkout failed. Please try again.');
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setReceipt(null);
    onBackClick(); // Go back to products after viewing receipt
  };

  if (cartItems.length === 0 && !showReceipt) {
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

  // Receipt Modal
  if (showReceipt && receipt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
                  <p className="text-sm text-gray-600">Thank you for your purchase</p>
                </div>
              </div>
              <button 
                onClick={handleCloseReceipt}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order ID</p>
                  <p className="font-semibold text-gray-900">{receipt.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">{receipt.date}</p>
                </div>
                <div>
                  <p className="text-gray-600">Items</p>
                  <p className="font-semibold text-gray-900">{receipt.itemCount} items</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-semibold text-green-600 capitalize">{receipt.status}</p>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {receipt.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${item.itemTotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${receipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${receipt.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>${receipt.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button 
                onClick={handleCloseReceipt}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => window.print()}
                className="px-6 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Print Receipt
              </button>
            </div>
          </div>
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

              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
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