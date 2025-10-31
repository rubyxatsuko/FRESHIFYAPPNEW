import { Order } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { User, Package, TrendingUp, Calendar } from "../lib/icons";

interface ProfileProps {
  userName: string;
  userEmail: string;
  orders: Order[];
  weeklyCalories: number[];
  userRole?: "user" | "admin";
}

export function Profile({
  userName,
  userEmail,
  orders,
  weeklyCalories,
  userRole,
}: ProfileProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  // Hitung rata-rata kalori hanya dari hari-hari yang ada konsumsi (tidak termasuk hari dengan 0 kalori)
  const daysWithCalories = weeklyCalories.filter((cal) => cal > 0);
  const avgWeeklyCalories =
    daysWithCalories.length > 0
      ? Math.round(
          daysWithCalories.reduce((a, b) => a + b, 0) / daysWithCalories.length
        )
      : 0;

  const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-green-900 text-xl sm:text-2xl md:text-3xl truncate">
                  {userName}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base truncate">
                  {userEmail}
                </p>
                {userRole === "admin" && (
                  <Badge className="mt-2 bg-purple-600">Admin</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    Total Pesanan
                  </p>
                  <p className="text-xl sm:text-2xl text-purple-900 font-bold">
                    {orders.length}
                  </p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-sm">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    Total Belanja
                  </p>
                  <p className="text-xl sm:text-2xl text-blue-900 font-bold">
                    {formatPrice(totalSpent)}
                  </p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    Rata-rata Kalori/Hari
                  </p>
                  <p className="text-xl sm:text-2xl text-orange-900 font-bold">
                    {avgWeeklyCalories}
                  </p>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-sm">
                  <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Consumption */}
        <Card className="mb-6 sm:mb-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Konsumsi Kalori Minggu Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {daysOfWeek.map((day, index) => {
                const calories = weeklyCalories[index] || 0;
                const maxCalories = Math.max(...weeklyCalories, 1);
                const height = (calories / maxCalories) * 100;

                const barColors = [
                  "from-purple-500 to-purple-600",
                  "from-blue-500 to-blue-600",
                  "from-green-500 to-green-600",
                  "from-yellow-500 to-yellow-600",
                  "from-orange-500 to-orange-600",
                  "from-red-500 to-red-600",
                  "from-pink-500 to-pink-600",
                ];

                return (
                  <div
                    key={`day-${index}`}
                    className="flex flex-col items-center"
                  >
                    <div className="w-full h-24 sm:h-32 bg-gray-100 rounded-lg flex items-end justify-center mb-2 p-1">
                      <div
                        className={`w-full bg-gradient-to-t ${barColors[index]} rounded transition-all shadow-sm`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 mb-1 font-medium">
                      {day}
                    </p>
                    <p className="text-xs sm:text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {calories}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              Riwayat Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <p className="text-gray-900 mb-2 text-base sm:text-lg">
                  Belum ada riwayat pesanan
                </p>
                <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto">
                  Mulai berbelanja produk sehat di Freshify untuk melihat
                  riwayat pesanan Anda di sini
                </p>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                  <p className="text-xs sm:text-sm text-blue-800">
                    💡 <strong>Tips:</strong> Semua pesanan yang Anda buat akan
                    tersimpan otomatis dan dapat dilihat kapan saja
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {orders.map((order, orderIndex) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          Order #{order.id.substring(0, 12)}...
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {formatDate(order.date)}
                        </p>
                        {orderIndex === 0 && (
                          <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Terbaru
                          </span>
                        )}
                      </div>
                      <Badge
                        variant={
                          order.status === "completed" ? "default" : "secondary"
                        }
                        className={
                          order.status === "completed"
                            ? "bg-green-600 text-white"
                            : order.status === "processing"
                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                            : "bg-gray-600 text-white"
                        }
                      >
                        {order.status === "completed"
                          ? "Selesai"
                          : order.status === "processing"
                          ? "Diproses"
                          : "Pending"}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-700">
                          {item.quantity}x {item.product.name}
                        </p>
                      ))}
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-green-600">
                        Total: {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
