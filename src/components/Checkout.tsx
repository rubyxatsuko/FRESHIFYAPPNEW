import { useState } from 'react';
import { CartItem } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { QrCode, Wallet, CreditCard, Banknote, ArrowLeft, CheckCircle2 } from '../lib/icons';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onConfirmPayment: (paymentMethod: string, paymentDetails?: any) => void;
}

type PaymentMethod = 'qris' | 'cash' | 'transfer' | 'ewallet';

export function Checkout({ items, onBack, onConfirmPayment }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [ewalletProvider, setEwalletProvider] = useState('gopay');
  const [bankName, setBankName] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleConfirm = () => {
    const paymentDetails = {
      method: paymentMethod,
      ...(paymentMethod === 'ewallet' && { provider: ewalletProvider }),
      ...(paymentMethod === 'transfer' && { bank: bankName })
    };
    onConfirmPayment(paymentMethod, paymentDetails);
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
          Kembali ke Keranjang
        </Button>

        <h1 className="text-green-900 mb-8">Checkout Pembayaran</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4>{item.product.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <p className="text-green-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Pilih Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <div className="space-y-4">
                    {/* QRIS */}
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="qris" id="qris" />
                      <Label htmlFor="qris" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <QrCode className="w-6 h-6 text-blue-600" />
                          <div>
                            <p>QRIS</p>
                            <p className="text-sm text-gray-600">Scan QR code untuk pembayaran</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    {/* E-Wallet */}
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="ewallet" id="ewallet" />
                      <Label htmlFor="ewallet" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Wallet className="w-6 h-6 text-green-600" />
                          <div className="flex-1">
                            <p>E-Wallet</p>
                            <p className="text-sm text-gray-600 mb-3">GoPay, OVO, DANA, ShopeePay</p>
                            {paymentMethod === 'ewallet' && (
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <Button
                                  type="button"
                                  variant={ewalletProvider === 'gopay' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setEwalletProvider('gopay')}
                                  className={ewalletProvider === 'gopay' ? 'bg-green-600' : ''}
                                >
                                  GoPay
                                </Button>
                                <Button
                                  type="button"
                                  variant={ewalletProvider === 'ovo' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setEwalletProvider('ovo')}
                                  className={ewalletProvider === 'ovo' ? 'bg-green-600' : ''}
                                >
                                  OVO
                                </Button>
                                <Button
                                  type="button"
                                  variant={ewalletProvider === 'dana' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setEwalletProvider('dana')}
                                  className={ewalletProvider === 'dana' ? 'bg-green-600' : ''}
                                >
                                  DANA
                                </Button>
                                <Button
                                  type="button"
                                  variant={ewalletProvider === 'shopeepay' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setEwalletProvider('shopeepay')}
                                  className={ewalletProvider === 'shopeepay' ? 'bg-green-600' : ''}
                                >
                                  ShopeePay
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>

                    {/* Bank Transfer */}
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-6 h-6 text-purple-600" />
                          <div className="flex-1">
                            <p>Transfer Bank</p>
                            <p className="text-sm text-gray-600 mb-3">BCA, Mandiri, BNI, BRI</p>
                            {paymentMethod === 'transfer' && (
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <Button
                                  type="button"
                                  variant={bankName === 'BCA' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setBankName('BCA')}
                                  className={bankName === 'BCA' ? 'bg-green-600' : ''}
                                >
                                  BCA
                                </Button>
                                <Button
                                  type="button"
                                  variant={bankName === 'Mandiri' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setBankName('Mandiri')}
                                  className={bankName === 'Mandiri' ? 'bg-green-600' : ''}
                                >
                                  Mandiri
                                </Button>
                                <Button
                                  type="button"
                                  variant={bankName === 'BNI' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setBankName('BNI')}
                                  className={bankName === 'BNI' ? 'bg-green-600' : ''}
                                >
                                  BNI
                                </Button>
                                <Button
                                  type="button"
                                  variant={bankName === 'BRI' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setBankName('BRI')}
                                  className={bankName === 'BRI' ? 'bg-green-600' : ''}
                                >
                                  BRI
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>

                    {/* Cash */}
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Banknote className="w-6 h-6 text-orange-600" />
                          <div>
                            <p>Bayar Tunai</p>
                            <p className="text-sm text-gray-600">Bayar saat pengiriman (COD)</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Total Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pajak (10%)</span>
                    <span className="text-gray-900">{formatPrice(tax)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-green-900">Total</span>
                  <span className="text-green-600 text-xl">{formatPrice(total)}</span>
                </div>

                <Separator />

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                    Metode: {
                      paymentMethod === 'qris' ? 'QRIS' :
                      paymentMethod === 'ewallet' ? `E-Wallet (${ewalletProvider.toUpperCase()})` :
                      paymentMethod === 'transfer' ? `Transfer Bank ${bankName || ''}` :
                      'Bayar Tunai (COD)'
                    }
                  </p>
                </div>

                <Button
                  onClick={handleConfirm}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={paymentMethod === 'transfer' && !bankName}
                >
                  Konfirmasi Pembayaran
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
