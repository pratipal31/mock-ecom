import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductsCard from './components/ProductsCard';
import Cart from './components/Cart';
import { CartProvider } from './components/CartContext';

type Page = 'products' | 'cart';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('products');

  const handleCartClick = () => {
    setCurrentPage('cart');
  };

  const handleProductsClick = () => {
    setCurrentPage('products');
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          onCartClick={handleCartClick} 
          onProductsClick={handleProductsClick}
        />
        
        {currentPage === 'products' ? (
          <ProductsCard />
        ) : (
          <Cart onBackClick={handleProductsClick} />
        )}
      </div>
    </CartProvider>
  );
};

export default App;