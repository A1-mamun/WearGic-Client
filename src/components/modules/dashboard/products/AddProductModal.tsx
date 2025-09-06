"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, X } from "lucide-react";
import type { Product } from "./products-page";
import Image from "next/image";
import { TCategory } from "@/types/category";

const productImageSchema = z.object({
  file: z.instanceof(File).nullable(),
  color: z.string().min(1, "Color is required"),
  stock: z.number().min(0, "Stock must be 0 or greater"),
  isPrimary: z.boolean(),
  isActive: z.boolean(),
});

const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  originalPrice: z.string().optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a valid number greater than or equal to 0",
    }),
  category: z.string().min(1, "Category is required"),
  isNew: z.boolean(),
  gender: z.enum(["MALE", "FEMALE", "UNISEX"]).optional(),
  productImages: z
    .array(productImageSchema)
    .min(1, "At least one product image is required")
    .refine((images) => images.some((img) => img.isPrimary), {
      message: "At least one image must be marked as primary",
    })
    .refine((images) => images.filter((img) => img.isPrimary).length === 1, {
      message: "Only one image can be marked as primary",
    }),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: TCategory[];
  onAdd: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
}

interface ProductImageForm {
  file: File | null;
  color: string;
  stock: number;
  isPrimary: boolean;
  isActive: boolean;
  previewUrl?: string;
}

export function AddProductModal({
  isOpen,
  onClose,
  categories,
  onAdd,
}: AddProductModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      originalPrice: "",
      price: "",
      category: "",
      isNew: false,
      gender: undefined,
      productImages: [
        {
          file: null,
          color: "",
          stock: 0,
          isPrimary: true,
          isActive: true,
        },
      ],
    },
  });

  const [productImages, setProductImages] = useState<ProductImageForm[]>([
    {
      file: null,
      color: "",
      stock: 0,
      isPrimary: true,
      isActive: true,
    },
  ]);

  const onSubmit = async (data: ProductFormData) => {
    const formDataToSend = new FormData();

    formDataToSend.append("name", data.name);
    formDataToSend.append("description", data.description || "");
    formDataToSend.append("originalPrice", data.originalPrice || "");
    formDataToSend.append("price", data.price || "0");
    formDataToSend.append("category", data.category);
    formDataToSend.append("isNew", data.isNew.toString());
    formDataToSend.append("gender", data.gender || "");
    formDataToSend.append("isDeleted", "false");

    productImages.forEach((image, index) => {
      if (image.file) {
        formDataToSend.append(`images`, image.file);
        formDataToSend.append(
          `imageData_${index}`,
          JSON.stringify({
            color: image.color,
            stock: image.stock,
            isPrimary: image.isPrimary,
            isActive: image.isActive,
          })
        );
      }
    });

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const newProduct = await response.json();
        onAdd(newProduct);
        resetForm();
      } else {
        console.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const resetForm = () => {
    reset();
    setProductImages([
      {
        file: null,
        color: "",
        stock: 0,
        isPrimary: true,
        isActive: true,
      },
    ]);
  };

  const addProductImage = () => {
    setProductImages([
      ...productImages,
      {
        file: null,
        color: "",
        stock: 0,
        isPrimary: false,
        isActive: true,
      },
    ]);
    setValue("productImages", [
      ...productImages,
      {
        file: null,
        color: "",
        stock: 0,
        isPrimary: false,
        isActive: true,
      },
    ]);
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newImages = [...productImages];
    newImages[index].file = file;

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      newImages[index].previewUrl = previewUrl;
    } else {
      newImages[index].previewUrl = undefined;
    }

    setProductImages(newImages);
    setValue("productImages", newImages);
  };

  const removeProductImage = (index: number) => {
    if (productImages.length > 1) {
      const imageToRemove = productImages[index];

      if (imageToRemove.previewUrl) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      const newImages = productImages.filter((_, i) => i !== index);
      if (productImages[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      setProductImages(newImages);
      setValue("productImages", newImages);
    }
  };

  const updateProductImage = (
    index: number,
    field: keyof ProductImageForm,
    value: any
  ) => {
    const newImages = [...productImages];

    if (field === "isPrimary" && value) {
      newImages.forEach((img, i) => {
        img.isPrimary = i === index;
      });
    } else {
      newImages[index] = { ...newImages[index], [field]: value };
    }

    setProductImages(newImages);
    setValue("productImages", newImages);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="name"
                    {...field}
                    className={errors.name ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea id="description" {...field} rows={3} />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...field}
                    className={errors.price ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Controller
                name="originalPrice"
                control={control}
                render={({ field }) => (
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    {...field}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="UNISEX">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isNew"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isNew"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isNew">Mark as New Product</Label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Product Images & Colors
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProductImage}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Color Variant
              </Button>
            </div>

            {errors.productImages && (
              <p className="text-sm text-red-500">
                {errors.productImages.message}
              </p>
            )}

            {productImages.map((image, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Color Variant {index + 1}</span>
                  {productImages.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProductImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(index, e.target.files?.[0] || null)
                          }
                          className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-muted file:text-muted-foreground"
                        />
                        {image.file && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFileChange(index, null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {image.previewUrl && (
                        <div className="relative w-20 h-20 border rounded overflow-hidden">
                          <Image
                            src={image.previewUrl || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Color *</Label>
                    <Input
                      value={image.color}
                      onChange={(e) =>
                        updateProductImage(index, "color", e.target.value)
                      }
                      className={
                        errors.productImages?.[index]?.color
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.productImages?.[index]?.color && (
                      <p className="text-sm text-red-500">
                        {errors.productImages[index].color?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      value={image.stock}
                      onChange={(e) =>
                        updateProductImage(
                          index,
                          "stock",
                          Number.parseInt(e.target.value) || 0
                        )
                      }
                      className={
                        errors.productImages?.[index]?.stock
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.productImages?.[index]?.stock && (
                      <p className="text-sm text-red-500">
                        {errors.productImages[index].stock?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={image.isPrimary}
                      onCheckedChange={(checked) =>
                        updateProductImage(index, "isPrimary", !!checked)
                      }
                    />
                    <Label>Primary Image</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={image.isActive}
                      onCheckedChange={(checked) =>
                        updateProductImage(index, "isActive", !!checked)
                      }
                    />
                    <Label>Active</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
