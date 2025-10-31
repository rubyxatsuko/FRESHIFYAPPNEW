import {
  ShoppingCart,
  User,
  Leaf,
  BarChart3,
  Newspaper,
  Camera,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "../lib/icons";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartItemCount: number;
  userName?: string;
  userRole?: "user" | "admin";
  onLogout?: () => void;
  isAuthenticated: boolean;
  onShowAuth?: () => void;
}

export function Navbar({
  currentPage,
  onNavigate,
  cartItemCount,
  userName,
  userRole,
  onLogout,
  isAuthenticated,
  onShowAuth,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => handleNavigate("home")}
              className="flex items-center space-x-2 group"
            >
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-700 transition">
                <img src="././public/logo1.png" alt="Freshify logo" />
              </div>
              <span className="text-lg sm:text-xl bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-bold">
                Freshify
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            <Button
              variant={currentPage === "home" ? "default" : "ghost"}
              onClick={() => handleNavigate("home")}
              className={
                currentPage === "home" ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              Beranda
            </Button>
            {isAuthenticated && (
              <>
                <Button
                  variant={currentPage === "scanner" ? "default" : "ghost"}
                  onClick={() => handleNavigate("scanner")}
                  className={
                    currentPage === "scanner"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scanner
                </Button>
                <Button
                  variant={currentPage === "calculator" ? "default" : "ghost"}
                  onClick={() => handleNavigate("calculator")}
                  className={
                    currentPage === "calculator"
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Kalkulator
                </Button>
              </>
            )}
            <Button
              variant={currentPage === "articles" ? "default" : "ghost"}
              onClick={() => handleNavigate("articles")}
              className={
                currentPage === "articles"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              <Newspaper className="w-4 h-4 mr-2" />
              Artikel
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart Button */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                onClick={() => handleNavigate("cart")}
                className="relative p-2"
                size="sm"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigate("profile")}
                    className="flex items-center space-x-2"
                    size="sm"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline max-w-[100px] truncate">
                      {userName}
                    </span>
                  </Button>
                  <Button variant="outline" onClick={onLogout} size="sm">
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={onShowAuth}
                    className="hidden md:flex items-center space-x-2"
                    size="sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Masuk</span>
                  </Button>
                  <Button
                    onClick={onShowAuth}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <UserPlus className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Daftar</span>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-bold">
                      Freshify
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Auth Section */}
                  {isAuthenticated ? (
                    <div className="pb-4 border-b">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {userName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Member Freshify
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleNavigate("profile");
                        }}
                        className="w-full mb-2"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profil Saya
                      </Button>
                    </div>
                  ) : (
                    <div className="pb-4 border-b space-y-2">
                      <Button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onShowAuth?.();
                        }}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Daftar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onShowAuth?.();
                        }}
                        className="w-full"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Masuk
                      </Button>
                    </div>
                  )}

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant={currentPage === "home" ? "default" : "ghost"}
                      onClick={() => handleNavigate("home")}
                      className={`w-full justify-start ${
                        currentPage === "home"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }`}
                    >
                      Beranda
                    </Button>

                    {isAuthenticated && (
                      <>
                        <Button
                          variant={
                            currentPage === "scanner" ? "default" : "ghost"
                          }
                          onClick={() => handleNavigate("scanner")}
                          className={`w-full justify-start ${
                            currentPage === "scanner"
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }`}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Barcode Scanner
                        </Button>
                        <Button
                          variant={
                            currentPage === "calculator" ? "default" : "ghost"
                          }
                          onClick={() => handleNavigate("calculator")}
                          className={`w-full justify-start ${
                            currentPage === "calculator"
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }`}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Kalkulator Kalori
                        </Button>
                      </>
                    )}

                    <Button
                      variant={currentPage === "articles" ? "default" : "ghost"}
                      onClick={() => handleNavigate("articles")}
                      className={`w-full justify-start ${
                        currentPage === "articles"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }`}
                    >
                      <Newspaper className="w-4 h-4 mr-2" />
                      Artikel Kesehatan
                    </Button>
                  </div>

                  {/* Logout Button */}
                  {isAuthenticated && (
                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          onLogout?.();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Keluar
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
