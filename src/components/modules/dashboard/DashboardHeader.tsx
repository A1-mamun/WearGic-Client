"use client";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { toast } from "sonner";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logOut, useCurrentUser } from "@/redux/features/auth/authSlice";

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);

  const handleLogOut = () => {
    dispatch(logOut());
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navigationItems = [
    { name: "Home", path: "/" },
    // { name: "All Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <header className="h-16 bg-sidebar border-b border-border flex items-center justify-between px-6 md:px-8">
      {/* Left side - Title */}
      <div className="flex items-center gap-4">
        <div className="ml-12 md:ml-0">
          <h2 className="text-lg font-semibold text-primary-foreground">
            Welcome back
          </h2>
        </div>
      </div>

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
                  : "text-primary-foreground hover:text-primary-foreground/80"
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
                : "text-primary-foreground hover:bg-primary-foreground/80"
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
          </div>
        </div>
      )}
    </header>
  );
}
