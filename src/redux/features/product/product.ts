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
      query: (params) => {
        const query = new URLSearchParams({
          ...(params?.gender && { gender: params.gender }),
          ...(params?.category && { category: params.category }),
          ...(params?.searchTerm && { searchTerm: params.searchTerm }),
          ...(params?.page && { page: String(params.page) }),
          ...(params?.limit && { limit: String(params.limit) }),
          ...(params?.sortBy && { sortBy: params.sortBy }),
          ...(params?.sortOrder && { sortOrder: params.sortOrder }),
        }).toString();

        return {
          url: `/product/products?${query}`,
          method: "GET",
        };
      },
    }),
    getProductById: build.query({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
} = productApi;
