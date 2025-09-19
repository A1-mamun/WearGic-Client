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
} from "@/redux/features/cart/cartSlice";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

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
    dispatch(removeFromCart(productId));
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
    <Card className="group max-w-sm rounded-sm md:rounded-xl shadow-xl transition-all duration-300 overflow-hidden pt-0 pb-2 md:pb-3">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-sm md:rounded-t-xl w-full h-32 md:h-60">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={primaryImage.imageUrl}
          alt={product.name}
          priority
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 md:top-3 md:left-3 bg-rose-600 text-white font-semibold text-[10px] md:text-xs rounded h-4 md:h-5">
            {discountPercentage}% OFF
          </Badge>
        )}
        {product.isNew && (
          <Badge
            className={`absolute ${
              discountPercentage > 0 ? "top-7 md:top-10" : "top-2 md:top-3"
            } left-2 md:left-3 bg-primary text-white font-semibold text-[10px] md:text-xs rounded h-4 md:h-5`}
          >
            New
          </Badge>
        )}
      </div>

      <CardHeader className="px-2 md:px-3 lg:px-4 -mt-3">
        <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide font-medium">
          {product.category}
        </p>
        <h3 className="text-sm md:text-base font-semibold text-foreground transition-colors line-clamp-2">
          {product.name}
        </h3>
      </CardHeader>

      <CardContent className="px-2 md:px-3 lg:px-4 -my-4 md:-my-3">
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-lg font-bold text-foreground">
            ৳{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs md:text-sm text-muted-foreground font-bold line-through">
              ৳{product.originalPrice}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter
        className="px-2 md:px-3 lg:px-4 flex flex-col gap-1 md:gap-3
      "
      >
        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-1 md:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full md:w-1/2 md:flex-1 h-[30px] md:h-8 border-2 border-border hover:bg-accent hover:text-accent-foreground"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            See Details
          </Button>
          {isCarted ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-full md:w-1/2 md:flex-1 h-[30px] md:h-8 border-2 border-red-400 hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleRemoveFromCart(product.id)}
            >
              Remove from Cart
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full md:w-1/2 md:flex-1 h-[30px] md:h-8 border-2 border-border hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </Button>
          )}
        </div>
        <Button
          variant="default"
          size="sm"
          className="w-full h-[30px] md:h-8 text-black bg-orange-500"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
