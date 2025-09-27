"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { TCategory } from "@/types/category";

interface ViewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: TCategory | null;
  categories: TCategory[];
}

const ViewCategoryModal = ({
  isOpen,
  onClose,
  category,
  categories,
}: ViewCategoryModalProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <h2 className="text-lg font-semibold">{category?.name}</h2>
          <p className="text-sm text-muted-foreground">
            Parent Category:{" "}
            {category?.parentId
              ? categories.find((cat) => cat.id === category.parentId)?.name
              : "None"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCategoryModal;
