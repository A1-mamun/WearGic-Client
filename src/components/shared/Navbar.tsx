"use client";

import React, { useState } from "react";
import { User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import CartSidebar from "../modules/cart/CartSidebar";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Image from "next/image";
import logo from "../../../public/Weargic_Logo_white.png";
import mart from "../../../public/Mart_icon.png";
import { useUser } from "@/contexts/userContext";
import { logoutUser } from "@/services/auth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, refreshUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { name: "Home", path: "/" },
    // { name: "All Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "FAQ", path: "/faq" },
  ];

  const handleLogOut = () => {
    logoutUser();
    refreshUser();
    toast.success("Logged out successfully");
    // router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary-foreground backdrop-blur-md shadow-elegant h-14 md:h-16 ">
      <div className="container mx-auto px-3 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-smooth"
          >
            <Image
              src={logo}
              alt="WearGic"
              width={250}
              height={50}
              className="h-7 w-32 lg:h-11 lg:w-52"
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
                  className={`font-medium transition-smooth duration-500 relative group text-base lg:text-lg ${
                    isActive
                      ? "text-primary font-semibold" // ⬅️ Active color
                      : "text-white hover:text-white/80"
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
            {user && user.role === "ADMIN" && (
              <Link
                href="/dashboard"
                className={`font-medium transition-smooth duration-500 relative group text-base lg:text-lg ${
                  pathname === "/dashboard"
                    ? "text-primary font-semibold"
                    : "text-white hover:text-white/80"
                }`}
              >
                Dashboard
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-accent transition-all duration-300 ${
                    pathname === "/admin" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            )}
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
                // size="icon"
                className="flex ring-2 ring-primary rounded-full w-6 h-6 md:w-8 md:h-8"
                onClick={() => router.push(`signin`)}
              >
                <User />
              </Button>
            )}

            {/* <ThemeToggle /> */}

            <CartSidebar>
              <Image
                src={mart}
                alt="Cart"
                width={40}
                height={40}
                className="h-10 w-10 md:h-11 md:w-11 lg:h-[50px] lg:w-[50px] cursor-pointer hover:opacity-80 transition-smooth duration-500"
              />
            </CartSidebar>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="lg:hidden bg-primary h-7 w-7 md:h-[36px] md:w-[36px]"
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
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          className={`lg:hidden py-4 border-y border-border bg-primary-foreground backdrop-blur-xs shadow-elegant transform transition-all duration-1000 ease-in-out ${
            isMenuOpen ? "" : ""
          }`}
        >
          <div className="flex flex-col">
            {navigationItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={` font-medium transition-smooth py-2 last:border-0 px-2 ${
                    isActive
                      ? "text-primary font-semibold hover:text-primary/80"
                      : "text-white hover:text-white/80"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            {user && user.role === "ADMIN" && (
              <Link
                href="/dashboard"
                className={` font-medium transition-smooth py-2 last:border-0 px-2 ${
                  pathname === "/dashboard"
                    ? "text-primary font-semibold hover:text-primary/80"
                    : "text-white hover:text-white/80"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
