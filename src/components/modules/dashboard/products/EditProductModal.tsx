// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Plus, Trash2, X } from "lucide-react";
// import Image from "next/image";
// import { TGender, TProduct } from "@/types/product";
// import { toast } from "sonner";
// import { TCategory } from "@/types/category";

// const specificationSchema = z.object({
//   key: z.string().min(1, "Specification key is required"),
//   value: z.string().min(1, "Specification value is required"),
// });

// const productImageSchema = z.object({
//   file: z
//     .custom<File>((val) => val instanceof File && val.size > 0, {
//       message: "Product image is required",
//     })
//     .refine((file) => file.size <= 10 * 1024 * 1024, {
//       message: "Max file size is 10MB",
//     })
//     .refine(
//       (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
//       {
//         message: "Only JPG, JPEG or PNG files are allowed",
//       }
//     )
//     .optional(),
//   color: z.string().min(1, "Color is required"),
//   stock: z.number().min(0, "Stock must be 0 or greater"),
//   isPrimary: z.boolean(),
//   isActive: z.boolean(),
// });

// const productFormSchema = z.object({
//   name: z
//     .string()
//     .min(1, "Product name is required")
//     .max(100, "Name must be less than 100 characters"),
//   description: z.string().optional(),
//   originalPrice: z.number().min(0, "Price cannot be negative").optional(),
//   price: z.number().min(0, "Price cannot be negative"),
//   category: z.string().min(1, "Category is required"),
//   isNew: z.boolean(),
//   gender: z.enum(["MALE", "FEMALE", "UNISEX"]).optional(),
//   productImages: z
//     .array(productImageSchema)
//     .min(1, "At least one product image is required")
//     .refine((images) => images.some((img) => img.isPrimary), {
//       message: "At least one image must be marked as primary",
//     })
//     .refine((images) => images.filter((img) => img.isPrimary).length === 1, {
//       message: "Only one image can be marked as primary",
//     }),
//   specifications: z.array(specificationSchema).optional(),
// });

// type ProductFormData = z.infer<typeof productFormSchema>;

// interface EditProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onEdit: (product: TProduct) => void;
//   product: TProduct;
//   categories: TCategory[];
// }

// interface ProductImageForm {
//   id?: string;
//   imageUrl: string;
//   file?: File;
//   color: string;
//   stock: number;
//   isActive: boolean;
//   previewUrl?: string;
//   hasNewFile?: boolean;
// }

// interface ProductSpecificationForm {
//   key: string;
//   value: string;
// }

// const DEFAULT_SPECIFICATION_KEYS = [
//   "Material",
//   "Color",
//   "Dimension",
//   "Inner Pocket",
//   "Handle",
//   "Strap Material Type",
//   "Lock Type",
//   "Zipper",
//   "Compartments",
//   "Straps",
//   "Origin",
// ];
// const EditProductModal = ({
//   isOpen,
//   onClose,
//   onEdit,
//   product,
//   categories,
// }: EditProductModalProps) => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//   } = useForm<ProductFormData>({
//     resolver: zodResolver(productFormSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       originalPrice: undefined,
//       price: 0,
//       category: "",
//       isNew: false,
//       gender: undefined,
//       productImages: [],
//     },
//   });

//   const [productImages, setProductImages] = useState<ProductImageForm[]>([]);
//   const [specifications, setSpecifications] = useState<
//     ProductSpecificationForm[]
//   >([]);

//   useEffect(() => {
//     if (product) {
//       // Set form values
//       reset({
//         name: product.name,
//         description: product.description || "",
//         originalPrice: product.originalPrice || undefined,
//         price: product.price,
//         category: product.category,
//         isNew: product.isNew,
//         gender: product.gender as TGender | undefined,
//         productImages: product.productImages.map((img) => ({
//           file: undefined,
//           color: img.color,
//           stock: img.stock,
//           isActive: img.isActive,
//         })),
//       });

//       // Set product images state
//       const mappedImages = product.productImages.map((img) => ({
//         id: img.id,
//         imageUrl: img.imageUrl,
//         file: undefined,
//         color: img.color,
//         stock: img.stock,
//         isActive: img.isActive,
//         hasNewFile: false,
//       }));

//       setProductImages(mappedImages);

