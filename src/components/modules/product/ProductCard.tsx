"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { TProduct, TProductImage } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addProduct,
  orderProductsSelector,
  removeFromCart,
} from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: { product: TProduct }) => {
  const [isCarted, setIsCarted] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartProducts = useAppSelector(orderProductsSelector);

  const handleAddToCart = (product: TProduct) => {
    dispatch(
      addProduct({
        product,
        selectedId:
          product.productImages.find((img: TProductImage) => img.isPrimary)
            ?.id || product.productImages[0].id,
      })
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    // Dispatch remove action
    dispatch(
      removeFromCart({
        productId,
        selectedId:
          product.productImages.find((img: TProductImage) => img.isPrimary)
            ?.id || product.productImages[0].id,
      })
    );
  };

  useEffect(() => {
    const existsInCart = cartProducts.some(
      (cartItem) => cartItem.id === product.id
    );
    setIsCarted(existsInCart);
  }, [cartProducts, product.id]);

  // Calculate discount percentage
  const discountPercentage = Math.round(
    (((product?.originalPrice ?? 0) - product?.price) /
      (product?.originalPrice ?? 0)) *
      100
  );

  const primaryImage =
    product.productImages.find((img: TProductImage) => img.isPrimary) ||
    product.productImages[0];

  return (
    <div className="group relative bg-card rounded-xl shadow-product hover:shadow-elegant transition-all duration-300 overflow-hidden">
      {/* Image container */}
      <div className="relative overflow-hidden rounded-t-xl w-full h-64">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={primaryImage.imageUrl}
          alt={product.name}
          priority
          className=" object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
          {discountPercentage}% OFF
        </Badge>
        <Badge className="absolute top-12 left-4 bg-primary text-primary-foreground">
          {product.isNew ? "New" : "Featured"}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              {product.category}
            </p>
            <h3 className="font-semibold text-foreground transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        {/* <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div> */}

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 border-2 border-border hover:bg-accent hover:text-accent-foreground"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            See Details
          </Button>
          {isCarted ? (
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 border-2 border-red-400 hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleRemoveFromCart(product.id)}
            >
              Remove from Cart
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 border-2 border-border hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </Button>
          )}
        </div>
        <div className="w-full">
          <Button variant="default" size="sm" className="w-full">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
