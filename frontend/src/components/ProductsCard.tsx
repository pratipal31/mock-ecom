import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Heart, Star } from 'lucide-react';
import { useCart} from './CartContext';
import type { Product } from './CartContext';

const ProductsCard = () => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const [favorites, setFavorites] = useState<number[]>([]);

  const products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 128,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 256,
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Running Shoes',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 189,
      category: 'Fashion'
    },
    {
      id: 4,
      name: 'Coffee Maker',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop',
      rating: 4.4,
      reviews: 94,
      category: 'Home'
    },
    {
      id: 5,
      name: 'Laptop Backpack',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 312,
      category: 'Accessories'
    },
    {
      id: 6,
      name: 'Desk Lamp',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
      rating: 4.3,
      reviews: 76,
      category: 'Home'
    }
  ];

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleIncrement = (product: Product) => {
    const currentQty = getItemQuantity(product.id);
    updateQuantity(product.id, currentQty + 1);
  };

  const handleDecrement = (product: Product) => {
    const currentQty = getItemQuantity(product.id);
    if (currentQty > 0) {
      updateQuantity(product.id, currentQty - 1);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our amazing collection of products</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const quantity = getItemQuantity(product.id);
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Image Container */}
                <div className="relative h-64 bg-gray-100 overflow-hidden group">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart 
                      className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                  </button>
                  <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded">
                    {product.category}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium text-gray-700">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  </div>

                  {/* Add to Cart Section */}
                  {quantity === 0 ? (
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                      <button 
                        onClick={() => handleDecrement(product)}
                        className="p-2 bg-white rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-700" />
                      </button>
                      <span className="font-semibold text-gray-900">{quantity} in cart</span>
                      <button 
                        onClick={() => handleIncrement(product)}
                        className="p-2 bg-white rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;