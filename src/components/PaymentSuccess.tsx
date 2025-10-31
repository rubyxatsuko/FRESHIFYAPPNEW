import { useState } from 'react';
import { Order } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { CheckCircle2, Printer, Download, Home, QrCode } from '../lib/icons';

interface PaymentSuccessProps {
  order: Order;
  userName: string;
  userEmail: string;
  onBackToHome: () => void;
}

export function PaymentSuccess({ order, userName, userEmail, onBackToHome }: PaymentSuccessProps) {
  const [showQRIS, setShowQRIS] = useState(order.paymentMethod === 'qris');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(date);
  };

  const subtotal = order.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.1;

  const handlePrint = () => {
    // Set document title for print
    const originalTitle = document.title;
    document.title = `Freshify App - Struk #${order.id.slice(0, 12).toUpperCase()}`;
    window.print();
    document.title = originalTitle;
  };

  const handleDownload = () => {
    // Set document title for download/print
    const originalTitle = document.title;
    document.title = `Freshify App - Struk #${order.id.slice(0, 12).toUpperCase()}`;
    window.print();
    document.title = originalTitle;
  };

  const getPaymentMethodText = () => {
    switch (order.paymentMethod) {
      case 'qris':
        return 'QRIS';
      case 'ewallet':
        return `E-Wallet (${order.paymentDetails?.provider?.toUpperCase() || 'GoPay'})`;
      case 'transfer':
        return `Transfer Bank ${order.paymentDetails?.bank || 'BCA'}`;
      case 'cash':
        return 'Bayar Tunai (COD)';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" id="receipt-container">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-green-900 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-600">
            Terima kasih telah berbelanja di Freshify
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QRIS Section (if applicable) */}
          {order.paymentMethod === 'qris' && showQRIS && (
            <Card className="lg:col-span-2">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <QrCode className="w-6 h-6" />
                  Scan QRIS untuk Menyelesaikan Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {/* QRIS Barcode */}
                <div className="bg-white p-6 rounded-lg border-2 border-gray-300 mb-4">
                  <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                    {/* QR Code - You can replace this with actual QR code generator */}
                    <svg viewBox="0 0 256 256" className="w-full h-full">
                      {/* Simple QR code pattern */}
                      <rect width="256" height="256" fill="white"/>
                      
                      {/* Corner squares */}
                      <rect x="8" y="8" width="64" height="64" fill="black"/>
                      <rect x="16" y="16" width="48" height="48" fill="white"/>
                      <rect x="24" y="24" width="32" height="32" fill="black"/>
                      
                      <rect x="184" y="8" width="64" height="64" fill="black"/>
                      <rect x="192" y="16" width="48" height="48" fill="white"/>
                      <rect x="200" y="24" width="32" height="32" fill="black"/>
                      
                      <rect x="8" y="184" width="64" height="64" fill="black"/>
                      <rect x="16" y="192" width="48" height="48" fill="white"/>
                      <rect x="24" y="200" width="32" height="32" fill="black"/>
                      
                      {/* Random pattern for demonstration */}
                      <rect x="88" y="16" width="8" height="8" fill="black"/>
                      <rect x="104" y="16" width="8" height="8" fill="black"/>
                      <rect x="120" y="16" width="8" height="8" fill="black"/>
                      <rect x="88" y="32" width="8" height="8" fill="black"/>
                      <rect x="112" y="32" width="8" height="8" fill="black"/>
                      <rect x="96" y="48" width="8" height="8" fill="black"/>
                      <rect x="120" y="48" width="8" height="8" fill="black"/>
                      
                      {/* More pattern */}
                      <rect x="88" y="88" width="16" height="16" fill="black"/>
                      <rect x="112" y="88" width="8" height="8" fill="black"/>
                      <rect x="128" y="88" width="8" height="8" fill="black"/>
                      <rect x="96" y="112" width="8" height="8" fill="black"/>
                      <rect x="120" y="112" width="16" height="16" fill="black"/>
                      
                      <rect x="160" y="96" width="8" height="8" fill="black"/>
                      <rect x="176" y="104" width="8" height="8" fill="black"/>
                      <rect x="168" y="120" width="8" height="8" fill="black"/>
                      
                      <rect x="32" y="96" width="8" height="8" fill="black"/>
                      <rect x="48" y="104" width="8" height="8" fill="black"/>
                      <rect x="40" y="120" width="8" height="8" fill="black"/>
                      <rect x="56" y="96" width="8" height="8" fill="black"/>
                      
                      <rect x="88" y="152" width="8" height="8" fill="black"/>
                      <rect x="104" y="160" width="8" height="8" fill="black"/>
                      <rect x="120" y="152" width="8" height="8" fill="black"/>
                      <rect x="136" y="168" width="8" height="8" fill="black"/>
                      
                      <rect x="160" y="152" width="16" height="16" fill="black"/>
                      <rect x="184" y="160" width="8" height="8" fill="black"/>
                      
                      <rect x="96" y="200" width="8" height="8" fill="black"/>
                      <rect x="112" y="208" width="8" height="8" fill="black"/>
                      <rect x="128" y="200" width="8" height="8" fill="black"/>
                      <rect x="144" y="216" width="8" height="8" fill="black"/>
                      
                      <rect x="168" y="200" width="8" height="8" fill="black"/>
                      <rect x="184" y="208" width="8" height="8" fill="black"/>
                      <rect x="176" y="224" width="8" height="8" fill="black"/>
                    </svg>
                  </div>
                </div>
                
                <div className="text-center space-y-2 mb-4">
                  <p className="text-gray-700">Total Pembayaran</p>
                  <p className="text-2xl text-green-600">{formatPrice(order.total)}</p>
                  <p className="text-sm text-gray-500">
                    Order #{order.id.slice(0, 12).toUpperCase()}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 max-w-md">
                  <p className="mb-2">Cara Pembayaran:</p>
                  <ol className="list-decimal list-inside space-y-1 text-left">
                    <li>Buka aplikasi e-wallet atau mobile banking Anda</li>
                    <li>Pilih menu Scan QR atau QRIS</li>
                    <li>Scan kode QR di atas</li>
                    <li>Konfirmasi pembayaran</li>
                  </ol>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowQRIS(false)}
                  className="mt-4"
                >
                  Lihat Struk Pembayaran
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Receipt/Struk Section */}
          {(!showQRIS || order.paymentMethod !== 'qris') && (
            <>
              {/* Receipt Card */}
              <div className="lg:col-span-2">
                <Card className="print:shadow-none">
                  <CardHeader className="bg-green-600 text-white print:bg-white print:text-black">
                    <div className="text-center">
                      <h2 className="text-white print:text-green-900">Freshify</h2>
                      <p className="text-sm text-green-100 print:text-gray-600">
                        Makanan & Minuman Sehat
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 pt-6">
                    {/* Order Info */}
                    <div className="text-center border-b pb-4">
                      <p className="text-sm text-gray-500">No. Pesanan</p>
                      <p className="text-green-900">{order.id.slice(0, 16).toUpperCase()}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        {formatDate(order.date)}
                      </p>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2 border-b pb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pelanggan:</span>
                        <span className="text-gray-900">{userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900 text-sm">{userEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metode Pembayaran:</span>
                        <span className="text-gray-900">{getPaymentMethodText()}</span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      <h3 className="text-gray-900">Rincian Pesanan</h3>
                      {order.items.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-900">{item.product.name}</span>
                            <span className="text-gray-900">{formatPrice(item.product.price)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 pl-4">
                            <span>{item.quantity} x {formatPrice(item.product.price)}</span>
                            <span>{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Pajak (10%)</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-green-900">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="bg-green-50 p-4 rounded-lg text-center print:bg-white print:border print:border-green-200">
                      <p className="text-sm text-green-800">
                        Status: <span className="uppercase">{order.status}</span>
                      </p>
                      {order.paymentMethod === 'cash' && (
                        <p className="text-sm text-gray-600 mt-2">
                          Pembayaran akan dilakukan saat pengiriman
                        </p>
                      )}
                      {order.paymentMethod === 'qris' && (
                        <p className="text-sm text-gray-600 mt-2">
                          Mohon selesaikan pembayaran melalui QRIS
                        </p>
                      )}
                      {order.paymentMethod === 'transfer' && (
                        <p className="text-sm text-gray-600 mt-2">
                          Transfer ke rekening {order.paymentDetails?.bank}
                        </p>
                      )}
                      {order.paymentMethod === 'ewallet' && (
                        <p className="text-sm text-gray-600 mt-2">
                          Pembayaran melalui {order.paymentDetails?.provider}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500 border-t pt-4">
                      <p>Terima kasih telah berbelanja di Freshify!</p>
                      <p>Sehat Alami, Hidup Lebih Baik</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="lg:col-span-2 flex flex-wrap gap-4 justify-center print:hidden">
                {order.paymentMethod === 'qris' && (
                  <Button
                    variant="outline"
                    onClick={() => setShowQRIS(true)}
                    className="flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    Lihat Kode QRIS
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Struk
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                
                <Button
                  onClick={onBackToHome}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Kembali ke Beranda
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Print-only QRIS - Removed to prevent extra page */}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 0.8cm;
            size: A4 portrait;
          }
          
          html, body {
            background: white !important;
            margin: 0;
            padding: 0;
            height: auto;
          }
          
          body * {
            visibility: hidden;
          }
          
          #receipt-container,
          #receipt-container * {
            visibility: visible;
          }
          
          #receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
          }
          
          /* Compact spacing for print */
          .space-y-6 > * + * {
            margin-top: 0.5rem !important;
          }
          
          .space-y-3 > * + * {
            margin-top: 0.3rem !important;
          }
          
          .space-y-2 > * + * {
            margin-top: 0.25rem !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:bg-white {
            background-color: white !important;
          }
          
          .print\\:text-black {
            color: black !important;
          }
          
          .print\\:text-green-900 {
            color: rgb(20, 83, 45) !important;
          }
          
          .print\\:text-gray-600 {
            color: rgb(75, 85, 99) !important;
          }
          
          .print\\:border {
            border: 1px solid !important;
          }
          
          .print\\:border-green-200 {
            border-color: rgb(187, 247, 208) !important;
          }
        }
      `}</style>
    </div>
  );
}
