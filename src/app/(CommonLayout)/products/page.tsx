"use client";
import AllProducts from "@/components/modules/product/AllProducts";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category";
import { useGetAllProductsQuery } from "@/redux/features/product/product";

const Products = () => {
  const { data: products, isLoading: loadingProducts } =
    useGetAllProductsQuery(undefined);

  const { data: categories, isLoading: loadingCategories } =
    useGetAllCategoriesQuery(undefined);
  const genders = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];
  const sortOptions = [
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  if (loadingProducts || loadingCategories) {
    return <div>Loading........</div>;
  }

  return (
    <AllProducts
      products={products?.data}
      categories={categories?.data}
      genderOptions={genders}
      sortOptions={sortOptions}
    />
  );
};

export default Products;
