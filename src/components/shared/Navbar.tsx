"use client";

import React, { useState } from "react";

import { ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import Link from "next/link";
import CartSidebar from "../modules/cart/CartSidebar";
import PhoneAuthModal from "../modules/auth/PhoneAuthModal";
// import { ThemeToggle } from "../ui/theme-toggle";
import { useUser } from "@/contexts/userContext";
import { logoutUser } from "@/services/auth";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Image from "next/image";
import logo from "../../../public/Weargic_Logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, refreshUser } = useUser();
  const pathname = usePathname();

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "All Products", path: "/products" },
    { name: "FAQ", path: "/faq" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const handleLogOut = async () => {
    await logoutUser();
    refreshUser();
    toast.success("Logged out successfully");
    // router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-smooth"
          >
            <Image
              src={logo}
              alt="WearGic"
              width={200}
              height={16}
              className="rounded-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`font-medium transition-smooth relative group ${
                    isActive
                      ? "text-primary font-semibold" // ⬅️ Active color
                      : "text-black/80 hover:text-black/60"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-accent transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-5">
                {/* Avatar Circle with first two letters */}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-8 rounded-full bg-accent font-bold flex items-center justify-center ring-2 ring-black text-primary">
                      {user.name?.slice(0, 2).toUpperCase() || "NA"}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm text-black font-medium">
                      {user.name || "NA"}
                    </p>
                  </TooltipContent>
                </Tooltip>

                {/* Sign Out Button with tooltip */}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleLogOut}
                      className="border-2 border-primary"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm text-black font-medium">Log Out</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={() => setAuthModalOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* <ThemeToggle /> */}

            <CartSidebar>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </CartSidebar>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="text-foreground hover:text-accent font-medium transition-smooth py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="flex items-center gap-5">
                    {/* Avatar Circle with first two letters */}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-8 h-8 rounded-full bg-accent font-bold flex items-center justify-center ring-2 ring-black text-primary">
                          {user.name?.slice(0, 2).toUpperCase() || "NA"}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm text-black font-medium">
                          {user.name || "NA"}
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Sign Out Button with tooltip */}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleLogOut}
                          className="border-2 border-primary"
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm text-black font-medium">
                          Log Out
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <PhoneAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </nav>
  );
};

export default Navbar;
