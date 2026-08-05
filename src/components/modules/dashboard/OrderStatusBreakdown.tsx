"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderStatusCount } from "@/types/dashboard";

const STATUS_CONFIG: Record<
  OrderStatusCount["status"],
  { label: string; className: string }
> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  PROCESSING: { label: "Processing", className: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Shipped", className: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

interface OrderStatusBreakdownProps {
  data: OrderStatusCount[];
}

export function OrderStatusBreakdown({ data }: OrderStatusBreakdownProps) {
  const total = data.reduce((acc, d) => acc + d.count, 0) || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item) => {
          const config = STATUS_CONFIG[item.status];
          const percent = Math.round((item.count / total) * 100);

          return (
            <div key={item.status} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <Badge variant="secondary" className={config.className}>
                  {config.label}
                </Badge>
                <span className="text-muted-foreground">
                  {item.count} ({percent}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
