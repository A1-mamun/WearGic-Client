"use client";

import { useGetProductByIdQuery } from "@/redux/features/product/product";
import ProductDetails from "./ProductDetails";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import { ProductError } from "@/components/shared/ProductError";
import ProductNotFound from "@/components/shared/ProductNotFound";
import SuggestedProducts from "./SuggestedProducts";

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
  return (
    <div>
      <ProductDetails productData={product.data} />

      <SuggestedProducts product={product.data} />
    </div>
  );
};

export default SingleProduct;
