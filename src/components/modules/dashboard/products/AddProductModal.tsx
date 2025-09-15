/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Image from "next/image";
import { TCategory } from "@/types/category";
import { useAddProductMutation } from "@/redux/features/product/product";
import { toast } from "sonner";

const specificationSchema = z.object({
  key: z.string().min(1, "Specification key is required"),
  value: z.string().min(1, "Specification value is required"),
});

const productImageSchema = z.object({
  file: z
    .custom<File | null>((val) => val instanceof File && val.size > 0, {
      message: "Product image is required",
    })
    .refine((file) => !file || file.size <= 10 * 1024 * 1024, {
      message: "Max file size is 10MB",
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "Only JPG, JPEG or PNG files are allowed",
      }
    ),
  color: z.string().min(1, "Color is required"),
  stock: z.number().nonnegative("Stock cannot be negative"),
  isPrimary: z.boolean(),
  isActive: z.boolean(),
});

const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  originalPrice: z
    .number()
    .nonnegative("Original price cannot be negative")
    .optional(),
  price: z.number().nonnegative("Price cannot be negative"),
  category: z.string().min(1, "Category is required"),
  isNew: z.boolean(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  productImages: z
    .array(productImageSchema)
    .min(1, "At least one product image is required")
    .refine((images) => images.some((img) => img.isPrimary), {
      message: "At least one image must be marked as primary",
    })
    .refine((images) => images.filter((img) => img.isPrimary).length === 1, {
      message: "Only one image can be marked as primary",
    }),
  specifications: z.array(specificationSchema).optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: TCategory[];
  refetchProducts: () => void;
}

interface ProductImageForm {
  file: File | null;
  color: string;
  stock: number;
  isPrimary: boolean;
  isActive: boolean;
  previewUrl?: string;
}

interface ProductSpecification {
  key: string;
  value: string;
}

const DEFAULT_SPECIFICATION_KEYS = [
  "Material",
  "Color",
  "Dimension",
  "Inner Pocket",
  "Handle",
  "Strap Material Type",
  "Lock Type",
  "Zipper",
  "Compartments",
  "Straps",
  "Origin",
];

export function AddProductModal({
  isOpen,
  onClose,
  categories,
  refetchProducts,
}: AddProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      originalPrice: 0,
      price: 0,
      category: "",
      isNew: false,
      gender: undefined,
      productImages: [
        {
          file: undefined,
          color: "",
          stock: 0,
          isPrimary: true,
          isActive: true,
        },
      ],
      specifications: DEFAULT_SPECIFICATION_KEYS.map((key) => ({
        key,
        value: "",
      })),
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

  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    DEFAULT_SPECIFICATION_KEYS.map((key) => ({ key, value: "" }))
  );

  const [addProduct] = useAddProductMutation();

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Adding product...");
    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(data));
    // Append product images to form data as productImages array without the file property
    if (productImages) {
      formDataToSend.append(
        "productImages",
        JSON.stringify(
          productImages.map((img) => {
            const { file, ...rest } = img;
            return rest;
          })
        )
      );
    }

    productImages.forEach((image) => {
      if (image.file) {
        formDataToSend.append("images", image.file);
      }
    });

    try {
      await addProduct(formDataToSend).unwrap();
      toast.success("Product added successfully", {
        id: toastId,
        duration: 2000,
      });
      resetForm();
      onClose();
      refetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Failed creating product!", {
        id: toastId,
        duration: 2000,
      });
    } finally {
      setIsSubmitting(false);
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
    setSpecifications(
      DEFAULT_SPECIFICATION_KEYS.map((key) => ({ key, value: "" }))
    );
  };

  const addSpecification = () => {
    const newSpecs = [...specifications, { key: "", value: "" }];
    setSpecifications(newSpecs);
    setValue("specifications", newSpecs);
  };

  const removeSpecification = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
    setValue("specifications", newSpecs);
  };

  const updateSpecification = (
    index: number,
    field: keyof ProductSpecification,
    value: string
  ) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecifications(newSpecs);
    setValue("specifications", newSpecs);
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
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <SelectTrigger className="w-full">
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
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    className={errors.originalPrice ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.originalPrice && (
                <p className="text-sm text-red-500">
                  {errors.originalPrice.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
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
                Product Specifications
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpecification}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Specification
              </Button>
            </div>

            {errors.specifications && (
              <p className="text-sm text-red-500">
                {errors.specifications.message}
              </p>
            )}

            <div className="grid gap-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Specification key (e.g., Material)"
                      value={spec.key}
                      onChange={(e) =>
                        updateSpecification(index, "key", e.target.value)
                      }
                      className={
                        errors.specifications?.[index]?.key
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.specifications?.[index]?.key && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.specifications[index].key?.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Specification value"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpecification(index, "value", e.target.value)
                      }
                      className={
                        errors.specifications?.[index]?.value
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.specifications?.[index]?.value && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.specifications[index].value?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSpecification(index)}
                    className="mt-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
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
                    <Label>Product Image *</Label>
                    <Controller
                      name={`productImages.${index}.file`}
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/jpeg,image/png,image/jpg"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                field.onChange(file); // ✅ updates RHF state
                                handleFileChange(index, file); // ✅ still keeps preview
                              }}
                              className={`file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-muted file:text-muted-foreground ${
                                errors.productImages?.[index]?.file
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {field.value && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  field.onChange(null); // ✅ clear RHF value
                                  handleFileChange(index, null); // ✅ clear preview
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {/* Error message */}
                          {errors.productImages?.[index]?.file && (
                            <p className="text-sm text-red-500">
                              {errors.productImages[index].file?.message}
                            </p>
                          )}

                          {/* Info */}
                          <p className="text-xs text-gray-500">
                            Accepted formats: JPG, JPEG, PNG (Max size: 10MB)
                          </p>

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
                      )}
                    />
                  </div>
                  <Controller
                    name={`productImages.${index}.color`}
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label>Color *</Label>
                        <Input
                          {...field}
                          value={field.value ?? ""} // ✅ controlled by RHF
                          onChange={(e) => {
                            field.onChange(e.target.value); // ✅ updates RHF
                            updateProductImage(index, "color", e.target.value); // ✅ keeps your preview/local state
                          }}
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
                    )}
                  />{" "}
                  <div className="space-y-2">
                    <Label>Stock *</Label>
                    <Controller
                      name={`productImages.${index}.stock`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? 0} // RHF controlled value
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value) || 0;
                            field.onChange(value); // ✅ RHF aware of changes
                            updateProductImage(index, "stock", value); // ✅ keep your local state in sync
                          }}
                          className={
                            errors.productImages?.[index]?.stock
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
