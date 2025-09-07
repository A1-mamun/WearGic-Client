"use client";
import { useGetAllProductsQuery } from "@/redux/features/product/product";
import Products from "./Products";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category";

const ProductsPage = () => {
  const {
    data: products,
    isLoading: loadingProducts,
    refetch: refetchProducts,
    isFetching,
  } = useGetAllProductsQuery(undefined);
  const { data: categories, isLoading: loadingCategories } =
    useGetAllCategoriesQuery(undefined);

  if (loadingProducts || loadingCategories || isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <Products
      productsData={products?.data}
      categoriesData={categories?.data}
      refetchProducts={refetchProducts}
    />
  );
};

export default ProductsPage;
