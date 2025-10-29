import { products } from "../data/product.js";

let cart = [];

export const getCart = (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({ items: cart, total });
};

export const addToCart = (req, res) => {
  const { productId, qty } = req.body;
  const product = products.find((p) => p.id === productId);

  if (!product) return res.status(404).json({ error: "Product not found" });

  const existing = cart.find((i) => i.id === productId);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, qty });

  res.json(cart);
};

export const removeFromCart = (req, res) => {
  const { id } = req.params;
  cart = cart.filter((item) => item.id !== id);
  res.json(cart);
};

export const checkout = (req, res) => {
  console.log("Orders so far:", orders);
  const { cartItems } = req.body;
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const receipt = {
    total,
    timestamp: new Date().toISOString(),
  };
  cart = [];
  res.json(receipt);
};
