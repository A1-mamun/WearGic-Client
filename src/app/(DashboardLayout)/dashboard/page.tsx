"use client";

import { useGetDashboardOverviewQuery } from "@/redux/features/dashboard/dashboard";

import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Clock,
  Tag,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/modules/dashboard/StatCard";
import { LowStockAlert } from "@/components/modules/dashboard/LowStockAlert";
import { RevenueChart } from "@/components/modules/dashboard/RevenueChart";
import { OrderStatusBreakdown } from "@/components/modules/dashboard/OrderStatusBreakdown";
import { RecentOrdersTable } from "@/components/modules/dashboard/RecentOrdersTable";
import { TopSellingProducts } from "@/components/modules/dashboard/TopSellingProducts";

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetDashboardOverviewQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Revenue"
          value={`৳${data.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          label="Total Orders"
          value={data.totalOrders.toLocaleString()}
          icon={ShoppingCart}
        />
        <StatCard
          label="Total Products"
          value={data.totalProducts.toLocaleString()}
          icon={Package}
        />
        <StatCard
          label="Total Users"
          value={data.totalUsers.toLocaleString()}
          icon={Users}
        />
        <StatCard
          label="Pending Orders"
          value={data.pendingOrdersCount.toLocaleString()}
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="Low Stock Items"
          value={data.lowStockProductsCount.toLocaleString()}
          icon={Tag}
          accent={data.lowStockProductsCount > 0 ? "danger" : "default"}
        />
      </div>

      {data.lowStockProducts.length > 0 && (
        <LowStockAlert data={data.lowStockProducts} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={data.monthlyRevenue} />
        </div>
        <OrderStatusBreakdown data={data.orderStatusBreakdown} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable data={data.recentOrders} />
        </div>
        <TopSellingProducts data={data.topSellingProducts} />
      </div>
    </div>
  );
}
