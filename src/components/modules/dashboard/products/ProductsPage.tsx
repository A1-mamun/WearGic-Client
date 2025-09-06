import { getAllProducts } from "@/services/product";
import Products from "./Products";
import { getAllCategories } from "@/services/category";

const ProductsPage = async () => {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <Products productsData={products.data} categoriesData={categories.data} />
  );
};

export default ProductsPage;
