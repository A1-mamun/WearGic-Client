/* eslint-disable no-unused-vars */
"use client";

import type React from "react";

import { useState } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import { TGender, TProduct } from "@/types/product";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<TProduct, "id" | "createdAt" | "updatedAt">) => void;
}

interface ProductImageForm {
  imageUrl: string;
  color: string;
  stock: number;
  isPrimary: boolean;
  isActive: boolean;
}

const AddProductModal = ({ isOpen, onClose, onAdd }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    originalPrice: "",
    price: "",
    category: "",
    isNew: false,
    gender: "" as Gender | "",
    isDeleted: false,
  });

  const [productImages, setProductImages] = useState<ProductImageForm[]>([
    {
      imageUrl: "",
      color: "",
      stock: 0,
      isPrimary: true,
      isActive: true,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const product: Omit<TProduct, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      description: formData.description || undefined,
      originalPrice: formData.originalPrice
        ? Number.parseFloat(formData.originalPrice)
        : undefined,
      price: Number.parseFloat(formData.price) || 0,
      category: formData.category,
      isNew: formData.isNew,
      gender: formData.gender || undefined,
      isDeleted: false,
      productImages: productImages.map((img, index) => ({
        id: `temp-${index}`,
        productId: "temp",
        imageUrl:
          img.imageUrl ||
          `/placeholder.svg?height=200&width=200&query=${img.color} product`,
        color: img.color,
        stock: img.stock,
        isPrimary: img.isPrimary,
        isActive: img.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };

    onAdd(product);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      originalPrice: "",
      price: "",
      category: "",
      isNew: false,
      gender: "",
      isDeleted: false,
    });
    setProductImages([
      {
        imageUrl: "",
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
        imageUrl: "",
        color: "",
        stock: 0,
        isPrimary: false,
        isActive: true,
      },
    ]);
  };

  const removeProductImage = (index: number) => {
    if (productImages.length > 1) {
      const newImages = productImages.filter((_, i) => i !== index);
      // Ensure at least one image is primary
      if (productImages[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      setProductImages(newImages);
    }
  };

  const updateProductImage = (
    index: number,
    field: keyof ProductImageForm,
    value: any
  ) => {
    const newImages = [...productImages];

    if (field === "isPrimary" && value) {
      // Only one image can be primary
      newImages.forEach((img, i) => {
        img.isPrimary = i === index;
      });
    } else {
      newImages[index] = { ...newImages[index], [field]: value };
    }

    setProductImages(newImages);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value as TGender })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="UNISEX">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isNew"
              checked={formData.isNew}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isNew: !!checked })
              }
            />
            <Label htmlFor="isNew">Mark as New Product</Label>
          </div>

          {/* Product Images */}
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
                    <Label>Image URL</Label>
                    <Input
                      value={image.imageUrl}
                      onChange={(e) =>
                        updateProductImage(index, "imageUrl", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Color *</Label>
                    <Input
                      value={image.color}
                      onChange={(e) =>
                        updateProductImage(index, "color", e.target.value)
                      }
                      required
                    />
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
                    />
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
};

export default AddProductModal;
