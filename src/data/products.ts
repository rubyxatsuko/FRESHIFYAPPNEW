import { Product } from '../types';

export const products: Product[] = [
  // Minuman - Juicy Balance
  {
    id: 'juice-1',
    name: 'Tropical Glow',
    category: 'minuman',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1642094001815-d8a0274223a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzYwNjIzNDU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Jus segar dari mangga, nanas, dan jeruk dengan sentuhan madu alami. Memberikan energi dan vitamin C untuk kulit bercahaya.',
    nutrition: {
      calories: 120,
      protein: 2,
      fat: 0.5,
      fiber: 3,
      sugar: 18,
      vitamins: ['Vitamin C', 'Vitamin A', 'Vitamin B6']
    },
    ingredients: ['Mangga', 'Nanas', 'Jeruk', 'Madu'],
    barcode: '8992761001234'
  },
  {
    id: 'juice-2',
    name: 'Green Boost',
    category: 'minuman',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1601091566377-17adfa2fa02e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHZlZ2V0YWJsZSUyMGp1aWNlfGVufDF8fHx8MTc2MDYyMzQ1NHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Kombinasi sempurna bayam, seledri, apel hijau dan lemon. Kaya antioksidan dan detoksifikasi alami.',
    nutrition: {
      calories: 95,
      protein: 3,
      fat: 0.3,
      fiber: 4,
      sugar: 12,
      vitamins: ['Vitamin K', 'Vitamin C', 'Folat', 'Zat Besi']
    },
    ingredients: ['Bayam', 'Seledri', 'Apel Hijau', 'Lemon', 'Stevia'],
    barcode: '8992761001241'
  },
  {
    id: 'juice-3',
    name: 'Berry Shield',
    category: 'minuman',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJyeSUyMHNtb290aGllfGVufDF8fHx8MTc2MDU2OTA0NXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Perpaduan strawberry, blueberry, dan raspberry yang kaya antioksidan untuk meningkatkan sistem imun.',
    nutrition: {
      calories: 110,
      protein: 2,
      fat: 0.4,
      fiber: 5,
      sugar: 15,
      vitamins: ['Vitamin C', 'Vitamin K', 'Mangan']
    },
    ingredients: ['Strawberry', 'Blueberry', 'Raspberry', 'Madu'],
    barcode: '8992761001258'
  },
  // Makanan - Fit Bites
  {
    id: 'food-1',
    name: 'Kroket Tahu Bayam',
    category: 'makanan',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1741542164748-89ecfceb6f94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwY3JvcXVldHRlJTIwc25hY2t8ZW58MXx8fHwxNzYwNjIzNDU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Kroket renyah dengan isian tahu dan bayam, dimasak menggunakan air fryer tanpa minyak. Tinggi protein dan rendah lemak.',
    nutrition: {
      calories: 150,
      protein: 8,
      fat: 4,
      fiber: 4,
      sugar: 2,
      vitamins: ['Vitamin A', 'Vitamin K', 'Kalsium', 'Zat Besi']
    },
    ingredients: ['Tahu', 'Bayam', 'Tepung Oat', 'Bawang Putih', 'Merica'],
    barcode: '8992761002001'
  },
  {
    id: 'food-2',
    name: 'Kroket Ayam Oatmeal',
    category: 'makanan',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1760445278086-d26317282e10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMHByZXBhcmF0aW9ufGVufDF8fHx8MTc2MDUzNTU2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Kroket ayam dengan lapisan oatmeal yang kaya serat. Sempurna untuk camilan sehat tinggi protein.',
    nutrition: {
      calories: 180,
      protein: 12,
      fat: 5,
      fiber: 3,
      sugar: 1,
      vitamins: ['Vitamin B6', 'Niasin', 'Selenium']
    },
    ingredients: ['Daging Ayam', 'Tepung Oat', 'Wortel', 'Bawang Bombay', 'Bumbu Alami'],
    barcode: '8992761002018'
  },
  {
    id: 'food-3',
    name: 'Kroket Ubi Isi Sayur',
    category: 'makanan',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1705322149807-f5ef99a313f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwanVpY2UlMjBkcmluayUyMGdsYXNzfGVufDF8fHx8MTc2MDYyMzQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Kroket berbasis ubi jalar dengan isian sayuran beragam. Sumber karbohidrat kompleks dan vitamin A.',
    nutrition: {
      calories: 140,
      protein: 4,
      fat: 3,
      fiber: 5,
      sugar: 6,
      vitamins: ['Vitamin A', 'Vitamin C', 'Mangan', 'Potasium']
    },
    ingredients: ['Ubi Jalar', 'Brokoli', 'Jagung', 'Wortel', 'Tepung Oat'],
    barcode: '8992761002025'
  }
];
