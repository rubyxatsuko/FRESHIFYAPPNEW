import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Shield,
  Package,
  Newspaper,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Users,
  Printer,
} from "../lib/icons";
import { toast } from "../lib/toast";
import { getAccessToken } from "../lib/auth";
import { projectId } from "../utils/supabase/info";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function AdminDashboard() {
  // Treat 'admin' as having all permissions for now
  const effectiveRole: "admin" | "owner" = "admin";
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-purple-900 text-3xl">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Kelola produk, artikel, pesanan, dan pengguna
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Produk</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <span className="hidden sm:inline">Artikel</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Pesanan</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admins</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <ProductsManagement userRole={effectiveRole} />
          </TabsContent>

          <TabsContent value="articles" className="mt-6">
            <ArticlesManagement userRole={effectiveRole} />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrdersManagement userRole={effectiveRole} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UsersManagement userRole={effectiveRole} />
          </TabsContent>

          <TabsContent value="admins" className="mt-6">
            <AdminsManagement userRole={effectiveRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Products Management Component
function ProductsManagement({ userRole }: { userRole: "admin" | "owner" }) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "minuman",
    price: "",
    image: "",
    description: "",
    calories: "",
    protein: "",
    fat: "",
    fiber: "",
    sugar: "",
    vitamins: "",
    ingredients: "",
    barcode: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/admin/products`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Load products error:", error);
      toast.error("Gagal memuat produk");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const accessToken = await getAccessToken();
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description,
        nutrition: {
          calories: parseFloat(formData.calories) || 0,
          protein: parseFloat(formData.protein) || 0,
          fat: parseFloat(formData.fat) || 0,
          fiber: parseFloat(formData.fiber) || 0,
          sugar: parseFloat(formData.sugar) || 0,
          vitamins: formData.vitamins
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
        },
        ingredients: formData.ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        barcode: formData.barcode || undefined,
      };

      const url = editingProduct
        ? `https://${projectId}.supabase.co/functions/v1/make-server/admin/products/${editingProduct.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server/admin/products`;

      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to save product");

      toast.success(
        editingProduct
          ? "Produk berhasil diupdate"
          : "Produk berhasil ditambahkan"
      );
      setIsDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Save product error:", error);
      toast.error("Gagal menyimpan produk");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      description: product.description,
      calories: product.nutrition.calories.toString(),
      protein: product.nutrition.protein.toString(),
      fat: product.nutrition.fat.toString(),
      fiber: product.nutrition.fiber.toString(),
      sugar: product.nutrition.sugar.toString(),
      vitamins: product.nutrition.vitamins.join(", "),
      ingredients: product.ingredients.join(", "),
      barcode: product.barcode || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const accessToken = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/admin/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Produk berhasil dihapus");
      loadProducts();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Gagal menghapus produk");
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "minuman",
      price: "",
      image: "",
      description: "",
      calories: "",
      protein: "",
      fat: "",
      fiber: "",
      sugar: "",
      vitamins: "",
      ingredients: "",
      barcode: "",
    });
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manajemen Produk</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={resetForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </DialogTitle>
              <DialogDescription>
                Lengkapi informasi produk di bawah ini
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Produk *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kategori *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minuman">Minuman</SelectItem>
                      <SelectItem value="makanan">Makanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Harga (Rp) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Barcode</Label>
                  <Input
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL Gambar *</Label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Deskripsi *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Informasi Nutrisi</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Kalori</Label>
                    <Input
                      type="number"
                      value={formData.calories}
                      onChange={(e) =>
                        setFormData({ ...formData, calories: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Protein (g)</Label>
                    <Input
                      type="number"
                      value={formData.protein}
                      onChange={(e) =>
                        setFormData({ ...formData, protein: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lemak (g)</Label>
                    <Input
                      type="number"
                      value={formData.fat}
                      onChange={(e) =>
                        setFormData({ ...formData, fat: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Serat (g)</Label>
                    <Input
                      type="number"
                      value={formData.fiber}
                      onChange={(e) =>
                        setFormData({ ...formData, fiber: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gula (g)</Label>
                    <Input
                      type="number"
                      value={formData.sugar}
                      onChange={(e) =>
                        setFormData({ ...formData, sugar: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Vitamin (pisahkan dengan koma)</Label>
                <Input
                  value={formData.vitamins}
                  onChange={(e) =>
                    setFormData({ ...formData, vitamins: e.target.value })
                  }
                  placeholder="Vitamin C, Vitamin A, ..."
                />
              </div>

              <div className="space-y-2">
                <Label>Bahan (pisahkan dengan koma) *</Label>
                <Textarea
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({ ...formData, ingredients: e.target.value })
                  }
                  placeholder="Apel, Wortel, ..."
                  rows={2}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {editingProduct ? "Update" : "Tambah"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>
                <Badge
                  className={
                    product.category === "minuman"
                      ? "bg-blue-500"
                      : "bg-orange-500"
                  }
                >
                  {product.category === "minuman" ? "Minuman" : "Makanan"}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>
              <p className="text-lg font-bold text-green-600">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Belum ada produk. Tambahkan produk pertama Anda!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Articles Management Component
function ArticlesManagement({ userRole }: { userRole: "admin" | "owner" }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/admin/articles`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Load articles error:", error);
      toast.error("Gagal memuat artikel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const accessToken = await getAccessToken();
      const url = editingArticle
        ? `https://${projectId}.supabase.co/functions/v1/make-server/admin/articles/${editingArticle.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server/admin/articles`;

      const response = await fetch(url, {
        method: editingArticle ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save article");

      toast.success(
        editingArticle
          ? "Artikel berhasil diupdate"
          : "Artikel berhasil ditambahkan"
      );
      setIsDialogOpen(false);
      resetForm();
      loadArticles();
    } catch (error) {
      console.error("Save article error:", error);
      toast.error("Gagal menyimpan artikel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;

    try {
      const accessToken = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/admin/articles/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Artikel berhasil dihapus");
      loadArticles();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Gagal menghapus artikel");
    }
  };

  const resetForm = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image: "",
    });
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manajemen Artikel</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={resetForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Artikel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? "Edit Artikel" : "Tambah Artikel Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>URL Gambar *</Label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Ringkasan *</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Konten *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={10}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {editingArticle ? "Update" : "Tambah"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-32 h-32 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(article)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Belum ada artikel. Tambahkan artikel pertama Anda!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Orders Management Component
function OrdersManagement({ userRole }: { userRole: "admin" | "owner" }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/admin/orders`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();
      setOrders(
        data.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    } catch (error) {
      console.error("Load orders error:", error);
      toast.error("Gagal memuat pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Status pesanan berhasil diupdate");
      loadOrders();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Gagal mengupdate status");
    }
  };

  const printReceipt = (order: any) => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price);
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(date);
    };

    const subtotal = order.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk #${order.id.substring(0, 12)}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 80mm;
              margin: 0 auto;
              padding: 10mm;
              background: white;
            }
            .receipt {
              width: 100%;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #333;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .header h1 {
              font-size: 20px;
              margin-bottom: 5px;
              color: #16a34a;
            }
            .header p {
              font-size: 11px;
              color: #666;
              line-height: 1.4;
            }
            .section {
              margin-bottom: 15px;
              font-size: 12px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 8px;
              text-transform: uppercase;
              color: #333;
              font-size: 11px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 11px;
            }
            .info-label {
              color: #666;
            }
            .info-value {
              color: #333;
              font-weight: 500;
            }
            .divider {
              border-top: 1px dashed #999;
              margin: 12px 0;
            }
            .items-table {
              width: 100%;
              margin-bottom: 10px;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 11px;
            }
            .item-name {
              flex: 1;
              color: #333;
              font-weight: 500;
            }
            .item-qty {
              color: #666;
              margin: 0 8px;
              font-size: 10px;
            }
            .item-price {
              color: #333;
              font-weight: 500;
              text-align: right;
              min-width: 80px;
            }
            .totals {
              margin-top: 10px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 11px;
            }
            .total-row.grand {
              font-size: 14px;
              font-weight: bold;
              color: #16a34a;
              margin-top: 8px;
              padding-top: 8px;
              border-top: 2px solid #333;
            }
            .status-badge {
              text-align: center;
              padding: 8px;
              background: #f0fdf4;
              border: 1px solid #16a34a;
              border-radius: 4px;
              margin: 15px 0;
            }
            .status-badge p {
              font-size: 11px;
              color: #16a34a;
              font-weight: bold;
              text-transform: uppercase;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 15px;
              border-top: 2px dashed #333;
              font-size: 10px;
              color: #666;
            }
            .footer p {
              margin-bottom: 3px;
            }
            .footer .tagline {
              font-weight: bold;
              color: #16a34a;
              margin-top: 5px;
            }
            @media print {
              body {
                padding: 0;
              }
              .receipt {
                page-break-after: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <!-- Header -->
            <div class="header">
              <h1>🍃 FRESHIFY</h1>
              <p>Makanan & Minuman Sehat</p>
              <p>Jl. Sehat Sejahtera No. 123</p>
              <p>Jakarta Selatan 12345</p>
              <p>Telp: (021) 1234-5678</p>
            </div>

            <!-- Order Info -->
            <div class="section">
              <div class="info-row">
                <span class="info-label">No. Pesanan:</span>
                <span class="info-value">#${order.id
                  .substring(0, 12)
                  .toUpperCase()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tanggal:</span>
                <span class="info-value">${formatDate(order.created_at)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Pelanggan:</span>
                <span class="info-value">${order.user_email || "Guest"}</span>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Items -->
            <div class="section">
              <div class="section-title">Rincian Pesanan</div>
              <div class="items-table">
                ${order.items
                  .map(
                    (item: any) => `
                  <div class="item-row">
                    <span class="item-name">${item.product_name}</span>
                    <span class="item-qty">x${item.quantity}</span>
                    <span class="item-price">${formatPrice(
                      item.price * item.quantity
                    )}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="divider"></div>

            <!-- Totals -->
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>${formatPrice(subtotal)}</span>
              </div>
              <div class="total-row">
                <span>Pajak (10%):</span>
                <span>${formatPrice(tax)}</span>
              </div>
              <div class="total-row grand">
                <span>TOTAL:</span>
                <span>${formatPrice(total)}</span>
              </div>
            </div>

            <!-- Status -->
            <div class="status-badge">
              <p>Status: ${
                order.status === "pending"
                  ? "MENUNGGU"
                  : order.status === "processing"
                  ? "DIPROSES"
                  : "SELESAI"
              }</p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>Terima kasih atas pesanan Anda!</p>
              <p>Simpan struk ini sebagai bukti pembayaran</p>
              <p class="tagline">Sehat Alami, Hidup Lebih Baik 🌱</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Manajemen Pesanan</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    Order #{order.id.substring(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <Badge
                  className={
                    order.status === "completed"
                      ? "bg-green-500"
                      : order.status === "processing"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                  }
                >
                  {order.status}
                </Badge>
              </div>

              <div className="border-t pt-4 mb-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-2">
                    <span>
                      {item.product_name} x{item.quantity}
                    </span>
                    <span>
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                  <span>Total</span>
                  <span>Rp {order.total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Select
                  value={order.status}
                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => printReceipt(order)}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada pesanan</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Users Management Component
function UsersManagement({ userRole }: { userRole: "admin" | "owner" }) {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/admin/users`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();
      setUsers(data.filter((u: any) => u.role === "user" || !u.role));
    } catch (error) {
      console.error("Load users error:", error);
      toast.error("Gagal memuat users");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Daftar Pengguna</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <Badge variant="outline">User</Badge>
              <p className="text-xs text-gray-500 mt-2">
                Bergabung:{" "}
                {new Date(user.created_at).toLocaleDateString("id-ID")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada pengguna terdaftar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Admins Management Component
function AdminsManagement({ userRole }: { userRole: "admin" | "owner" }) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "owner">("admin");

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/admin/users`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();
      setAdmins(
        data.filter((u: any) => u.role === "admin" || u.role === "owner")
      );
    } catch (error) {
      console.error("Load admins error:", error);
      toast.error("Gagal memuat admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const accessToken = await getAccessToken();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server/admin/update-role`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, role }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Gagal update role");
        return;
      }

      toast.success("Role berhasil diupdate");
      setEmail("");
      loadAdmins();
    } catch (error) {
      console.error("Update role error:", error);
      toast.error("Gagal update role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Manajemen Admin & Owner</h2>

      <Card>
        <CardHeader>
          <CardTitle>Tambah/Update Admin</CardTitle>
          <CardDescription>
            Set role untuk pengguna yang sudah terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateRole} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Email User</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={(value: any) => setRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    {userRole === "owner" && (
                      <SelectItem value="owner">Owner</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Update Role
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {admins.map((admin) => (
          <Card
            key={admin.id}
            className={
              admin.role === "owner" ? "border-purple-500" : "border-blue-500"
            }
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    admin.role === "owner" ? "bg-purple-100" : "bg-blue-100"
                  }`}
                >
                  <Shield
                    className={`w-6 h-6 ${
                      admin.role === "owner"
                        ? "text-purple-600"
                        : "text-blue-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{admin.name}</h3>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                </div>
              </div>
              <Badge
                className={
                  admin.role === "owner" ? "bg-purple-600" : "bg-blue-600"
                }
              >
                {admin.role === "owner" ? "Owner" : "Admin"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {admins.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada admin/owner terdaftar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
