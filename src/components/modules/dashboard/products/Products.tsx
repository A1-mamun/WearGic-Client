"use client";
import ProductsTable from "./ProductsTable";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import { DeleteProductModal } from "./DeleteProductModal";
import ViewProductModal from "./ViewProductModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TProduct } from "@/types/product";
import { Plus, Search } from "lucide-react";

const Products = ({ productsData }: { productsData: TProduct[] }) => {
  const [products, setProducts] = useState<TProduct[]>(productsData || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      !product.isDeleted &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProduct = (
    newProduct: Omit<TProduct, "id" | "createdAt" | "updatedAt">
  ) => {
    const product: TProduct = {
      ...newProduct,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts([...products, product]);
    setIsAddModalOpen(false);
  };

  const handleEditProduct = (updatedProduct: TProduct) => {
    setProducts(
      products.map((p) =>
        p.id === updatedProduct.id
          ? { ...updatedProduct, updatedAt: new Date() }
          : p
      )
    );
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(
      products.map((p) =>
        p.id === productId
          ? { ...p, isDeleted: true, updatedAt: new Date() }
          : p
      )
    );
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Table */}
        <ProductsTable
          products={filteredProducts}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onView={openViewModal}
        />

        {/* Modals */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProduct}
        />

        {selectedProduct && (
          <>
            <EditProductModal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedProduct(null);
              }}
              onEdit={handleEditProduct}
              product={selectedProduct}
            />

            <DeleteProductModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedProduct(null);
              }}
              onDelete={handleDeleteProduct}
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
