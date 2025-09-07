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

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  return <Categories categoriesData={categories?.data} refetch={refetch} />;
};

export default CategoriesPage;
