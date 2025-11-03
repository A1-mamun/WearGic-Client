import { baseApi } from "@/redux/api/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation({
      query: (orderInfo) => ({
        url: "/order/place-order",
        method: "POST",
        body: orderInfo,
      }),
    }),
    getAllOrders: build.query({
      query: (params) => {
        const query = new URLSearchParams({
          ...(params?.orderStatus && { orderStatus: params.orderStatus }),
          ...(params?.fromDate && { fromDate: params.fromDate }),
          ...(params?.toDate && { toDate: params.toDate }),
          ...(params?.searchTerm && { searchTerm: params.searchTerm }),
          ...(params?.page && { page: String(params.page) }),
          ...(params?.limit && { limit: String(params.limit) }),
          ...(params?.sortBy && { sortBy: params.sortBy }),
          ...(params?.sortOrder && { sortOrder: params.sortOrder }),
        }).toString();

        return {
          url: `/admin/orders?${query}`,
          method: "GET",
        };
      },
    }),
    updateOrderStatus: build.mutation({
      query: ({ orderId, newStatus }) => ({
        url: `/admin/update-order-status/${orderId}`,
        method: "PATCH",
        body: { orderStatus: newStatus },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
