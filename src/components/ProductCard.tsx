import { Product } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plus } from "../lib/icons";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isAuthenticated: boolean;
  onShowAuth?: () => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  isAuthenticated,
  onShowAuth,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isJuice = product.category === "minuman";
  const badgeColor = isJuice
    ? "bg-gradient-to-r from-blue-500 to-cyan-600"
    : "bg-gradient-to-r from-orange-500 to-amber-600";
  const borderColor = isJuice
    ? "border-blue-200 hover:border-blue-300"
    : "border-orange-200 hover:border-orange-300";
  const bgGradient = isJuice
    ? "from-blue-50 to-cyan-50"
    : "from-orange-50 to-amber-50";

  return (
    <Card
      className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer group bg-linear-to-br ${bgGradient} border-2 ${borderColor} hover:-translate-y-1`}
    >
      <div onClick={() => onViewDetails(product)}>
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <Badge
            className={`absolute top-3 right-3 ${badgeColor} text-white shadow-md`}
          >
            {isJuice ? "Juicy Balance" : "Fit Bites"}
          </Badge>
        </div>
        <CardContent className="pt-4">
          <h3 className="text-gray-900 mb-2 font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span
              className={`${
                isJuice ? "text-blue-600" : "text-orange-600"
              } font-bold`}
            >
              {formatPrice(product.price)}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
              {product.nutrition.calories} kal
            </span>
          </div>
        </CardContent>
      </div>
      <CardFooter className="pt-0">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (isAuthenticated) {
              onAddToCart(product);
            } else {
              onShowAuth?.();
            }
          }}
          className={`w-full ${
            isJuice
              ? "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              : "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
          } shadow-md text-sm sm:text-base`}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAuthenticated ? "Tambah ke Keranjang" : "Login untuk Pesan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
