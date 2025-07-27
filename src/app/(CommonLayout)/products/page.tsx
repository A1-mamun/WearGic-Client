import AllProducts from "@/components/modules/product/AllProducts";

const Products = async () => {
  const products = await fetch("http://localhost:5000/products");
  const categories = await fetch("http://localhost:5000/categories");
  const genders = await fetch("http://localhost:5000/genders");
  const sortOptions = await fetch("http://localhost:5000/sortOptions");

  const allProducts = await products.json();
  const allCategories = await categories.json();
  const allGenders = await genders.json();
  const allSortOptions = await sortOptions.json();

  return (
    <AllProducts
      products={allProducts}
      categories={allCategories}
      genderOptions={allGenders}
      sortOptions={allSortOptions}
    />
  );
};

export default Products;
