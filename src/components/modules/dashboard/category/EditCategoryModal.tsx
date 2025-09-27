/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { TCategory } from "@/types/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateCategoryMutation } from "@/redux/features/category/category";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters long")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  parentId: z
    .string()
    .uuid({ message: "Invalid parent category ID" })
    .nullable(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: TCategory | null;
  categories: TCategory[];
  refetch: () => void;
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
  categories,
  refetch,
}: EditCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const [updateCategory] = useUpdateCategoryMutation();

  const onSubmit = async (data: CategoryFormData) => {
    if (!category) return;

    setIsSubmitting(true);
    try {
      await updateCategory({ id: category.id, categoryInfo: data }).unwrap();
      toast.success("Category updated successfully");
      setIsSubmitting(false);
      reset();
      onClose();
      refetch();
    } catch (error: any) {
      toast.error(error.data.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                {...register("name")}
                defaultValue={category.name}
                placeholder="Enter category name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category</Label>
              <Controller
                control={control} // comes from useForm()
                defaultValue={category.parentId || ""}
                name="parentId"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id as string}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.parentId && (
                <p className="text-sm text-red-500">
                  {errors.parentId.message}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
