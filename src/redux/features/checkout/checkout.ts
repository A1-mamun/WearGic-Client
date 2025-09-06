import { baseApi } from "@/redux/api/baseApi";

const checkoutApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addCoupon: build.mutation({
      query: (couponInfo) => ({
        url: "/checkout/create-order",
        method: "POST",
        body: couponInfo,
      }),
    }),
  }),
});

export const { useAddCouponMutation } = checkoutApi;
