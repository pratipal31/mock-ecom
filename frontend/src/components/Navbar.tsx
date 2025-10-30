import React from 'react';
import { ShoppingCart, Search, Heart, User, Home, Package } from 'lucide-react';
import { useCart } from './CartContext';

interface NavbarProps {
  onCartClick: () => void;
  onProductsClick: () => void;
}

const Navbar = ({ onCartClick, onProductsClick }: NavbarProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center cursor-pointer" onClick={onProductsClick}>
              <div className="bg-gray-800 text-white font-bold text-xl px-3 py-1 rounded">
                M
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">Mock-Ecom</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={onProductsClick}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>
            <button 
              onClick={onProductsClick}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <Package className="h-5 w-5" />
              <span>Products</span>
            </button>
            <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              About
            </a>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="h-5 w-5" />
            </button>
            
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-gray-800 text-white text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;