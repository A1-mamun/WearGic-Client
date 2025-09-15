"use client";

import { useGetProductByIdQuery } from "@/redux/features/product/product";
import ProductDetails from "./ProductDetails";

const SingleProduct = ({ id }: { id: string }) => {
  const { data: product } = useGetProductByIdQuery(id); // Replace with actual data fetching logic
  if (!product) {
    return <div>Product not found</div>;
  }
  return <ProductDetails productData={product.data} />;
};

export default SingleProduct;
