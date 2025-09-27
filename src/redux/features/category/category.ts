import { baseApi } from "@/redux/api/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addCategory: build.mutation({
      query: (categoryInfo) => ({
        url: "/category/create",
        method: "POST",
        body: categoryInfo,
      }),
    }),
    updateCategory: build.mutation({
      query: ({ id, categoryInfo }) => ({
        url: `/category/update/${id}`,
        method: "PATCH",
        body: categoryInfo,
      }),
    }),
    getAllCategories: build.query({
      query: () => ({
        url: `/category/categories`,
        method: "GET",
      }),
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/category/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
