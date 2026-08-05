/* eslint-disable no-unused-vars */

"use client";
import ProductsTable from "./ProductsTable";
// import EditProductModal from "./EditProductModal";
import { DeleteProductModal } from "./DeleteProductModal";
import ViewProductModal from "./ViewProductModal";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TProduct } from "@/types/product";
import { Plus, Search } from "lucide-react";
import { AddProductModal } from "./AddProductModal";
import { TCategory } from "@/types/category";
import { EditProductModal } from "./EditProductModal";

const Products = ({
  productsData,
  categoriesData,
  refetchProducts,
  isFetching,
  currentPage,
  setCurrentPage,
  totalPages,
  searchTerm,
  setSearchTerm,
  loading,
}: {
  productsData: TProduct[];
  categoriesData: TCategory[];
  refetchProducts: () => void;
  isFetching: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loading: boolean;
}) => {
  // const [products, setProducts] = useState<TProduct[]>(productsData || []);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const isFirstRender = useRef(true);
  // Update products when productsData changes
  // useEffect(() => {
  //   if (productsData) {
  //     setProducts(productsData);
  //   }
  // }, [productsData]);

  // Debounce search - only reset page if search term actually changed
  useEffect(() => {
    // Skip the effect on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      // Only update if the search term actually changed
      if (localSearchTerm !== searchTerm) {
        setSearchTerm(localSearchTerm);
        setCurrentPage(1); // Reset to first page only when search changes
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearchTerm]);

  const filteredProducts = productsData?.filter(
    (product) => !product.isDeleted,
  );

  // const handleEditProduct = (updatedProduct: TProduct) => {
  //   setProducts(
  //     products.map((p) =>
  //       p.id === updatedProduct.id
  //         ? { ...updatedProduct, updatedAt: new Date() }
  //         : p
  //     )
  //   );
  //   setIsEditModalOpen(false);
  //   setSelectedProduct(null);
  //   refetchProducts();
  // };

  // const handleDeleteProduct = (productId: string) => {
  //   setProducts(
  //     products.map((p) =>
  //       p.id === productId
  //         ? { ...p, isDeleted: true, updatedAt: new Date() }
  //         : p
  //     )
  //   );
  //   setIsDeleteModalOpen(false);
  //   setSelectedProduct(null);
  //   refetchProducts();
  // };

  const openEditModal = (product: TProduct) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product: TProduct) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (product: TProduct) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Products Management
            </h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Table */}
        <ProductsTable
          products={filteredProducts}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onView={openViewModal}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          isFetching={isFetching}
          loading={loading}
        />

        {/* Modals */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          categories={categoriesData}
          refetchProducts={refetchProducts}
        />

        {selectedProduct && (
          <>
            <EditProductModal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedProduct(null);
              }}
              product={selectedProduct}
              categories={categoriesData}
              // onEdit={handleEditProduct}
            />

            <DeleteProductModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedProduct(null);
              }}
              // onDelete={handleDeleteProduct}
              product={selectedProduct}
            />

            <ViewProductModal
              isOpen={isViewModalOpen}
              onClose={() => {
                setIsViewModalOpen(false);
                setSelectedProduct(null);
              }}
              product={selectedProduct}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
