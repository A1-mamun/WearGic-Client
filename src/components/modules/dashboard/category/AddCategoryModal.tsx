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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "./categories-page";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  productCount: z.number().min(0).default(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => void;
  existingCategories: Category[];
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAdd,
  existingCategories,
}: AddCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    clearErrors,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      isActive: true,
      productCount: 0,
    },
  });

  const watchName = watch("name");

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    setValue("slug", generateSlug(name));
    clearErrors("name");
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);

    try {
      // Check if slug already exists
      const slugExists = existingCategories.some(
        (cat) => cat.slug === data.slug
      );
      if (slugExists) {
        throw new Error("A category with this slug already exists");
      }

      // Find parent category name if parentId is provided
      const parentCategory = data.parentId
        ? existingCategories.find((cat) => cat.id === data.parentId)
        : null;

      const categoryData: Omit<Category, "id" | "createdAt" | "updatedAt"> = {
        name: data.name,
        description: data.description || undefined,
        slug: data.slug,
        parentId: data.parentId || undefined,
        parentName: parentCategory?.name || undefined,
        isActive: data.isActive,
        productCount: data.productCount,
      };

      onAdd(categoryData);
      reset();
    } catch (error) {
      console.error("Error adding category:", error);
      alert(error instanceof Error ? error.message : "Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Get root categories for parent selection
  const rootCategories = existingCategories.filter((cat) => !cat.parentId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  onChange={handleNameChange}
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder="category-slug"
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter category description"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Category Hierarchy */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Category Hierarchy</h3>

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Category</Label>
              <Select
                onValueChange={(value) =>
                  setValue("parentId", value || undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    No Parent (Root Category)
                  </SelectItem>
                  {rootCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productCount">Initial Product Count</Label>
                <Input
                  id="productCount"
                  type="number"
                  min="0"
                  {...register("productCount", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.productCount && (
                  <p className="text-sm text-red-500">
                    {errors.productCount.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="isActive"
                  {...register("isActive")}
                  defaultChecked={true}
                />
                <Label htmlFor="isActive">Active Category</Label>
              </div>
            </div>
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
}