//       if (product.specifications && product.specifications.length > 0) {
//         setSpecifications(
//           product.specifications.map((spec) => ({
//             key: spec.key,
//             value: spec.value,
//           }))
//         );
//       } else {
//         setSpecifications(
//           DEFAULT_SPECIFICATION_KEYS.map((key) => ({ key, value: "" }))
//         );
//       }
//     }
//   }, [product, reset]);

//   const onSubmit = async (data: ProductFormData) => {
//     try {
//       // Create FormData for file uploads
//       const formDataToSend = new FormData();

//       // Append basic product data
//       const productData = {
//         ...data,
//         id: product.id,
//       };
//       formDataToSend.append("data", JSON.stringify(productData));

//       // Append product images metadata
//       const imagesMetadata = productImages.map((img) => {
//         const { file, previewUrl, hasNewFile, ...rest } = img;
//         return rest;
//       });
//       formDataToSend.append("productImages", JSON.stringify(imagesMetadata));

//       // Append new image files
//       productImages.forEach((image, index) => {
//         if (image.file && image.hasNewFile) {
//           formDataToSend.append(`images`, image.file);
//           formDataToSend.append(`imageIndex`, index.toString());
//         }
//       });

//       // For now, we'll simulate the API call
//       const updatedProduct: TProduct = {
//         ...product,
//         name: data.name,
//         description: data.description || undefined,
//         originalPrice: data.originalPrice,
//         price: data.price,
//         category: data.category,
//         isNew: data.isNew,
//         gender: data.gender || undefined,
//         productImages: productImages.map((img, index) => ({
//           id: img.id || `new-${index}`,
//           productId: product.id,
//           imageUrl:
//             img.hasNewFile && img.previewUrl ? img.previewUrl : img.imageUrl,
//           color: img.color,
//           stock: img.stock,
//           isActive: img.isActive,
//           createdAt:
//             product.productImages.find((p) => p.id === img.id)?.createdAt ||
//             new Date(),
//           updatedAt: new Date(),
//         })),
//         updatedAt: new Date(),
//       };

//       onEdit(updatedProduct);
//       toast.success("Product updated successfully");
//       onClose();
//     } catch (error) {
//       toast.error("Failed to update product!");
//     }
//   };

//   const addSpecification = () => {
//     setSpecifications([...specifications, { key: "", value: "" }]);
//   };

//   const removeSpecification = (index: number) => {
//     setSpecifications(specifications.filter((_, i) => i !== index));
//   };

//   const updateSpecification = (
//     index: number,
//     field: keyof ProductSpecificationForm,
//     value: string
//   ) => {
//     const newSpecs = [...specifications];
//     newSpecs[index] = { ...newSpecs[index], [field]: value };
//     setSpecifications(newSpecs);
//   };

//   const addProductImage = () => {
//     const newImage: ProductImageForm = {
//       imageUrl: "",
//       file: undefined,
//       color: "",
//       stock: 0,
//       isActive: true,
//       hasNewFile: false,
//     };

//     setProductImages([...productImages, newImage]);
//     setValue("productImages", [...productImages, newImage]);
//   };

//   const removeProductImage = (index: number) => {
//     if (productImages.length > 1) {
//       const imageToRemove = productImages[index];

//       // Clean up preview URL if exists
//       if (imageToRemove.previewUrl) {
//         URL.revokeObjectURL(imageToRemove.previewUrl);
//       }

//       const newImages = productImages.filter((_, i) => i !== index);
//       // Ensure at least one image is primary
//       if (productImages[index].isPrimary && newImages.length > 0) {
//         newImages[0].isPrimary = true;
//       }
//       setProductImages(newImages);
//       setValue("productImages", newImages);
//     }
//   };

//   const handleFileChange = (index: number, file: File | null) => {
//     const newImages = [...productImages];
//     newImages[index].file = file || undefined;
//     newImages[index].hasNewFile = !!file;

//     if (file) {
//       // Clean up previous preview URL
//       if (newImages[index].previewUrl) {
//         URL.revokeObjectURL(newImages[index].previewUrl);
//       }

//       const previewUrl = URL.createObjectURL(file);
//       newImages[index].previewUrl = previewUrl;
//     } else {
//       // Clean up preview URL when file is removed
//       if (newImages[index].previewUrl) {
//         URL.revokeObjectURL(newImages[index].previewUrl);
//       }
//       newImages[index].previewUrl = undefined;
//     }

