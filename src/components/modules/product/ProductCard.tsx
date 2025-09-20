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
import { Minus, Plus } from "lucide-react";
import Link from "next/link";

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
    <Link href={`/products/${product.id}`} className="w-full">
      <Card
        // onClick={() => router.push(`/products/${product.id}`)}
        className="group hover:cursor-pointer max-w-sm shadow-none transition-all duration-300 overflow-hidden pt-0 rounded-t-none rounded-b-md border-0 pb-2 md:pb-3 lg;pb-4"
      >
        {/* Product Image */}
        <div className="relative overflow-hidden w-full h-32 md:h-60">
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
            <Badge className="absolute top-0 left-0 bg-rose-600 text-white font-semibold text-[10px] md:text-xs rounded-none h-4 md:h-5">
              {discountPercentage}% OFF
            </Badge>
          )}
          {product.isNew && (
            <Badge
              className={`absolute ${
                discountPercentage > 0 ? "top-5 md:top-7" : "top-0 md:top-0"
              } left-0 bg-primary text-white font-semibold text-[10px] md:text-xs rounded h-4 md:h-5`}
            >
              New
            </Badge>
          )}
        </div>

        <CardHeader className="px-2 md:px-3 lg:px-4 -mt-3">
          <h3 className="text-sm md:text-base font-semibold text-foreground transition-colors line-clamp-2">
            {product.name}
          </h3>
        </CardHeader>

        <CardContent className="px-2 md:px-3 lg:px-4 -my-6 md:-my-4 flex justify-between items-end">
          <div className="space-y-0">
            {/* <div>
              <p className="text-[11px] md:text-sm text-primary-foreground uppercase tracking-wide font-medium">
                {product.category}
              </p>
            </div> */}
            <div className="flex gap-5 items-center">
              <span className="text-sm md:text-lg font-medium text-foreground">
                TK {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs md:text-sm text-muted-foreground line-through">
                  TK {product.originalPrice}
                </span>
              )}
            </div>
          </div>
          <div>
            {isCarted ? (
              <Button
                variant="outline"
                size="sm"
                className="border border-primary hover:bg-primary/70 hover:text-black  md:h-8 md:w-8"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFromCart(product.id);
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border border-primary-foreground h-7 w-7 md:h-8 md:w-8 hover:bg-primary-foreground/70 hover:text-white hover:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>

        <CardFooter
          className="pt-2 px-2 md:px-3 lg:px-4 flex flex-col gap-1 md:gap-3
      "
        >
          {/* <div className="flex flex-col md:flex-row w-full items-center justify-between gap-1 md:gap-3">
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
          </div> */}
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
    </Link>
  );
};

export default ProductCard;
