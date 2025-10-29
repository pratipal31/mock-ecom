export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Receipt {
  total: number;
  timestamp: string;
}