"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { LowStockProduct } from "@/types/dashboard";

interface LowStockAlertProps {
  data: LowStockProduct[];
}

export function LowStockAlert({ data }: LowStockAlertProps) {
  if (data.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700 text-base">
          <AlertTriangle className="h-4 w-4" />
          Low Stock — {data.length} product{data.length > 1 ? "s" : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between text-sm border-b border-amber-100 last:border-0 pb-2 last:pb-0"
          >
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.code}</p>
            </div>
            <span className="text-amber-700 font-semibold">
              {product.totalStock} left
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
