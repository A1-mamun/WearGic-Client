/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DragEvent, useRef, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, TrashIcon, X } from "lucide-react";
import Image from "next/image";
import { TCategory } from "@/types/category";
import { useAddProductMutation } from "@/redux/features/product/product";
import { toast } from "sonner";

const specificationSchema = z.object({
  key: z.string().min(1, "Specification key is required"),
  value: z.string().min(1, "Specification value is required"),
});

const coverImageSchema = z.object({
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
});

const productImageSchema = z.object({
  file: z
    .custom<File | null>((val) => val instanceof File && val.size > 0, {
      message: "Product image is required",
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Max file size is 5MB",
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

const bulkImageSchema = z
  .object({
    file: z
      .custom<File | null>((val) => val instanceof File && val.size > 0, {
        message: "Product image is required",
      })
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: "Max file size is 5MB",
      })
      .refine(
        (file) =>
          !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
        {
          message: "Only JPG, JPEG or PNG files are allowed",
        }
      ),
  })
  .optional();

const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Name must be less than 100 characters"),

  originalPrice: z
    .number()
    .nonnegative("Original price cannot be negative")
    .optional(),
  price: z.number().nonnegative("Price cannot be negative"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  code: z.string().min(1, "Product code is required"),
  brand: z.string().optional(),
  isNew: z.boolean(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  coverImage: coverImageSchema,
  productImages: z
    .array(productImageSchema)
    .min(1, "At least one product image is required")
    .refine((images) => images.some((img) => img.isPrimary), {
      message: "At least one image must be marked as primary",
    })
    .refine((images) => images.filter((img) => img.isPrimary).length === 1, {
      message: "Only one image can be marked as primary",
    }),
  bulkImages: z.array(bulkImageSchema).optional(),
  description: z.string().optional(),
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
  const [bulkImages, setBulkImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(
    null
  );

  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const availableCategories = categories || [];
  const subCategories = availableCategories.filter(
    (cat: any) => cat.parent?.id === selectedCategory?.id
  );

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
      code: "",
      brand: "",
      category: "",
      subCategory: "",
      isNew: false,
      gender: undefined,
      coverImage: { file: null },
      productImages: [
        {
          file: undefined,
          color: "",
          stock: 0,
          isPrimary: true,
          isActive: true,
        },
      ],
      bulkImages: [{ file: undefined }],
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

  // const [bulkImages, setBulkImages] = useState<BulkImageForm[]>([
  //   {
  //     file: null,
  //   },
  // ]);

  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    DEFAULT_SPECIFICATION_KEYS.map((key) => ({ key, value: "" }))
  );

  const [addProduct] = useAddProductMutation();

  // console.log("bulkImages", bulkImages);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Adding product...");
    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(data));

    // Append cover image
    if (data.coverImage.file) {
      formDataToSend.append("coverImage", data.coverImage.file);
    }

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

    // Append bulk images
    if (bulkImages && bulkImages.length > 0) {
      formDataToSend.append("bulkImages", JSON.stringify(bulkImages));
      bulkImages.forEach((image) => {
        if (image) {
          formDataToSend.append("bulkImageFiles", image);
        }
      });
    }

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
    setBulkImages([]);
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

  // Bulk Images Upload
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const filesArray = Array.from(files);
    setBulkImages((prev) => [...prev, ...filesArray]);
  };

  // bulk image removal
  const removeFile = (index: number) => {
    setBulkImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag & Drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add General info *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* name & category */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);

                            const selected =
                              availableCategories.find(
                                (cat) => cat.name === value
                              ) || null;

                            setSelectedCategory(selected);
                            setValue("category", selected?.name ?? "");
                            setValue("subCategory", ""); // reset subCategory
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCategories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.name}
                              >
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

                  <div className="space-y-1">
                    <Label htmlFor="subCategory">Sub-Category</Label>
                    <Controller
                      name="subCategory"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setValue("subCategory", value);
                          }}
                          disabled={!selectedCategory}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select sub-category" />
                          </SelectTrigger>
                          <SelectContent>
                            {subCategories.map((sub: TCategory) => (
                              <SelectItem
                                key={sub.id ?? sub.name}
                                value={sub.name}
                              >
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {/* price, gender */}
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
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          className={errors.price ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">
                        {errors.price.message}
                      </p>
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
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          className={
                            errors.originalPrice ? "border-red-500" : ""
                          }
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
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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

                {/* code and brand */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Product Code *</Label>
                    <Controller
                      name="code"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="code"
                          {...field}
                          className={errors.code ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.code && (
                      <p className="text-sm text-red-500">
                        {errors.code.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Product Brand</Label>
                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="brand"
                          {...field}
                          className={errors.brand ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.brand && (
                      <p className="text-sm text-red-500">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* isNew product */}
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
              </CardContent>
            </Card>
          </div>

          {/* Cover Image */}
          <Controller
            name="coverImage.file"
            control={control}
            render={({ field }) => (
              <Card>
                <CardHeader>
                  <CardTitle>Add Cover Photo *</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Drag & Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 h-64 w-full flex items-center justify-center transition ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        field.onChange(file); // update form state
                      }
                    }}
                  >
                    {field.value ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                          src={URL.createObjectURL(field.value)}
                          alt="cover"
                          fill
                          className="object-cover"
                        />
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => field.onChange(null)}
                          className="absolute top-2 right-2 bg-white shadow-md rounded-full p-2 hover:bg-red-500 text-gray-600 hover:text-white transition"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center cursor-pointer text-gray-400"
                        onClick={() => coverImageInputRef.current?.click()}
                      >
                        <span className="text-4xl mb-2">＋</span>
                        <p className="text-sm">Upload Cover Photo</p>
                        <Input
                          type="file"
                          className="hidden"
                          ref={coverImageInputRef}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) field.onChange(file);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {errors.coverImage?.file && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.coverImage.file.message as string}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          />

          {/* Product Images & Colors */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add Color Variant *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
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
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          Color Variant {index + 1}
                        </span>
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
                                  Accepted formats: JPG, JPEG, PNG (Max size:
                                  10MB)
                                </p>

                                {image.previewUrl && (
                                  <div className="relative w-20 h-20 border rounded overflow-hidden">
                                    <Image
                                      src={
                                        image.previewUrl || "/placeholder.svg"
                                      }
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
                                  updateProductImage(
                                    index,
                                    "color",
                                    e.target.value
                                  ); // ✅ keeps your preview/local state
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
                                  const value =
                                    Number.parseInt(e.target.value) || 0;
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

                      {/* <div className="">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={image.isActive}
                      onCheckedChange={(checked) =>
                        updateProductImage(index, "isActive", !!checked)
                      }
                    />
                    <Label>Active</Label>
                  </div>
                </div> */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* bulk image */}

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add More Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <>
                  {/* Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-4 transition ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-transparent"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {/* Preview Row */}
                    <div
                      id="media-scroll"
                      ref={scrollRef}
                      className="flex flex-wrap gap-4 pb-2"
                    >
                      {bulkImages.map((file, index) => {
                        const url = URL.createObjectURL(file);

                        return (
                          <div
                            key={index}
                            className="relative flex-shrink-0 w-40 h-40 border rounded-lg overflow-hidden bg-white"
                          >
                            <Image
                              src={url}
                              alt={file.name}
                              width={160}
                              height={160}
                              className="w-full h-full object-cover cursor-pointer"
                            />
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                              className="absolute bottom-2 right-2 bg-white shadow-md rounded-full p-1 hover:bg-red-500 text-gray-400 hover:text-white transition"
                            >
                              <TrashIcon className="" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Add New */}
                      <Controller
                        name={`bulkImages.${bulkImages.length}.file`}
                        control={control}
                        render={({ field }) => (
                          <div
                            className="flex-shrink-0 w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
                            onClick={() => inputRef.current?.click()}
                          >
                            <span className="text-3xl text-gray-400">＋</span>
                            <Input
                              type="file"
                              className="hidden"
                              ref={inputRef}
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                field.onChange(file); // ✅ updates RHF state
                                handleFiles(e.target.files); // ✅ still keeps preview
                              }}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  {/* Validation Error */}
                  {errors.bulkImages && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.bulkImages.message}
                    </p>
                  )}
                </>
              </CardContent>
            </Card>
          </div>

          {/* description */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {" "}
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
              </CardContent>
            </Card>
          </div>

          {/* Product Specifications */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
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
                              updateSpecification(
                                index,
                                "value",
                                e.target.value
                              )
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
              </CardContent>
            </Card>
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
