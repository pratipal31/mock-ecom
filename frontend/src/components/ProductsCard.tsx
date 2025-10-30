import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Minus, Heart, Star } from 'lucide-react';
import { useCart } from './CartContext';
import type { Product } from './CartContext';

const ProductsCard = () => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from your backend (SQLite)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products2');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => addToCart(product);

  const handleIncrement = (product: Product) => {
    const currentQty = getItemQuantity(product.id);
    updateQuantity(product.id, currentQty + 1);
  };

  const handleDecrement = (product: Product) => {
    const currentQty = getItemQuantity(product.id);
    if (currentQty > 0) updateQuantity(product.id, currentQty - 1);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading products...</p>
      </div>
    );
  }

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
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
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
                      className={`h-5 w-5 ${
                        favorites.includes(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                  <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded">
                    {product.category}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {product.rating ?? 'N/A'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviews ?? 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
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
                      <span className="font-semibold text-gray-900">
                        {quantity} in cart
                      </span>
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
