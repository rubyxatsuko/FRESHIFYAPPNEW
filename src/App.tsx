import { useState, useEffect } from "react";
import { AuthPage } from "./components/AuthPage";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { ProductDetail } from "./components/ProductDetail";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { PaymentSuccess } from "./components/PaymentSuccess";
import { BarcodeScanner } from "./components/BarcodeScanner";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { Articles } from "./components/Articles";
import { Profile } from "./components/Profile";
import { AdminDashboard } from "./components/AdminDashboard";
import { CartItem, Order, Product } from "./types";
import { toast } from "./lib/toast";
import { getCurrentUser, signOut, getSession } from "./lib/auth";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  createOrder,
  getOrders,
  getWeeklyConsumption,
} from "./lib/database";
import { Loader2 } from "./lib/icons";

type Page =
  | "home"
  | "product"
  | "cart"
  | "checkout"
  | "payment-success"
  | "scanner"
  | "calculator"
  | "articles"
  | "profile"
  | "admin";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [weeklyCalories, setWeeklyCalories] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0,
  ]);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      loadUserData();
    }
  }, [isAuthenticated, userId]);

  const checkSession = async () => {
    try {
      const session = await getSession();
      if (session?.user) {
        const profile = await getCurrentUser();
        if (profile) {
          setUserId(profile.id);
          setUserEmail(profile.email);
          setUserName(profile.name);
          setUserRole(profile.role || "user");
          setIsAuthenticated(true);
          // Load user data immediately after restoring session
          await loadUserDataWithId(profile.id);
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!userId) return;
    await loadUserDataWithId(userId);
  };

  const loadUserDataWithId = async (uid: string) => {
    try {
      console.log("Loading user data for:", uid);

      // Load cart
      const cart = await getCart(uid);
      console.log("Cart loaded:", cart.length, "items");
      setCartItems(cart);

      // Load orders
      const orderHistory = await getOrders(uid);
      console.log("Orders loaded:", orderHistory.length, "orders");
      setOrders(orderHistory);

      // Load weekly consumption
      const weeklyData = await getWeeklyConsumption(uid);
      console.log("Weekly consumption loaded:", weeklyData);
      setWeeklyCalories(weeklyData);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Gagal memuat data pengguna");
    }
  };

  const handleLogin = async (uid: string, email: string, name: string) => {
    setUserId(uid);
    setUserEmail(email);
    setUserName(name);

    // Check user role
    const profile = await getCurrentUser();
    setUserRole(profile?.role || "user");

    setIsAuthenticated(true);
    setShowAuthPage(false);

    // Load user data immediately after login
    await loadUserDataWithId(uid);

    toast.success(`Selamat datang, ${name}!`, {
      description: "Data Anda telah dimuat",
      duration: 3000,
    });
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    setUserId("");
    setUserName("");
    setUserEmail("");
    setUserRole("user");
    setCartItems([]);
    setOrders([]);
    setWeeklyCalories([0, 0, 0, 0, 0, 0, 0]);
    setCurrentPage("home");
    toast.success("Berhasil logout");
  };

  const handleShowAuth = () => {
    setShowAuthPage(true);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      setShowAuthPage(true);
      toast.error("Login Diperlukan", {
        description: "Silakan login atau buat akun baru untuk berbelanja",
        duration: 4000,
      });
      return;
    }

    try {
      await addToCart(userId, product.id);

      // Update local state
      const existingItem = cartItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        setCartItems(
          cartItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCartItems([...cartItems, { product, quantity: 1 }]);
      }

      toast.success(`${product.name} ditambahkan ke keranjang`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Gagal menambahkan ke keranjang");
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      await updateCartQuantity(userId, productId, quantity);

      setCartItems(
        cartItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Gagal mengupdate jumlah");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(userId, productId);

      setCartItems(cartItems.filter((item) => item.product.id !== productId));
      toast.success("Produk dihapus dari keranjang");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Gagal menghapus produk");
    }
  };

  const handleProceedToCheckout = () => {
    setCurrentPage("checkout");
  };

  const handleConfirmPayment = async (
    paymentMethod: string,
    paymentDetails?: any
  ) => {
    try {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      console.log("Creating order for user:", userId);
      const order = await createOrder(
        userId,
        cartItems,
        total,
        paymentMethod,
        paymentDetails
      );

      if (order) {
        console.log("Order created successfully:", order.id);

        // Reload orders and consumption data
        const orderHistory = await getOrders(userId);
        console.log(
          "Order history after creation:",
          orderHistory.length,
          "orders"
        );
        setOrders(orderHistory);

        const weeklyData = await getWeeklyConsumption(userId);
        setWeeklyCalories(weeklyData);

        // Clear cart after successful order
        await clearCart(userId);

        // Set completed order and navigate to payment success
        setCompletedOrder(order);
        setCartItems([]);
        setCurrentPage("payment-success");

        toast.success("Pesanan berhasil dibuat!", {
          description: `Order #${order.id.substring(0, 8)} telah disimpan`,
          duration: 4000,
        });
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Gagal membuat pesanan", {
        description: "Silakan coba lagi",
        duration: 4000,
      });
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage("product");
  };

  const handleNavigate = (page: string) => {
    // Check if protected pages require authentication
    const protectedPages = [
      "scanner",
      "calculator",
      "cart",
      "profile",
      "admin",
    ];

    if (protectedPages.includes(page) && !isAuthenticated) {
      setShowAuthPage(true);
      toast.error("Login Diperlukan", {
        description:
          "Silakan login atau daftar akun baru untuk mengakses fitur ini",
        duration: 4000,
      });
      return;
    }

    setCurrentPage(page as Page);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  // Show auth page as modal overlay when needed
  if (showAuthPage && !isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            cartItemCount={cartItemCount}
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
            isAuthenticated={isAuthenticated}
            onShowAuth={handleShowAuth}
          />

          {/* Blurred background */}
          <div className="blur-sm pointer-events-none">
            <HomePage
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
              isAuthenticated={isAuthenticated}
              onShowAuth={handleShowAuth}
            />
          </div>
        </div>

        {/* Auth Modal Overlay */}
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg max-w-md w-full">
            <button
              onClick={() => setShowAuthPage(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <AuthPage onLogin={handleLogin} />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartItemCount={cartItemCount}
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        onShowAuth={handleShowAuth}
      />

      {currentPage === "home" && (
        <HomePage
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
          isAuthenticated={isAuthenticated}
          onShowAuth={handleShowAuth}
        />
      )}

      {currentPage === "product" && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setCurrentPage("home")}
          onAddToCart={handleAddToCart}
          isAuthenticated={isAuthenticated}
          onShowAuth={handleShowAuth}
        />
      )}

      {currentPage === "cart" && (
        <Cart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {currentPage === "checkout" && (
        <Checkout
          items={cartItems}
          onBack={() => setCurrentPage("cart")}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {currentPage === "payment-success" && completedOrder && (
        <PaymentSuccess
          order={completedOrder}
          userName={userName}
          userEmail={userEmail}
          onBackToHome={() => setCurrentPage("home")}
        />
      )}

      {currentPage === "scanner" && <BarcodeScanner userId={userId} />}

      {currentPage === "calculator" && <CalorieCalculator />}

      {currentPage === "articles" && <Articles />}

      {currentPage === "profile" && (
        <Profile
          userName={userName}
          userEmail={userEmail}
          orders={orders}
          weeklyCalories={weeklyCalories}
          userRole={userRole}
        />
      )}

      {currentPage === "admin" && <AdminDashboard />}
    </div>
  );
}
