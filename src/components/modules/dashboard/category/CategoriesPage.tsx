"use client";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category";
import Categories from "./Categories";

const CategoriesPage = () => {
  const {
    data: categories,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllCategoriesQuery(undefined);

  return (
    <Categories
      categoriesData={categories?.data}
      refetch={refetch}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export default CategoriesPage;
