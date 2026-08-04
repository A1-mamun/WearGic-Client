import { baseApi } from "@/redux/api/baseApi";
import {
  CreateProductPayload,
  UpdateProductPayload,
  TProduct,
  TProductListResponse,
  GetProductsParams,
} from "@/types/product";

const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addProduct: build.mutation<CreateProductPayload, CreateProductPayload>({
      query: (payload) => ({
        url: "/product/create-product",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: build.mutation<
      unknown,
      { id: string; payload: UpdateProductPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/product/update-product/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id },
      ],
    }),

    getAllProducts: build.query<TProductListResponse, GetProductsParams | void>(
      {
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
        providesTags: (result) =>
          result?.data
            ? [
                ...result.data.map((product: TProduct) => ({
                  type: "Product" as const,
                  id: product.id,
                })),
                { type: "Product" as const, id: "LIST" },
              ]
            : [{ type: "Product" as const, id: "LIST" }],
      },
    ),

    getProductById: build.query<{ data: TProduct }, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    deleteProduct: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id },
      ],
    }),
    restoreProduct: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/product/restore-product/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id },
      ],
    }),
    hardDeleteProduct: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/product/hard-delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id },
      ],
    }),
  }),
});

export const {
  useAddProductMutation,
  useUpdateProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useDeleteProductMutation,
  useRestoreProductMutation,
  useHardDeleteProductMutation,
} = productApi;
