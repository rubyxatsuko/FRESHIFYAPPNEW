import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.ts";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.log('Auth error:', error);
    return null;
  }
  
  return user;
}

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize default data (products and articles)
app.post("/init-data", async (c) => {
  try {
    // Check if data already exists
    const existingProducts = await kv.get('products');
    const existingArticles = await kv.get('articles');

    if (existingProducts && existingProducts.length > 0) {
      return c.json({ message: 'Data already initialized', products: existingProducts.length, articles: existingArticles?.length || 0 });
    }

    // Default products
    const defaultProducts = [
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

    // Default articles (simplified)
    const defaultArticles = [
      {
        id: 'article-1',
        title: 'Tren Cold-Pressed Juice 2025: Kenapa Jus Dingin Lebih Sehat?',
        excerpt: 'Teknologi cold-pressed menjadi standar baru industri jus sehat. Pelajari mengapa metode ini mempertahankan nutrisi hingga 5x lebih baik.',
        content: 'Tahun 2025, cold-pressed juice menjadi tren utama dalam industri kesehatan dengan pertumbuhan pasar global mencapai $8.1 miliar...',
        image: 'https://images.unsplash.com/photo-1587313170527-446f86d0c3d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyZWVuJTIwanVpY2UlMjB2ZWdldGFibGVzfGVufDF8fHx8MTc2MDY5OTU1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        date: '2025-10-15'
      },
      {
        id: 'article-2',
        title: 'Air Fryer 2025: Teknologi AI Untuk Masakan Sempurna',
        excerpt: 'Generasi terbaru air fryer dilengkapi AI sensor yang otomatis menyesuaikan suhu dan waktu. Hemat energi 70% dengan hasil lebih sehat!',
        content: 'Air fryer 2025 mengalami revolusi besar dengan integrasi Artificial Intelligence dan sensor smart cooking...',
        image: 'https://images.unsplash.com/photo-1695089028114-ce28248f0ab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXIlMjBmcnllciUyMGhlYWx0aHklMjBjb29raW5nfGVufDF8fHx8MTc2MDY5OTU1OHww&ixlib=rb-4.1.0&q=80&w=1080',
        date: '2025-10-12'
      }
    ];

    await kv.set('products', defaultProducts);
    await kv.set('articles', defaultArticles);

    return c.json({ 
      message: 'Data initialized successfully', 
      products: defaultProducts.length, 
      articles: defaultArticles.length 
    });
  } catch (error: any) {
    console.error('Init data error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============ AUTH ROUTES ============

app.post("/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    const role = email === 'admin@gmail.com' ? 'admin' : 'user';
    
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      created_at: new Date().toISOString()
    });

    return c.json({ 
      user: {
        id: data.user.id,
        email,
        name
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/auth/user", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const profile = await kv.get(`user:${user.id}`);
  
  if (!profile) {
    const role = user.email === 'admin@gmail.com' ? 'admin' : 'user';
    const profileData = {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.email!.split('@')[0],
      role,
      created_at: new Date().toISOString()
    };
    await kv.set(`user:${user.id}`, profileData);
    return c.json(profileData);
  }

  return c.json(profile);
});

// ============ CART ROUTES ============

app.get("/cart", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const cart = await kv.get(`cart:${user.id}`) || [];
  return c.json(cart);
});

app.post("/cart/add", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { productId, quantity = 1 } = await c.req.json();
    
    const cart = await kv.get(`cart:${user.id}`) || [];
    
    const existingIndex = cart.findIndex((item: any) => item.product_id === productId);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product_id: productId, quantity });
    }
    
    await kv.set(`cart:${user.id}`, cart);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Add to cart error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/cart/update", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { productId, quantity } = await c.req.json();
    
    let cart = await kv.get(`cart:${user.id}`) || [];
    
    if (quantity < 1) {
      cart = cart.filter((item: any) => item.product_id !== productId);
    } else {
      const itemIndex = cart.findIndex((item: any) => item.product_id === productId);
      if (itemIndex >= 0) {
        cart[itemIndex].quantity = quantity;
      }
    }
    
    await kv.set(`cart:${user.id}`, cart);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Update cart error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/cart/remove", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { productId } = await c.req.json();
    
    let cart = await kv.get(`cart:${user.id}`) || [];
    cart = cart.filter((item: any) => item.product_id !== productId);
    
    await kv.set(`cart:${user.id}`, cart);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Remove from cart error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/cart/clear", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  await kv.set(`cart:${user.id}`, []);
  return c.json({ success: true });
});

