export interface Product {
  id: string;
  name: string;
  category: 'minuman' | 'makanan';
  price: number;
  image: string;
  description: string;
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    fiber: number;
    sugar: number;
    vitamins: string[];
  };
  ingredients: string[];
  barcode?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'completed';
  paymentMethod?: string;
  paymentDetails?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  weeklyConsumption: {
    date: string;
    calories: number;
    items: string[];
  }[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
}
