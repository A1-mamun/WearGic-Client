import ProductDetails from "@/components/modules/product/ProductDetails";
import { getProductById } from "@/services/product";

const ProductDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  const product = await getProductById(id);

  //   console.log("Product Details:", product);
  if (!product) {
    return <div>Product not found</div>;
  }
  return <ProductDetails productData={product.data} />;
};

export default ProductDetailsPage;
