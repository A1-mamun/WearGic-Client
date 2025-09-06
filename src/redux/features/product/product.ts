import { baseApi } from "@/redux/api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addProduct: build.mutation({
      query: (productInfo) => ({
        url: "/product/create-product",
        method: "POST",
        body: productInfo,
      }),
    }),
    getAllProducts: build.query({
      query: () => ({
        url: `/product/products`,
        method: "GET",
      }),
    }),
  }),
});

export const { useAddProductMutation, useGetAllProductsQuery } = productApi;