// ============ ORDER ROUTES ============

app.post("/orders", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { items, total } = await c.req.json();
    
    const orderId = crypto.randomUUID();
    const order = {
      id: orderId,
      user_id: user.id,
      user_email: user.email,
      items,
      total,
      status: 'processing',
      created_at: new Date().toISOString()
    };
    
    await kv.set(`order:${orderId}`, order);
    
    const userOrders = await kv.get(`user_orders:${user.id}`) || [];
    userOrders.unshift(orderId);
    await kv.set(`user_orders:${user.id}`, userOrders);
    
    await kv.set(`cart:${user.id}`, []);
    
    const totalCalories = items.reduce((sum: number, item: any) => {
      return sum + (item.calories * item.quantity);
    }, 0);
    
    const itemNames = items.map((item: any) => item.product_name);
    
    await logConsumption(user.id, totalCalories, itemNames, order.created_at);
    
    return c.json(order);
  } catch (error: any) {
    console.error('Create order error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/orders", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const orderIds = await kv.get(`user_orders:${user.id}`) || [];
    
    const orders = [];
    for (const orderId of orderIds) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        orders.push(order);
      }
    }
    
    return c.json(orders);
  } catch (error: any) {
    console.error('Get orders error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============ CONSUMPTION TRACKING ============

async function logConsumption(userId: string, calories: number, items: string[], orderDate?: string) {
  const date = orderDate ? orderDate.split('T')[0] : new Date().toISOString().split('T')[0];
  const key = `consumption:${userId}:${date}`;
  
  const existing = await kv.get(key);
  
  if (existing) {
    await kv.set(key, {
      date,
      calories: existing.calories + calories,
      items: [...existing.items, ...items]
    });
  } else {
    await kv.set(key, {
      date,
      calories,
      items
    });
  }
  
  const consumptionDatesKey = `consumption_dates:${userId}`;
  const dates = await kv.get(consumptionDatesKey) || [];
  if (!dates.includes(date)) {
    dates.push(date);
    dates.sort();
    await kv.set(consumptionDatesKey, dates);
  }
}

app.get("/consumption/weekly", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const today = new Date();
    const weeklyData = Array(7).fill(0);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const data = await kv.get(`consumption:${user.id}:${dateStr}`);
      if (data) {
        weeklyData[i] = data.calories;
      }
    }
    
    return c.json(weeklyData);
  } catch (error: any) {
    console.error('Get weekly consumption error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/consumption/all", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const consumptionDatesKey = `consumption_dates:${user.id}`;
    const dates = await kv.get(consumptionDatesKey) || [];
    
    const consumptionHistory = [];
    for (const date of dates) {
      const data = await kv.get(`consumption:${user.id}:${date}`);
      if (data) {
        consumptionHistory.push(data);
      }
    }
    
    consumptionHistory.sort((a: any, b: any) => b.date.localeCompare(a.date));
    
    return c.json(consumptionHistory);
  } catch (error: any) {
    console.error('Get consumption history error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============ ADMIN ROUTES ============

app.post("/admin/update-role", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { email, role } = await c.req.json();
    
    const currentProfile = await kv.get(`user:${user.id}`);
    
    if (currentProfile?.role !== 'admin' && user.email !== email) {
      return c.json({ error: 'Only admins can update roles' }, 403);
    }
    
    const allKeys = await kv.getByPrefix('user:');
    const targetUser = allKeys.find((u: any) => u.email === email);
    
    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    await kv.set(`user:${targetUser.id}`, {
      ...targetUser,
      role
    });
    
    console.log(`Role updated for ${email} to ${role}`);
    
    return c.json({ 
      success: true, 
      message: `Role updated to ${role} for ${email}` 
    });
  } catch (error: any) {
    console.error('Update role error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/admin/users", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }
    
    const users = await kv.getByPrefix('user:');
    
    return c.json(users);
  } catch (error: any) {
    console.error('Get users error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============ PUBLIC PRODUCTS & ARTICLES ============

app.get("/products", async (c) => {
  try {
    const products = await kv.get('products') || [];
    return c.json(products);
  } catch (error: any) {
    console.error('Get products error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/articles", async (c) => {
  try {
    const articles = await kv.get('articles') || [];
    return c.json(articles);
  } catch (error: any) {
    console.error('Get articles error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============ ADMIN PRODUCTS ============

app.get("/admin/products", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const products = await kv.get('products') || [];
    return c.json(products);
  } catch (error: any) {
    console.error('Get products error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/admin/products", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const productData = await c.req.json();
    const products = await kv.get('products') || [];
    
    const newProduct = {
      id: `product-${crypto.randomUUID()}`,
      ...productData,
      created_at: new Date().toISOString()
    };

    products.push(newProduct);
    await kv.set('products', products);

    return c.json(newProduct);
  } catch (error: any) {
    console.error('Create product error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/admin/products/:id", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const productId = c.req.param('id');
    const productData = await c.req.json();
    const products = await kv.get('products') || [];
    
    const index = products.findIndex((p: any) => p.id === productId);
    if (index === -1) {
      return c.json({ error: 'Product not found' }, 404);
    }

    products[index] = {
      ...products[index],
      ...productData,
      updated_at: new Date().toISOString()
    };

    await kv.set('products', products);
    return c.json(products[index]);
  } catch (error: any) {
    console.error('Update product error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/admin/products/:id", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const productId = c.req.param('id');
    const products = await kv.get('products') || [];
    
    const filteredProducts = products.filter((p: any) => p.id !== productId);
    await kv.set('products', filteredProducts);

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============ ADMIN ARTICLES ============

app.get("/admin/articles", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const articles = await kv.get('articles') || [];
    return c.json(articles);
  } catch (error: any) {
    console.error('Get articles error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/admin/articles", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const articleData = await c.req.json();
    const articles = await kv.get('articles') || [];
    
    const newArticle = {
      id: `article-${crypto.randomUUID()}`,
      ...articleData,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    articles.push(newArticle);
    await kv.set('articles', articles);

    return c.json(newArticle);
  } catch (error: any) {
    console.error('Create article error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/admin/articles/:id", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const articleId = c.req.param('id');
    const articleData = await c.req.json();
    const articles = await kv.get('articles') || [];
    
    const index = articles.findIndex((a: any) => a.id === articleId);
    if (index === -1) {
      return c.json({ error: 'Article not found' }, 404);
    }

    articles[index] = {
      ...articles[index],
      ...articleData,
      updated_at: new Date().toISOString()
    };

    await kv.set('articles', articles);
    return c.json(articles[index]);
  } catch (error: any) {
    console.error('Update article error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/admin/articles/:id", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const articleId = c.req.param('id');
    const articles = await kv.get('articles') || [];
    
    const filteredArticles = articles.filter((a: any) => a.id !== articleId);
    await kv.set('articles', filteredArticles);

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Delete article error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============ ADMIN ORDERS ============

app.get("/admin/orders", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const allOrders = await kv.getByPrefix('order:');
    return c.json(allOrders);
  } catch (error: any) {
    console.error('Get all orders error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/admin/orders/:id/status", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const profile = await kv.get(`user:${user.id}`);
    if (profile?.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const orderId = c.req.param('id');
    const { status } = await c.req.json();
    
    const order = await kv.get(`order:${orderId}`);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const updatedOrder = {
      ...order,
      status,
      updated_at: new Date().toISOString()
    };

    await kv.set(`order:${orderId}`, updatedOrder);
    return c.json(updatedOrder);
  } catch (error: any) {
    console.error('Update order status error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============ SCAN HISTORY ============

app.post("/scan", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { productId, barcode } = await c.req.json();
    
    const scanId = crypto.randomUUID();
    const scan = {
      id: scanId,
      user_id: user.id,
      product_id: productId,
      barcode,
      scanned_at: new Date().toISOString()
    };
    
    await kv.set(`scan:${scanId}`, scan);
    
    const scanHistory = await kv.get(`scan_history:${user.id}`) || [];
    scanHistory.unshift(scanId);
    if (scanHistory.length > 20) {
      scanHistory.pop();
    }
    await kv.set(`scan_history:${user.id}`, scanHistory);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Log scan error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/scan/history", async (c) => {
  const user = await verifyUser(c.req.header('Authorization'));
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const scanIds = await kv.get(`scan_history:${user.id}`) || [];
    
    const scans = [];
    for (const scanId of scanIds.slice(0, 10)) {
      const scan = await kv.get(`scan:${scanId}`);
      if (scan) {
        scans.push(scan);
      }
    }
    
    return c.json(scans);
  } catch (error: any) {
    console.error('Get scan history error:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);
