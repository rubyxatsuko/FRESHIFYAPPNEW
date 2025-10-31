import { useState, useEffect } from "react";
import { Product } from "../types";
import { products as defaultProducts } from "../data/products";
import { ProductCard } from "./ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Sparkles, Loader2 } from "../lib/icons";
import { projectId } from "../utils/supabase/info";

interface HomePageProps {
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isAuthenticated: boolean;
  onShowAuth?: () => void;
}

export function HomePage({
  onAddToCart,
  onViewDetails,
  isAuthenticated,
  onShowAuth,
}: HomePageProps) {
  const [category, setCategory] = useState<"all" | "minuman" | "makanan">(
    "all"
  );
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Try to load from server first
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/products`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // If no products in DB, initialize with defaults
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server/init-data`,
            { method: "POST" }
          );
          // Use default products
          setProducts(defaultProducts);
        }
      }
    } catch (error) {
      console.log("Using default products:", error);
      setProducts(defaultProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 mb-3 sm:mb-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
              <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold">
                Hidup Sehat Dimulai dari Sini
              </span>
            </div>
            <h1 className="text-white mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 font-bold drop-shadow-lg">
              Freshify - Nutrisi Alami Setiap Hari
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto px-4 drop-shadow-md">
              Nikmati minuman Juicy Balance dan camilan Fit Bites yang dibuat
              dengan bahan alami, tanpa gula rafinasi, dan diproses dengan
              teknologi modern.
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(v) => setCategory(v as any)}
        >
          <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger
                value="all"
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                Semua Produk
              </TabsTrigger>
              <TabsTrigger
                value="minuman"
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                Juicy Balance
              </TabsTrigger>
              <TabsTrigger
                value="makanan"
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                Fit Bites
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  isAuthenticated={isAuthenticated}
                  onShowAuth={onShowAuth}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="minuman">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  isAuthenticated={isAuthenticated}
                  onShowAuth={onShowAuth}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="makanan">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  isAuthenticated={isAuthenticated}
                  onShowAuth={onShowAuth}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-green-100">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl">🍃</span>
            </div>
            <h3 className="text-green-900 mb-2 font-semibold">100% Alami</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Tanpa pengawet, pewarna, dan pemanis buatan
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow-sm text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-blue-100">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="text-blue-900 mb-2 font-semibold">Tinggi Nutrisi</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Kaya vitamin, mineral, dan antioksidan
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl shadow-sm text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-orange-100 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-orange-900 mb-2 font-semibold">
              Smart Technology
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Scan barcode untuk info nutrisi lengkap
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
