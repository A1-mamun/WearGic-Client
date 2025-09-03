"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Bell, Search, User } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-16 bg-sidebar border-b border-border flex items-center justify-between px-6 md:px-8">
      {/* Left side - Title */}
      <div className="flex items-center gap-4">
        <div className="ml-12 md:ml-0">
          <h2 className="text-lg font-semibold text-primary-foreground">
            Welcome back, John!
          </h2>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
