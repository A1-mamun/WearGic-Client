"use client";

import { useGetProductByIdQuery } from "@/redux/features/product/product";
import ProductDetails from "./ProductDetails";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import { ProductError } from "@/components/shared/ProductError";
import ProductNotFound from "@/components/shared/ProductNotFound";

const SingleProduct = ({ id }: { id: string }) => {
  const {
    data: product,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetProductByIdQuery(id); // Replace with actual data fetching logic
  if (isLoading || isFetching) {
    return <ProductDetailsSkeleton />;
  }
  if (isError) {
    return <ProductError refetch={refetch} />;
  }
  if (!product) {
    return <ProductNotFound />;
  }
  return <ProductDetails productData={product.data} />;
};

export default SingleProduct;
