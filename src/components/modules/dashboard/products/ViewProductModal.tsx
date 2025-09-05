"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TProduct } from "@/types/product";

import Image from "next/image";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: TProduct;
}

const ViewProductModal = ({
  isOpen,
  onClose,
  product,
}: ViewProductModalProps) => {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatDate = (date: Date) => date.toLocaleDateString();

  const getTotalStock = () => {
    return product.productImages.reduce(
      (total, image) => total + image.stock,
      0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-muted-foreground">{product.category}</p>
            </div>
            <div className="flex gap-2">
              {product.isNew && <Badge variant="secondary">New</Badge>}
              {product.gender && (
                <Badge variant="outline">{product.gender}</Badge>
              )}
              <Badge variant={getTotalStock() > 0 ? "default" : "destructive"}>
                {getTotalStock() > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-1">Current Price</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(product.price)}
              </p>
            </div>
            {product.originalPrice && (
              <div>
                <h4 className="font-medium mb-1">Original Price</h4>
                <p className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              </div>
            )}
            <div>
              <h4 className="font-medium mb-1">Total Stock</h4>
              <p className="text-2xl font-bold">{getTotalStock()}</p>
            </div>
          </div>

          {/* Product Images & Colors */}
          <div>
            <h4 className="font-medium mb-3">Color Variants</h4>
            <div className="space-y-3">
              {product.productImages.map((image) => (
                <div key={image.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Image
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={`${product.name} - ${image.color}`}
                      className="w-16 h-16 rounded-md object-cover"
                      width={64}
                      height={64}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium">{image.color}</h5>
                        {image.isPrimary && (
                          <Badge variant="secondary">Primary</Badge>
                        )}
                        {!image.isActive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Stock: {image.stock}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="font-medium mb-1">Created</h4>
              <p className="text-muted-foreground">
                {formatDate(product.createdAt)}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Last Updated</h4>
              <p className="text-muted-foreground">
                {formatDate(product.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductModal;
