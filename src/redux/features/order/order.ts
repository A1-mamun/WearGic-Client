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
      query: () => ({
        url: `/order/orders`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetAllOrdersQuery } = orderApi;
