"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

import { TCategory } from "@/types/category";
import CategoriesTable from "./CategoriesTable";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeletCategoryModal";
import ViewCategoryModal from "./ViewCategoryModal";

const Categories = ({
  categoriesData,
  refetch,
  isLoading,
  isFetching,
}: {
  categoriesData: TCategory[];
  refetch: () => void;
  isLoading: boolean;
  isFetching: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(
    null
  );

  const filteredCategories =
    categoriesData?.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleEditClick = (category: TCategory) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (category: TCategory) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
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
        onView={handleViewClick}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        refetch={refetch}
        categories={categoriesData}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        refetch={refetch}
        category={selectedCategory}
        categories={categoriesData}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        refetch={refetch}
      />
      <ViewCategoryModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        categories={categoriesData}
      />
    </div>
  );
};

export default Categories;
