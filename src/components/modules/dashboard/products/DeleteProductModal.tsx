/* eslint-disable no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TProduct } from "@/types/product";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (productId: string) => void;
  product: TProduct;
}

export function DeleteProductModal({
  isOpen,
  onClose,
  onDelete,
  product,
}: DeleteProductModalProps) {
  const handleDelete = () => {
    onDelete(product.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{product.name}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
