import { CartItem, Order } from "../types";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { getAccessToken } from "./auth";
import { products as localProducts } from "../data/products";

/**
 * Supabase Database Module for Freshify
 *
 * MOCK MODE: Uses localStorage for development
 * Replace with actual API calls when deploying
 */

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server`;
const USE_MOCK = true; // Set to false when backend is ready

// Helper to get headers with auth token
async function getHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();

  if (!token) {
    console.warn("No access token available. User may not be authenticated.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    apikey: publicAnonKey,
  };
}

// ==================== MOCK STORAGE HELPERS ====================

function getMockCart(userId: string): CartItem[] {
  try {
    const cartData = localStorage.getItem(`freshify_cart_${userId}`);
    if (!cartData) return [];

    const cartItems = JSON.parse(cartData);
    // Ensure products are properly hydrated
    return cartItems
      .map((item: any) => ({
        product:
          localProducts.find((p) => p.id === item.productId) || item.product,
        quantity: item.quantity,
      }))
      .filter((item: CartItem) => item.product);
  } catch (error) {
    console.error("Error reading mock cart:", error);
    return [];
  }
}

function setMockCart(userId: string, items: CartItem[]): void {
  try {
    const cartData = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    localStorage.setItem(`freshify_cart_${userId}`, JSON.stringify(cartData));
  } catch (error) {
    console.error("Error saving mock cart:", error);
  }
}

function getMockOrders(userId: string): Order[] {
  try {
    const ordersData = localStorage.getItem(`freshify_orders_${userId}`);
    if (!ordersData) return [];

    const orders = JSON.parse(ordersData);
    // Ensure products are properly hydrated
    return orders.map((order: any) => ({
      ...order,
      items: order.items
        .map((item: any) => ({
          product:
            localProducts.find(
              (p) => p.id === item.product?.id || item.productId
            ) || item.product,
          quantity: item.quantity,
        }))
        .filter((item: CartItem) => item.product),
    }));
  } catch (error) {
    console.error("Error reading mock orders:", error);
    return [];
  }
}

function setMockOrders(userId: string, orders: Order[]): void {
  try {
    localStorage.setItem(`freshify_orders_${userId}`, JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving mock orders:", error);
  }
}

function getMockConsumption(userId: string): number[] {
  try {
    const consumptionData = localStorage.getItem(
      `freshify_consumption_${userId}`
    );
    if (!consumptionData) return Array(7).fill(0);

    const consumption = JSON.parse(consumptionData);
    return Array.isArray(consumption) && consumption.length === 7
      ? consumption
      : Array(7).fill(0);
  } catch (error) {
    console.error("Error reading mock consumption:", error);
    return Array(7).fill(0);
  }
}

function setMockConsumption(userId: string, consumption: number[]): void {
  try {
    localStorage.setItem(
      `freshify_consumption_${userId}`,
      JSON.stringify(consumption)
    );
  } catch (error) {
    console.error("Error saving mock consumption:", error);
  }
}

function updateConsumptionFromOrder(userId: string, order: Order): void {
  try {
    const consumption = getMockConsumption(userId);
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    const totalCalories = order.items.reduce(
      (sum, item) => sum + item.product.nutrition.calories * item.quantity,
      0
    );
    consumption[today] += totalCalories;
    setMockConsumption(userId, consumption);
  } catch (error) {
    console.error("Error updating consumption:", error);
  }
}

// ==================== CART OPERATIONS ====================

/**
 * Get user's cart items
 */
export async function getCart(userId: string): Promise<CartItem[]> {
  if (USE_MOCK) {
    return getMockCart(userId);
  }

  try {
    const headers = await getHeaders();

    // Check if user is authenticated
    if (!headers.Authorization) {
      console.warn("User not authenticated, cannot fetch cart");
      return [];
    }

    const response = await fetch(`${API_BASE}/cart`, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch cart:", response.status, errorText);
      return [];
    }

    const cartData = await response.json();

    // Convert server format to CartItem format
    return cartData
      .map((item: any) => {
        const product = localProducts.find((p) => p.id === item.product_id);
        return {
          product: product!,
          quantity: item.quantity,
        };
      })
      .filter((item: any) => item.product);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

/**
 * Add product to cart
 */
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number = 1
): Promise<void> {
  if (USE_MOCK) {
    const cart = getMockCart(userId);
    const product = localProducts.find((p) => p.id === productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const existingItem = cart.find((item) => item.product.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    setMockCart(userId, cart);
    return;
  }

  try {
    const headers = await getHeaders();

    if (!headers.Authorization) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_BASE}/cart/add`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add to cart:", response.status, errorText);
      throw new Error("Failed to add to cart");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartQuantity(
  userId: string,
  productId: string,
  quantity: number
): Promise<void> {
  if (USE_MOCK) {
    const cart = getMockCart(userId);
    const item = cart.find((item) => item.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newCart = cart.filter((item) => item.product.id !== productId);
        setMockCart(userId, newCart);
      } else {
        item.quantity = quantity;
        setMockCart(userId, cart);
      }
    }
    return;
  }

  try {
    const headers = await getHeaders();

    if (!headers.Authorization) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_BASE}/cart/update`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update cart:", response.status, errorText);
      throw new Error("Failed to update cart");
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw error;
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  userId: string,
  productId: string
): Promise<void> {
  if (USE_MOCK) {
    const cart = getMockCart(userId);
    const newCart = cart.filter((item) => item.product.id !== productId);
    setMockCart(userId, newCart);
    return;
  }

  try {
    const headers = await getHeaders();

    if (!headers.Authorization) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_BASE}/cart/remove`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to remove from cart:", response.status, errorText);
      throw new Error("Failed to remove from cart");
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

