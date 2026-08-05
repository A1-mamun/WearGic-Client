export interface OrderStatusCount {
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  count: number;
}

export interface TopSellingProduct {
  id: string;
  name: string;
  totalSold: number;
  coverImageUrl: string | null;
  price: number;
}

export interface RecentOrder {
  id: string;
  orderId: string;
  customerName: string | null;
  grandTotal: number;
  orderStatus: OrderStatusCount["status"];
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  totalStock: number;
  code: string;
}

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
  orderCount: number;
}

export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrdersCount: number;
  lowStockProductsCount: number;
  activeCouponsCount: number;
  orderStatusBreakdown: OrderStatusCount[];
  topSellingProducts: TopSellingProduct[];
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  monthlyRevenue: MonthlyRevenuePoint[];
}
