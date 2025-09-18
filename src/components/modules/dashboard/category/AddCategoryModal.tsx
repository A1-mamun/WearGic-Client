/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddCategoryMutation } from "@/redux/features/category/category";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z
    .string()
    .nonempty("Category name is required")
    .min(2, "Category name must be at least 2 characters long")
    .max(100, "Name must be less than 100 characters"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const AddCategoryModal = ({
  isOpen,
  onClose,
  refetch,
}: AddCategoryModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const [addCategory] = useAddCategoryMutation();

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);

    try {
      await addCategory(data).unwrap();
      toast.success("Category added successfully");
      reset();
      onClose();
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
