/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { TCategory } from "@/types/category";
import { useDeleteCategoryMutation } from "@/redux/features/category/category";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: TCategory | null;
  refetch: () => void;
}

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
  refetch,
}: DeleteCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDelete = async () => {
    if (!category) return;
    setIsSubmitting(true);

    try {
      await deleteCategory(category.id).unwrap();
      toast.success("Category deleted successfully");
      onClose();
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Category Name:</span>
              <span>{category?.name}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete the category &quot;{category?.name}
            &quot;? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
