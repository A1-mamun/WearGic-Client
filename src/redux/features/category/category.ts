import { baseApi } from "../../api/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addCategory: build.mutation({
      query: (categoryInfo) => ({
        url: "/category/create",
        method: "POST",
        body: categoryInfo,
      }),
    }),
    getAllCategories: build.query({
      query: () => ({
        url: `/category/categories`,
        method: "GET",
      }),
    }),
  }),
});

export const { useAddCategoryMutation, useGetAllCategoriesQuery } = categoryApi;