/**
 * Clear all items from cart
 */
export async function clearCart(userId: string): Promise<void> {
  if (USE_MOCK) {
    setMockCart(userId, []);
    return;
  }

  try {
    const headers = await getHeaders();

    if (!headers.Authorization) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_BASE}/cart/clear`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to clear cart:", response.status, errorText);
      throw new Error("Failed to clear cart");
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}

// ==================== ORDER OPERATIONS ====================

/**
 * Create a new order
 */
export async function createOrder(
  userId: string,
  items: CartItem[],
  total: number,
  paymentMethod: string = "cash",
  paymentDetails?: any
): Promise<Order | null> {
  if (USE_MOCK) {
    if (!items || items.length === 0) {
      throw new Error("Cannot create order with empty cart");
    }

    const order: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items: items,
      total: total,
      date: new Date().toISOString(),
      status: "completed",
      paymentMethod: paymentMethod,
      paymentDetails: paymentDetails,
    };

    const orders = getMockOrders(userId);
    orders.unshift(order); // Add to beginning
    setMockOrders(userId, orders);

    // Update consumption tracking
    updateConsumptionFromOrder(userId, order);

    return order;
  }

  try {
    if (!items || items.length === 0) {
      throw new Error("Cannot create order with empty cart");
    }

    const headers = await getHeaders();

    if (!headers.Authorization) {
      throw new Error("User not authenticated");
    }

    // Format items for API
    const orderItems = items.map((item) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      calories: item.product.nutrition.calories,
    }));

    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        items: orderItems,
        total,
        paymentMethod,
        paymentDetails,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to create order:", response.status, errorText);
      throw new Error("Failed to create order");
    }

    const orderData = await response.json();

    // Convert to Order format
    const order: Order = {
      id: orderData.id,
      items: items,
      total: orderData.total,
      date: orderData.created_at,
      status: "completed",
      paymentMethod: orderData.paymentMethod || paymentMethod,
      paymentDetails: orderData.paymentDetails || paymentDetails,
    };

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
}

/**
 * Get user's order history
 */
export async function getOrders(userId: string): Promise<Order[]> {
  if (USE_MOCK) {
    return getMockOrders(userId);
  }

  try {
    const headers = await getHeaders();

    // Check if user is authenticated
    if (!headers.Authorization) {
      console.warn("User not authenticated, cannot fetch orders");
      return [];
    }

    const response = await fetch(`${API_BASE}/orders`, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch orders:", response.status, errorText);
      return [];
    }

    const ordersData = await response.json();

    // Convert server format to Order format
    return ordersData.map((order: any) => {
      // Reconstruct items with full product data
      const items = order.items
        .map((item: any) => {
          const product = localProducts.find((p) => p.id === item.product_id);
          if (product) {
            return {
              product,
              quantity: item.quantity,
            };
          }
          return null;
        })
        .filter(Boolean);

      return {
        id: order.id,
        items: items,
        total: order.total,
        date: order.created_at,
        status: order.status || "completed",
        paymentMethod: order.paymentMethod,
        paymentDetails: order.paymentDetails,
      };
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// ==================== CONSUMPTION TRACKING ====================

/**
 * Get weekly calorie consumption
 * Returns array of 7 numbers (last 7 days)
 */
export async function getWeeklyConsumption(userId: string): Promise<number[]> {
  if (USE_MOCK) {
    return getMockConsumption(userId);
  }

  try {
    const headers = await getHeaders();

    // Check if user is authenticated
    if (!headers.Authorization) {
      console.warn("User not authenticated, cannot fetch consumption");
      return Array(7).fill(0);
    }

    const response = await fetch(`${API_BASE}/consumption/weekly`, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch consumption:", response.status, errorText);
      return Array(7).fill(0);
    }

    const data = await response.json();
    return Array.isArray(data) && data.length === 7 ? data : Array(7).fill(0);
  } catch (error) {
    console.error("Error fetching consumption:", error);
    return Array(7).fill(0);
  }
}

// ==================== SCAN HISTORY ====================

/**
 * Log a barcode scan
 */
export async function logScan(
  userId: string,
  productId: string,
  barcode: string
): Promise<void> {
  try {
    const product = localProducts.find((p) => p.id === productId);

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // For now, just log to console
    // Can be extended to call API endpoint if needed
    console.log("Scan logged:", {
      userId,
      productId,
      barcode,
      product: product.name,
    });
  } catch (error) {
    console.error("Error logging scan:", error);
    throw error;
  }
}

/**
 * Get user's scan history
 */
export async function getScanHistory() {
  try {
    // For now, return empty array
    // Can be extended to call API endpoint if needed
    return [];
  } catch (error) {
    console.error("Error fetching scan history:", error);
    return [];
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Clear all user data
 */
export async function clearUserData(userId: string): Promise<void> {
  try {
    await clearCart(userId);
    console.log("User data cleared for:", userId);
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
}

/**
 * Get storage size for user data (estimate in bytes)
 */
export async function getUserDataSize(userId: string): Promise<number> {
  try {
    const cart = await getCart(userId);
    const orders = await getOrders(userId);
    const consumption = await getWeeklyConsumption(userId);

    let totalSize = 0;
    totalSize += new Blob([JSON.stringify(cart)]).size;
    totalSize += new Blob([JSON.stringify(orders)]).size;
    totalSize += new Blob([JSON.stringify(consumption)]).size;

    return totalSize;
  } catch (error) {
    console.error("Error calculating data size:", error);
    return 0;
  }
}
