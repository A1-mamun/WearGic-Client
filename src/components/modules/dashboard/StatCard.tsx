"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "default" | "warning" | "danger";
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "default",
}: StatCardProps) {
  const accentClasses = {
    default: "bg-primary/10 text-primary",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-100 text-red-600",
  };

  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={cn("p-3 rounded-lg", accentClasses[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
