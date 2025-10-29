import React from "react";
import { Plus } from "lucide-react";
import type { Product } from "../types";

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<Props> = ({ products, onAddToCart }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
              <span className="text-6xl">🍽️</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {p.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">
                  ₹{p.price}
                </span>
                <button
                  onClick={() => onAddToCart(p)}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;