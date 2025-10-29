import { useEffect, useState } from "react";
import type { Product } from "../types";

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductList({ onAddToCart }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border p-4 rounded-xl shadow hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-500">₹{product.price}</p>
          <button
            className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
