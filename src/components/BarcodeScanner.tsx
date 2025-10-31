import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Camera, Search } from '../lib/icons';
import { products } from '../data/products';
import { Product } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from '../lib/toast';
import { logScan } from '../lib/database';

interface BarcodeScannerProps {
  userId: string;
}

export function BarcodeScanner({ userId }: BarcodeScannerProps) {
  const [barcode, setBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);

  const handleScan = async () => {
    if (!barcode) {
      toast.error('Masukkan kode barcode');
      return;
    }

    const product = products.find(p => p.barcode === barcode);
    if (product) {
      setScannedProduct(product);
      toast.success('Produk ditemukan!');
      
      // Log scan to database
      if (userId) {
        await logScan(userId, product.id, barcode);
      }
    } else {
      setScannedProduct(null);
      toast.error('Produk tidak ditemukan');
    }
  };

  const calculateDailyPercentage = (value: number, daily: number) => {
    return Math.round((value / daily) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Camera className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-green-900 mb-2">Scanner Barcode</h1>
          <p className="text-gray-600">
            Scan barcode produk Freshify untuk melihat informasi nutrisi lengkap
          </p>
        </div>

        {/* Scanner Input */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Masukkan kode barcode (contoh: 8992761001234)"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                className="flex-1"
              />
              <Button
                onClick={handleScan}
                className="bg-green-600 hover:bg-green-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Cari
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Contoh barcode: 8992761001234, 8992761001241, 8992761002001
            </p>
          </CardContent>
        </Card>

        {/* Scanned Product Info */}
        {scannedProduct && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={scannedProduct.image}
                      alt={scannedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2 bg-green-600">
                      {scannedProduct.category === 'minuman' ? 'Juicy Balance' : 'Fit Bites'}
                    </Badge>
                    <h2 className="text-green-900 mb-2">{scannedProduct.name}</h2>
                    <p className="text-gray-600 mb-2">{scannedProduct.description}</p>
                    <p className="text-sm text-gray-500">Barcode: {scannedProduct.barcode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Nutrition */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Nutrisi Lengkap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Kalori</p>
                    <p className="text-2xl text-green-900">{scannedProduct.nutrition.calories}</p>
                    <p className="text-xs text-gray-500">kal per porsi</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Protein</p>
                    <p className="text-2xl text-green-900">{scannedProduct.nutrition.protein}g</p>
                    <p className="text-xs text-gray-500">
                      {calculateDailyPercentage(scannedProduct.nutrition.protein, 50)}% AKG
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Lemak</p>
                    <p className="text-2xl text-green-900">{scannedProduct.nutrition.fat}g</p>
                    <p className="text-xs text-gray-500">
                      {calculateDailyPercentage(scannedProduct.nutrition.fat, 70)}% AKG
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Serat</p>
                    <p className="text-2xl text-green-900">{scannedProduct.nutrition.fiber}g</p>
                    <p className="text-xs text-gray-500">
                      {calculateDailyPercentage(scannedProduct.nutrition.fiber, 25)}% AKG
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Gula</p>
                    <p className="text-2xl text-green-900">{scannedProduct.nutrition.sugar}g</p>
                    <p className="text-xs text-gray-500">Gula alami</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vitamins & Minerals */}
            <Card>
              <CardHeader>
                <CardTitle>Vitamin & Mineral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {scannedProduct.nutrition.vitamins.map((vitamin, index) => (
                    <Badge key={index} variant="outline" className="bg-white px-4 py-2">
                      ✓ {vitamin}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Serving Suggestion */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">Saran Konsumsi Harian</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {scannedProduct.category === 'minuman' 
                    ? 'Disarankan konsumsi 1-2 porsi per hari, idealnya di pagi hari atau sebelum aktivitas fisik untuk mendapatkan energi maksimal.'
                    : 'Cocok sebagai camilan sehat 1-2 porsi per hari. Dapat dikonsumsi sebagai snack di antara waktu makan utama.'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
