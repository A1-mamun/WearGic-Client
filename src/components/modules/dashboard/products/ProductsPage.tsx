import { getAllProducts } from "@/services/product";
import Products from "./Products";

const ProductsPage = async () => {
  const products = await getAllProducts();

  return <Products productsData={products.data} />;
};

export default ProductsPage;
