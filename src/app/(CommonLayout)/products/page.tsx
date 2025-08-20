import AllProducts from "@/components/modules/product/AllProducts";
import { getAllCategories } from "@/services/category";
import { getAllProducts } from "@/services/product";

const Products = async () => {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  const genders = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];
  const sortOptions = [
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  return (
    <AllProducts
      products={products.data}
      categories={categories.data}
      genderOptions={genders}
      sortOptions={sortOptions}
    />
  );
};

export default Products;
