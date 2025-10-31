import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Leaf, Loader2, AlertCircle, Eye, EyeOff } from "../lib/icons";
import { signIn, signUp } from "../lib/auth";
import { toast } from "../lib/toast";

interface AuthPageProps {
  onLogin: (userId: string, email: string, name: string) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await signIn(loginEmail, loginPassword);

      if (error) {
        // Check if error is about invalid credentials (user might not exist)
        if (error.includes("Email atau password salah")) {
          toast.error("Akun Tidak Ditemukan atau Password Salah", {
            description:
              'Pastikan Anda sudah mendaftar. Jika belum, silakan klik tab "Sign Up" untuk membuat akun baru.',
            duration: 5000,
          });
        } else {
          toast.error(error, {
            description: "Periksa kembali email dan password Anda",
            duration: 4000,
          });
        }
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Get user profile
        const { getCurrentUser } = await import("../lib/auth");
        const profile = await getCurrentUser();

        if (profile) {
          onLogin(profile.id, profile.email, profile.name);
          toast.success("Login berhasil!", {
            description: `Selamat datang kembali, ${profile.name}!`,
            duration: 3000,
          });
        } else {
          toast.error("Gagal mengambil data profil", {
            description: "Silakan coba login lagi",
            duration: 4000,
          });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Terjadi kesalahan saat login", {
        description: "Silakan coba beberapa saat lagi",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!signupName.trim()) {
      toast.error("Nama lengkap harus diisi", {
        description: "Masukkan nama lengkap Anda untuk melanjutkan",
        duration: 3000,
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast.error("Password minimal 6 karakter", {
        description: "Gunakan kombinasi huruf dan angka untuk keamanan",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp(
        signupEmail,
        signupPassword,
        signupName
      );

      if (error) {
        // Check if it's a "user already exists" error
        if (
          error.includes("sudah terdaftar") ||
          error.includes("already registered")
        ) {
          toast.error("Email Sudah Terdaftar", {
            description:
              '⚠️ Email ini sudah memiliki akun. Silakan login menggunakan tab "Login" atau gunakan email lain untuk mendaftar.',
            duration: 6000,
            action: {
              label: "Ke Login",
              onClick: () => {
                // Switch to login tab
                const loginTab = document.querySelector(
                  '[value="login"]'
                ) as HTMLButtonElement;
                if (loginTab) loginTab.click();
              },
            },
          });
        } else {
          toast.error(error, {
            description: "Periksa kembali informasi yang Anda masukkan",
            duration: 4000,
          });
        }
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Use the user data from signup response
        const userId = data.user.id;
        const userName = signupName;
        const userEmail = signupEmail;

        onLogin(userId, userEmail, userName);
        toast.success("Akun berhasil dibuat!", {
          description: `Selamat datang di Freshify, ${userName}!`,
          duration: 3000,
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Terjadi kesalahan saat membuat akun", {
        description: "Silakan coba beberapa saat lagi",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <img src="././public/logo1.png" alt="Freshify logo" />
            </div>
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-2 text-2xl sm:text-3xl font-bold">
              Freshify
            </h1>
            <p className="text-gray-700 text-sm sm:text-base px-4">
              Makanan & Minuman Sehat untuk Hidup Lebih Baik
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-11">
              <TabsTrigger value="login" className="text-sm sm:text-base">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm sm:text-base">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-xl sm:text-2xl">
                    Masuk ke Akun Anda
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Masukkan email dan password untuk melanjutkan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Info Alert */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">⚠️ Belum punya akun?</p>
                      <p className="text-xs text-blue-700 mb-1">
                        Klik tab <strong>"Sign Up"</strong> di atas untuk
                        membuat akun baru terlebih dahulu.
                      </p>
                      <p className="text-xs text-blue-600 italic">
                        Setelah mendaftar, Anda bisa langsung login dengan akun
                        tersebut.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="nama@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowLoginPassword(!showLoginPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="remember-me"
                        className="text-sm text-gray-700 cursor-pointer select-none"
                      >
                        Ingat saya
                      </label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        "Masuk"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-xl sm:text-2xl">
                    Buat Akun Baru
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Daftar untuk mulai berbelanja produk sehat
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Requirements Info */}
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium mb-2">
                      ✅ Syarat Pendaftaran:
                    </p>
                    <ul className="text-xs text-green-700 space-y-1 ml-4">
                      <li>
                        ✓ Email yang valid dan <strong>belum terdaftar</strong>
                      </li>
                      <li>✓ Password minimal 6 karakter</li>
                      <li>✓ Nama lengkap Anda</li>
                    </ul>
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-xs text-green-600 mb-1">
                        🎉 Setelah berhasil mendaftar, Anda langsung bisa
                        berbelanja!
                      </p>
                      <p className="text-xs text-orange-600 font-medium">
                        ⚠️ Sudah punya akun? Klik tab "Login" di atas untuk
                        masuk.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nama Lengkap</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Nama Anda"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="nama@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowSignupPassword(!showSignupPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        "Daftar"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
