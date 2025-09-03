"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Bell,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: BarChart3, label: "Products", href: "/dashboard/products" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-sidebar border border-sidebar-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 z-40 h-full bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:z-auto
        w-64 md:w-16 lg:w-64
      `}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center border-b border-sidebar-border px-6 md:px-4 lg:px-6">
            <h1 className="text-xl font-bold text-sidebar-foreground md:hidden lg:block">
              Dashboard
            </h1>
            <h1 className="text-xl font-bold text-sidebar-foreground hidden md:block lg:hidden">
              DB
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4 md:p-2 lg:p-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  asChild
                  className={`w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                    justify-start gap-3 md:justify-center md:gap-0 lg:justify-start lg:gap-3
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                        : ""
                    }`}
                  onClick={() => setIsOpen(false)}
                  title={item.label} // Tooltip for icon-only state
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="md:hidden lg:inline">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4 md:p-2 lg:p-4">
            <Card className="p-3 md:p-2 lg:p-3">
              <div className="flex items-center gap-3 md:justify-center lg:justify-start md:gap-0 lg:gap-3">
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-sm font-medium text-accent-foreground">
                    JD
                  </span>
                </div>
                <div className="flex-1 min-w-0 md:hidden lg:block">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    john@example.com
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </aside>
    </>
  );
}
