/* eslint-disable no-unused-vars */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TProduct } from "@/types/product";

import Row from "./Row";

interface ProductsTableProps {
  products: TProduct[];
  onEdit: (product: TProduct) => void;
  onDelete: (product: TProduct) => void;
  onView: (product: TProduct) => void;
}

const ProductsTable = ({
  products,
  onEdit,
  onDelete,
  onView,
}: ProductsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Original Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground"
              >
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <Row
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
