import { getAllCategories } from "@/services/category";
import Categories from "./Categories";

const CategoriesPage = async () => {
  const categories = await getAllCategories();

  return <Categories categoriesData={categories.data} />;
};

export default CategoriesPage;
