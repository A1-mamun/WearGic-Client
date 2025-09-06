"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import CategoriesTable from "./categories-table";
import AddCategoryModal from "./add-category-modal";
import EditCategoryModal from "./edit-category-modal";
import DeleteCategoryModal from "./delete-category-modal";
import { TCategory } from "@/types/category";

const Categories = ({ categoriesData }: { categoriesData: TCategory[] }) => {
  const [categories, setCategories] = useState<TCategory[]>(categoriesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(
    null
  );

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = (
    categoryData: Omit<TCategory, "id" | "createdAt" | "updatedAt">
  ) => {
    const newCategory: TCategory = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
    setIsAddModalOpen(false);
  };

  const handleEditCategory = (
    categoryData: Omit<TCategory, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedCategory) return;

    const updatedCategory: TCategory = {
      ...categoryData,
      id: selectedCategory.id,
    };

    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id ? updatedCategory : cat
      )
    );
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;

    setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const handleEditClick = (category: TCategory) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (category: TCategory) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Categories Management
          </h1>
          <p className="text-muted-foreground">
            Manage your product categories and organize your inventory
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories Table */}
      <CategoriesTable
        categories={filteredCategories}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
        existingCategories={categories}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onEdit={handleEditCategory}
        category={selectedCategory}
        existingCategories={categories}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onDelete={handleDeleteCategory}
        category={selectedCategory}
      />
    </div>
  );
};

export default Categories;
