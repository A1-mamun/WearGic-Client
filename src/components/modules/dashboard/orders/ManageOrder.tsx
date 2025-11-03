"use client";
import { useEffect, useMemo, useState } from "react";
import { OrderFilters } from "./OrderFilters";
import { OrderTable } from "./OrderTable";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/order/order";
import { IOrderResponse } from "@/types/order";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { toast } from "sonner";

const ManageOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderStatus, setOrderStatus] = useState("ALL");
  const [dateRange, setDateRange] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<IOrderResponse | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // Items per page

  // ✅ Automatically calculate fromDate & toDate based on dateRange
  const { fromDate, toDate } = useMemo(() => {
    const now = new Date();
    let from: Date | undefined;
    let to: Date | undefined;

    switch (dateRange) {
      case "TODAY":
        from = new Date(now.setHours(0, 0, 0, 0));
        to = new Date();
        break;
      case "WEEK":
        from = new Date(now);
        from.setDate(now.getDate() - 7);
        to = new Date();
        break;
      case "MONTH":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        to = new Date();
        break;
      case "YEAR":
        from = new Date(now.getFullYear(), 0, 1);
        to = new Date();
        break;
      default:
        from = undefined;
        to = undefined;
    }

    return {
      fromDate: from ? from.toISOString().split("T")[0] : undefined,
      toDate: to ? to.toISOString().split("T")[0] : undefined,
    };
  }, [dateRange]);

  // ✅ Query for orders
  const {
    data: ordersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllOrdersQuery({
    page: currentPage,
    limit,
    searchTerm: searchTerm || undefined,
    orderStatus: orderStatus !== "ALL" ? orderStatus : undefined,
    fromDate,
    toDate,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  useEffect(() => {
    if (ordersData?.meta) {
      const totalPages = Math.ceil(
        (ordersData?.meta?.total || 0) / (ordersData?.meta?.limit || limit)
      );
      setTotalPages(totalPages);
    }
  }, [ordersData]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: IOrderResponse["orderStatus"]
  ) => {
    const toastId = toast.loading("Updating order status...");
    try {
      await updateOrderStatus({ orderId, newStatus });
      await refetch();

      toast.success("Order status updated successfully!", {
        id: toastId,
        duration: 2000,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.message || "Failed to update order status. Please try again.";
      toast.error(message, { id: toastId, duration: 3000 });
    } finally {
    }
  };

  const handleViewDetails = (order: IOrderResponse) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  //   const handleEditOrder = (order: IOrderResponse) => {
  //     setSelectedOrder(order);
  //   };

  //   const handleUpdateOrder = (updatedOrder: IOrderResponse) => {
  //     setSelectedOrder(updatedOrder);
  //   };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-balance">
              Orders Management
            </h1>
            <p className="text-muted-foreground">Manage your order catalog</p>
          </div>
        </div>
        <OrderFilters
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={orderStatus}
          onStatusChange={setOrderStatus}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <OrderTable
          orders={ordersData?.data}
          onView={handleViewDetails}
          isFetching={isFetching}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onUpdateStatus={handleUpdateStatus}
          totalPages={totalPages}
          loading={isLoading || isFetching}
        />
      </div>
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default ManageOrder;
