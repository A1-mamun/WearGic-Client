import AllProducts from "@/components/modules/product/AllProducts";
import { getAllProducts } from "@/services/product";

const Products = async () => {
  const products = await getAllProducts();
  const categories = await fetch("http://localhost:5000/categories");
  const genders = await fetch("http://localhost:5000/genders");
  const sortOptions = await fetch("http://localhost:5000/sortOptions");

  const allCategories = await categories.json();
  const allGenders = await genders.json();
  const allSortOptions = await sortOptions.json();

  return (
    <AllProducts
      products={products}
      categories={allCategories}
      genderOptions={allGenders}
      sortOptions={allSortOptions}
    />
  );
};

export default Products;
