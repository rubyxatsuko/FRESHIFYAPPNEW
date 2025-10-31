import { Product } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, Barcode } from '../lib/icons';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  isAuthenticated: boolean;
  onShowAuth?: () => void;
}

export function ProductDetail({ product, onBack, onAddToCart, isAuthenticated, onShowAuth }: ProductDetailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative h-96 lg:h-[600px] rounded-lg overflow-hidden bg-white shadow-lg">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 right-4 bg-green-600">
              {product.category === 'minuman' ? 'Juicy Balance' : 'Fit Bites'}
            </Badge>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-green-900 mb-2">{product.name}</h1>
              <p className="text-3xl text-green-600 mb-4">{formatPrice(product.price)}</p>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Nutrition Info */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-green-900 mb-4">Informasi Nutrisi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Kalori</p>
                    <p className="text-green-900">{product.nutrition.calories} kal</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-green-900">{product.nutrition.protein}g</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Lemak</p>
                    <p className="text-green-900">{product.nutrition.fat}g</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Serat</p>
                    <p className="text-green-900">{product.nutrition.fiber}g</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Gula</p>
                    <p className="text-green-900">{product.nutrition.sugar}g</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vitamins */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-green-900 mb-4">Kandungan Vitamin & Mineral</h3>
                <div className="flex flex-wrap gap-2">
                  {product.nutrition.vitamins.map((vitamin, index) => (
                    <Badge key={index} variant="outline" className="bg-white">
                      {vitamin}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-green-900 mb-4">Komposisi</h3>
                <p className="text-gray-700">{product.ingredients.join(', ')}</p>
              </CardContent>
            </Card>

            {/* Barcode */}
            {product.barcode && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Barcode className="w-5 h-5" />
                    <span>Barcode: {product.barcode}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={() => {
                if (isAuthenticated) {
                  onAddToCart(product);
                } else {
                  onShowAuth?.();
                }
              }}
              className="w-full bg-green-600 hover:bg-green-700 py-6"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              {isAuthenticated ? 'Tambah ke Keranjang' : 'Login untuk Pesan'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
