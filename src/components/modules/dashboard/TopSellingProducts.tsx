"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopSellingProduct } from "@/types/dashboard";

interface TopSellingProductsProps {
  data: TopSellingProduct[];
}

export function TopSellingProducts({ data }: TopSellingProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">No sales data yet.</p>
        )}
        {data.map((product, index) => (
          <div key={product.id} className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-4">
              {index + 1}
            </span>
            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
              {product.coverImageUrl && (
                <Image
                  src={product.coverImageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {product.totalSold} sold · ৳{product.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
