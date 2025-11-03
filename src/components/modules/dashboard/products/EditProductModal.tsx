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