//     setProductImages(newImages);
//     setValue("productImages", newImages);
//   };

//   const updateProductImage = (
//     index: number,
//     field: keyof ProductImageForm,
//     value: any
//   ) => {
//     const newImages = [...productImages];

//     if (field === "isPrimary" && value) {
//       // Only one image can be primary
//       newImages.forEach((img, i) => {
//         img.isPrimary = i === index;
//       });
//     } else {
//       newImages[index] = { ...newImages[index], [field]: value };
//     }

//     setProductImages(newImages);
//     setValue("productImages", newImages);
//   };

//   const getCurrentImageUrl = (image: ProductImageForm): string => {
//     if (image.hasNewFile && image.previewUrl) {
//       return image.previewUrl;
//     }
//     return image.imageUrl || "/placeholder.svg";
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Edit Product</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Basic Product Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Product Name *</Label>
//               <Controller
//                 name="name"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     id="name"
//                     {...field}
//                     className={errors.name ? "border-red-500" : ""}
//                   />
//                 )}
//               />
//               {errors.name && (
//                 <p className="text-sm text-red-500">{errors.name.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="category">Category *</Label>
//               <Controller
//                 name="category"
//                 control={control}
//                 render={({ field }) => (
//                   <Select value={field.value} onValueChange={field.onChange}>
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((category) => (
//                         <SelectItem key={category.id} value={category.name}>
//                           {category.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//               {errors.category && (
//                 <p className="text-sm text-red-500">
//                   {errors.category.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Controller
//               name="description"
//               control={control}
//               render={({ field }) => (
//                 <Textarea id="description" {...field} rows={3} />
//               )}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="price">Price *</Label>
//               <Controller
//                 name="price"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     id="price"
//                     type="number"
//                     step="0.01"
//                     {...field}
//                     className={errors.price ? "border-red-500" : ""}
//                   />
//                 )}
//               />
//               {errors.price && (
//                 <p className="text-sm text-red-500">{errors.price.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="originalPrice">Original Price</Label>
//               <Controller
//                 name="originalPrice"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     id="originalPrice"
//                     type="number"
//                     step="0.01"
//                     {...field}
//                   />
//                 )}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="gender">Gender</Label>
//               <Controller
//                 name="gender"
//                 control={control}
//                 render={({ field }) => (
//                   <Select value={field.value} onValueChange={field.onChange}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select gender" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="MALE">Male</SelectItem>
//                       <SelectItem value="FEMALE">Female</SelectItem>
//                       <SelectItem value="UNISEX">Unisex</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Controller
//               name="isNew"
//               control={control}
//               render={({ field }) => (
//                 <Checkbox
//                   id="isNew"
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//               )}
//             />
//             <Label htmlFor="isNew">Mark as New Product</Label>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label className="text-base font-semibold">
//                 Product Specifications
//               </Label>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addSpecification}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Specification
//               </Button>
//             </div>

//             {errors.specifications && (
//               <p className="text-sm text-red-500">
//                 {errors.specifications.message}
//               </p>
//             )}

//             <div className="grid gap-3">
//               {specifications.map((spec, index) => (
//                 <div key={index} className="flex gap-3 items-start">
//                   <div className="flex-1">
//                     <Input
//                       placeholder="Specification key (e.g., Material)"
//                       value={spec.key}
//                       onChange={(e) =>
//                         updateSpecification(index, "key", e.target.value)
//                       }
//                       className={
//                         errors.specifications?.[index]?.key
//                           ? "border-red-500"
//                           : ""
//                       }
//                     />
//                     {errors.specifications?.[index]?.key && (
//                       <p className="text-sm text-red-500 mt-1">
//                         {errors.specifications[index].key?.message}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <Input
//                       placeholder="Specification value"
//                       value={spec.value}
//                       onChange={(e) =>
//                         updateSpecification(index, "value", e.target.value)
//                       }
//                       className={
//                         errors.specifications?.[index]?.value
//                           ? "border-red-500"
//                           : ""
//                       }
//                     />
//                     {errors.specifications?.[index]?.value && (
//                       <p className="text-sm text-red-500 mt-1">
//                         {errors.specifications[index].value?.message}
//                       </p>
//                     )}
//                   </div>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => removeSpecification(index)}
//                     className="mt-0"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Product Images */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <Label className="text-base font-semibold">
//                 Product Images & Colors
//               </Label>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addProductImage}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Color Variant
//               </Button>
//             </div>

//             {errors.productImages && (
//               <p className="text-sm text-red-500">
//                 {errors.productImages.message}
//               </p>
//             )}

//             {productImages.map((image, index) => (
//               <div key={index} className="border rounded-lg p-4 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium">Color Variant {index + 1}</span>
//                   {productImages.length > 1 && (
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeProductImage(index)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                   <div className="space-y-2">
//                     <Label>Product Image</Label>

//                     {/* Current Image Display */}
//                     <div className="space-y-3">
//                       <div className="relative w-32 h-32 border rounded overflow-hidden bg-gray-50">
//                         <Image
//                           src={getCurrentImageUrl(image)}
//                           alt={`${image.color} variant`}
//                           width={128}
//                           height={128}
//                           className="w-full h-full object-cover"
//                         />
//                         {image.hasNewFile && (
//                           <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
//                             New
//                           </div>
//                         )}
//                       </div>

//                       {/* File Upload Input */}
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2">
//                           <Input
//                             type="file"
//                             accept="image/jpeg,image/png,image/jpg"
//                             onChange={(e) =>
//                               handleFileChange(
//                                 index,
//                                 e.target.files?.[0] || null
//                               )
//                             }
//                             className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-muted file:text-muted-foreground"
//                           />
//                           {image.hasNewFile && (
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleFileChange(index, null)}
//                               title="Remove new image"
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-500">
//                           Accepted formats: JPG, JPEG, PNG (Max size: 10MB)
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Color *</Label>
//                     <Input
//                       value={image.color}
//                       onChange={(e) =>
//                         updateProductImage(index, "color", e.target.value)
//                       }
//                       className={
//                         errors.productImages?.[index]?.color
//                           ? "border-red-500"
//                           : ""
//                       }
//                     />
//                     {errors.productImages?.[index]?.color && (
//                       <p className="text-sm text-red-500">
//                         {errors.productImages[index].color?.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Stock</Label>
//                     <Input
//                       type="number"
//                       value={image.stock}
//                       onChange={(e) =>
//                         updateProductImage(
//                           index,
//                           "stock",
//                           Number.parseInt(e.target.value) || 0
//                         )
//                       }
//                       className={
//                         errors.productImages?.[index]?.stock
//                           ? "border-red-500"
//                           : ""
//                       }
//                     />
//                     {errors.productImages?.[index]?.stock && (
//                       <p className="text-sm text-red-500">
//                         {errors.productImages[index].stock?.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       checked={image.isPrimary}
//                       onCheckedChange={(checked) =>
//                         updateProductImage(index, "isPrimary", !!checked)
//                       }
//                     />
//                     <Label>Primary Image</Label>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       checked={image.isActive}
//                       onCheckedChange={(checked) =>
//                         updateProductImage(index, "isActive", !!checked)
//                       }
//                     />
//                     <Label>Active</Label>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end gap-3">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit">Update Product</Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditProductModal;

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
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
import { TGender, TProduct, UpdateProductPayload } from "@/types/product";
import { useUpdateProductMutation } from "@/redux/features/product/product";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUploads";
import { toast } from "sonner";

const specificationSchema = z.object({
  key: z.string().min(1, "Specification key is required"),
  value: z.string().min(1, "Specification value is required"),
});

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100),
  description: z.string().optional(),
  originalPrice: z.number().nonnegative().optional(),
  price: z.number().nonnegative("Price cannot be negative"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  code: z.string().min(1, "Product code is required"),
  brand: z.string().optional(),
  isNew: z.boolean(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: TProduct;
  categories: TCategory[];
  //   refetchProducts: () => void;
}

interface VariantImageForm {
  id?: string; // present for existing DB rows, absent for newly-added ones
  imageUrl: string; // current display URL (existing or blob preview)
  color: string;
  stock: number;
  isActive: boolean;
  file: File | null;
  hasNewFile: boolean;
}

interface BulkImageForm {
  id?: string;
  imageUrl: string;
  file: File | null;
  isNew: boolean;
}

interface SpecificationForm {
  id?: string;
  key: string;
  value: string;
}

export function EditProductModal({
  isOpen,
  onClose,
  product,
  categories,
  //   refetchProducts,
}: EditProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(
    null,
  );

  const availableCategories = categories || [];
  const subCategories = availableCategories.filter(
    (cat: any) => cat.parent?.id === selectedCategory?.id,
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
      originalPrice: undefined,
      price: 0,
      category: "",
      subCategory: "",
      code: "",
      brand: "",
      isNew: false,
      gender: undefined,
    },
  });

  // Cover image
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  // Variant images
  const [variantImages, setVariantImages] = useState<VariantImageForm[]>([]);
  const [removedProductImageIds, setRemovedProductImageIds] = useState<
    string[]
  >([]);

  // Bulk images
  const [bulkImages, setBulkImages] = useState<BulkImageForm[]>([]);
  const [removedBulkImageIds, setRemovedBulkImageIds] = useState<string[]>([]);

  // Specifications
  const [specifications, setSpecifications] = useState<SpecificationForm[]>([]);

  const [updateProduct] = useUpdateProductMutation();
  const {
    progress,
    uploadFiles,
    rollbackUploads,
    reset: resetUpload,
  } = useCloudinaryUpload();

  useEffect(() => {
    if (!product) return;

    const category =
      availableCategories.find((c) => c.name === product.category) || null;
    setSelectedCategory(category);

    reset({
      name: product.name,
      description: product.description || "",
      originalPrice: product.originalPrice ?? undefined,
      price: product.price,
      category: product.category,
      subCategory: product.subCategory || "",
      code: product.code,
      brand: product.brand || "",
      isNew: product.isNew,
      gender: (product.gender as TGender) || undefined,
    });

    setCoverFile(null);
    setCoverPreviewUrl(product.coverImage?.imageUrl ?? null);

    setVariantImages(
      product.productImages.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        color: img.color,
        stock: img.stock,
        isActive: img.isActive,
        file: null,
        hasNewFile: false,
      })),
    );
    setRemovedProductImageIds([]);

    setBulkImages(
      product.bulkImages.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        file: null,
        isNew: false,
      })),
    );
    setRemovedBulkImageIds([]);

    setSpecifications(
      product.specifications.length > 0
        ? product.specifications.map((s) => ({
            id: s.id,
            key: s.key,
            value: s.value,
          }))
        : [{ key: "", value: "" }],
    );

    resetUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // --- Cover image handlers ---

  const handleCoverChange = (file: File | null) => {
    if (coverPreviewUrl && coverFile) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setCoverFile(file);
    setCoverPreviewUrl(
      file ? URL.createObjectURL(file) : (product.coverImage?.imageUrl ?? null),
    );
  };

  // --- Variant image handlers ---

  const addVariantImage = () => {
    setVariantImages((prev) => [
      ...prev,
      {
        imageUrl: "",
        color: "",
        stock: 0,
        isActive: true,
        file: null,
        hasNewFile: true,
      },
    ]);
  };

  const handleVariantFileChange = (index: number, file: File | null) => {
    setVariantImages((prev) => {
      const next = [...prev];
      const current = next[index];
      if (current.file && current.imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(current.imageUrl);
      }
      next[index] = {
        ...current,
        file,
        hasNewFile: !!file,
        imageUrl: file ? URL.createObjectURL(file) : current.imageUrl,
      };
      return next;
    });
  };

  const updateVariantField = (
    index: number,
    field: "color" | "stock" | "isActive",
    value: any,
  ) => {
    setVariantImages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeVariantImage = (index: number) => {
    setVariantImages((prev) => {
      if (prev.length <= 1) {
        toast.error("A product needs at least one color variant");
        return prev;
      }
      const target = prev[index];
      if (target.id) {
        setRemovedProductImageIds((ids) => [...ids, target.id as string]);
      }
      if (target.file && target.imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(target.imageUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // --- Bulk image handlers ---

  const handleBulkFilesAdded = (files: FileList | null) => {
    if (!files) return;
    const newEntries: BulkImageForm[] = Array.from(files).map((file) => ({
      imageUrl: URL.createObjectURL(file),
      file,
      isNew: true,
    }));
    setBulkImages((prev) => [...prev, ...newEntries]);
  };

  const removeBulkImage = (index: number) => {
    setBulkImages((prev) => {
      const target = prev[index];
      if (target.id) {
        setRemovedBulkImageIds((ids) => [...ids, target.id as string]);
      }
      if (target.isNew) {
        URL.revokeObjectURL(target.imageUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // --- Specification handlers ---

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    setSpecifications((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // --- Submit ---

  const onSubmit = async (data: ProductFormData) => {
    const validSpecs = specifications.filter(
      (s) => s.key.trim() && s.value.trim(),
    );

    for (const v of variantImages) {
      if (!v.color.trim()) {
        toast.error("Every color variant needs a color name");
        return;
      }
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Uploading changed images...");

    const filesToUpload: File[] = [];
    if (coverFile) filesToUpload.push(coverFile);

    // Separate variants into changed and unchanged
    const variantsWithNewFile = variantImages
      .map((img, index) => ({ img, index }))
      .filter(({ img }) => img.hasNewFile && img.file);

    const variantsWithoutNewFile = variantImages
      .map((img, index) => ({ img, index }))
      .filter(({ img }) => img.id && !img.hasNewFile);

    // Only upload changed variant images
    variantsWithNewFile.forEach(({ img }) =>
      filesToUpload.push(img.file as File),
    );

    const newBulkImages = bulkImages.filter((img) => img.isNew && img.file);
    newBulkImages.forEach((img) => filesToUpload.push(img.file as File));

    try {
      let uploadResults: { publicId: string; secureUrl: string }[] = [];

      if (filesToUpload.length > 0) {
        uploadResults = await uploadFiles(filesToUpload);
      }

      let cursor = 0;

      const newCoverImage = coverFile
        ? {
            publicId: uploadResults[cursor].publicId,
            imageUrl: uploadResults[cursor++].secureUrl,
          }
        : undefined;

      // Variants whose files were uploaded
      const uploadedVariantPayload = variantsWithNewFile.map(({ img }) => {
        const result = uploadResults[cursor++];
        return {
          id: img.id,
          publicId: result.publicId,
          imageUrl: result.secureUrl,
          color: img.color,
          stock: img.stock,
          isActive: img.isActive,
        };
      });

      // Variants whose files didn't change
      const unchangedFileVariantPayload = variantsWithoutNewFile.map(
        ({ img }) => ({
          id: img.id,
          publicId: product.productImages.find((p) => p.id === img.id)!
            .publicId,
          imageUrl: img.imageUrl,
          color: img.color,
          stock: img.stock,
          isActive: img.isActive,
        }),
      );

      const newVariantPayload = [
        ...uploadedVariantPayload,
        ...unchangedFileVariantPayload,
      ];

      const newBulkPayload = newBulkImages.map(() => {
        const result = uploadResults[cursor++];
        return {
          publicId: result.publicId,
          imageUrl: result.secureUrl,
        };
      });

      toast.loading("Saving changes...", { id: toastId });

      const payload: UpdateProductPayload = {
        name: data.name,
        description: data.description,
        originalPrice: data.originalPrice,
        price: data.price,
        category: data.category,
        subCategory: data.subCategory,
        code: data.code,
        brand: data.brand,
        isNew: data.isNew,
        gender: data.gender,
        ...(newCoverImage && { coverImage: newCoverImage }),
        productImages: newVariantPayload,
        bulkImages: newBulkPayload,
        removedProductImageIds,
        removedBulkImageIds,
        specifications: validSpecs,
      };

      try {
        await updateProduct({ id: product.id, payload }).unwrap();

        toast.success("Product updated successfully", {
          id: toastId,
          duration: 2000,
        });

        onClose();
        // refetchProducts();
      } catch (updateError: any) {
        // console.log("Update product error:", updateError);

        if (uploadResults.length > 0) {
          await rollbackUploads();
        }

        toast.error(updateError?.data?.message || "Failed to update product!", {
          id: toastId,
          duration: 2000,
        });
      }
    } catch (uploadError: any) {
      // console.log("Upload error:", uploadError);

      toast.error(uploadError?.message || "Image upload failed", {
        id: toastId,
        duration: 2000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || progress.isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General info */}
          <Card>
            <CardHeader>
              <CardTitle>General Info *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
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
                            availableCategories.find((c) => c.name === value) ||
                            null;
                          setSelectedCategory(selected);
                          setValue("subCategory", "");
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.map((category) => (
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

                <div className="space-y-1">
                  <Label htmlFor="subCategory">Sub-Category</Label>
                  <Controller
                    name="subCategory"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                  <Label htmlFor="brand">Brand</Label>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => <Input id="brand" {...field} />}
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
            </CardContent>
          </Card>

          {/* Cover image */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-2 border-dashed rounded-lg p-6 h-64 w-full flex items-center justify-center">
                {coverPreviewUrl ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image
                      src={coverPreviewUrl}
                      alt="cover"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {coverFile && (
                        <button
                          type="button"
                          onClick={() => handleCoverChange(null)}
                          className="bg-white shadow-md rounded-full p-2 hover:bg-red-500 text-gray-600 hover:text-white transition"
                          title="Discard new cover, keep existing"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                      <label className="bg-white shadow-md rounded-full p-2 hover:bg-blue-500 text-gray-600 hover:text-white transition cursor-pointer">
                        <Plus className="w-5 h-5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleCoverChange(e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    </div>
                    {coverFile && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        New — will replace current cover
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer text-gray-400">
                    <span className="text-4xl mb-2">＋</span>
                    <p className="text-sm">Upload Cover Photo</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleCoverChange(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Variant images */}
          <Card>
            <CardHeader>
              <CardTitle>Color Variants *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Product Images & Colors
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariantImage}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Color Variant
                </Button>
              </div>

              {variantImages.map((image, index) => (
                <div
                  key={image.id ?? `new-${index}`}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Color Variant {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariantImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Product Image</Label>
                      <div className="space-y-2">
                        {image.imageUrl && (
                          <div className="relative w-24 h-24 border rounded overflow-hidden bg-gray-50">
                            <Image
                              src={image.imageUrl}
                              alt={image.color || "variant"}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                            {image.hasNewFile && (
                              <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1 rounded">
                                New
                              </div>
                            )}
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={(e) =>
                            handleVariantFileChange(
                              index,
                              e.target.files?.[0] || null,
                            )
                          }
                          className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-muted file:text-muted-foreground"
                        />
                        <p className="text-xs text-gray-500">
                          Leave empty to keep the current image
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Color *</Label>
                      <Input
                        value={image.color}
                        onChange={(e) =>
                          updateVariantField(index, "color", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Stock *</Label>
                      <Input
                        type="number"
                        value={image.stock}
                        onChange={(e) =>
                          updateVariantField(
                            index,
                            "stock",
                            Number.parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={image.isActive}
                      onCheckedChange={(checked) =>
                        updateVariantField(index, "isActive", !!checked)
                      }
                    />
                    <Label>Active</Label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bulk images */}
          <Card>
            <CardHeader>
              <CardTitle>More Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {bulkImages.map((image, index) => (
                  <div
                    key={image.id ?? `new-bulk-${index}`}
                    className="relative flex-shrink-0 w-32 h-32 border rounded-lg overflow-hidden bg-white"
                  >
                    <Image
                      src={image.imageUrl}
                      alt="bulk"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                    {image.isNew && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1 rounded">
                        New
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeBulkImage(index)}
                      className="absolute bottom-1 right-1 bg-white shadow-md rounded-full p-1 hover:bg-red-500 text-gray-400 hover:text-white transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <label className="flex-shrink-0 w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <span className="text-3xl text-gray-400">＋</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleBulkFilesAdded(e.target.files)}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea {...field} rows={3} />}
              />
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="grid gap-3">
                {specifications.map((spec, index) => (
                  <div
                    key={spec.id ?? `new-spec-${index}`}
                    className="flex gap-3 items-start"
                  >
                    <Input
                      placeholder="Specification key"
                      value={spec.key}
                      onChange={(e) =>
                        updateSpecification(index, "key", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Specification value"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpecification(index, "value", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {progress.isUploading && (
            <div className="text-sm text-muted-foreground">
              Uploading images... {progress.uploadedCount} /{" "}
              {progress.totalCount}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isBusy}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isBusy}>
              {progress.isUploading
                ? `Uploading ${progress.uploadedCount}/${progress.totalCount}...`
                : isSubmitting
                  ? "Saving..."
                  : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
