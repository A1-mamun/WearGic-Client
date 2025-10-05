"use client";
import { useGetAllProductsQuery } from "@/redux/features/product/product";
import Products from "./Products";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // Items per page
  const {
    data: products,
    isLoading: loadingProducts,
    refetch: refetchProducts,
    isFetching,
  } = useGetAllProductsQuery({
    page: currentPage,
    limit: limit,
    searchTerm: searchTerm || undefined,
  });
  const { data: categories, isLoading: loadingCategories } =
    useGetAllCategoriesQuery(undefined);

  useEffect(() => {
    if (products?.meta) {
      const totalPages = Math.ceil(
        (products?.meta?.total || 0) / (products?.meta?.limit || limit)
      );
      setTotalPages(totalPages);
    }
  }, [products]);

  return (
    <div className="h-full">
      <Products
        productsData={products?.data}
        categoriesData={categories?.data}
        refetchProducts={refetchProducts}
        isFetching={isFetching}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loadingProducts || loadingCategories || isFetching}
      />
    </div>
  );
};

export default ProductsPage;
