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
    // <div className="group relative bg-card rounded-xl shadow-2xl shadow-blue-300 transition-all duration-300 overflow-hidden">
    //   {/* Image container */}
    //   <div className="relative overflow-hidden rounded-t-xl w-full h-64">
    //     <Image
    //       fill
    //       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    //       src={primaryImage.imageUrl}
    //       alt={product.name}
    //       priority
    //       className=" object-cover group-hover:scale-110 transition-transform duration-500"
    //     />

    //     {/* Badges */}
    //     {discountPercentage > 0 && (
    //       <Badge className="absolute top-4 left-4 bg-rose-600 text-white font-bold">
    //         {discountPercentage}% OFF
    //       </Badge>
    //     )}
    //     {product.isNew && (
    //       <Badge
    //         className={`absolute ${
    //           discountPercentage > 0 ? "top-12" : "top-4"
    //         } left-4 bg-primary text-black font-medium`}
    //       >
    //         New
    //       </Badge>
    //     )}
    //   </div>

    //   {/* Content */}
    //   <div className="p-4 space-y-3">
    //     <div className="flex justify-between items-end">
    //       <div className="space-y-1">
    //         <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
    //           {product.category}
    //         </p>
    //         <h3 className="font-semibold text-foreground transition-colors line-clamp-2">
    //           {product.name}
    //         </h3>
    //       </div>
    //       <div className="flex items-center gap-2">
    //         <span className="text-lg font-bold text-foreground">
    //           ${product.price}
    //         </span>
    //         {product.originalPrice && (
    //           <span className="text-sm text-muted-foreground line-through">
    //             ${product.originalPrice}
    //           </span>
    //         )}
    //       </div>
    //     </div>

    //     {/* Rating */}
    //     {/* <div className="flex items-center gap-2">
    //       <div className="flex items-center gap-1">
    //         {[...Array(5)].map((_, i) => (
    //           <Star
    //             key={i}
    //             className={`h-3 w-3 ${
    //               i < Math.floor(product.rating)
    //                 ? "fill-accent text-accent"
    //                 : "text-muted-foreground/30"
    //             }`}
    //           />
    //         ))}
    //       </div>
    //       <span className="text-xs text-muted-foreground">
    //         ({product.reviewCount})
    //       </span>
    //     </div> */}

    //     <div className="flex items-center justify-between gap-3">
    //       <Button
    //         variant="ghost"
    //         size="sm"
    //         className="flex-1 border-2 border-border hover:bg-accent hover:text-accent-foreground"
    //         onClick={() => router.push(`/products/${product.id}`)}
    //       >
    //         See Details
    //       </Button>
    //       {isCarted ? (
    //         <Button
    //           variant="ghost"
    //           size="sm"
    //           className="flex-1 border-2 border-red-400 hover:bg-accent hover:text-accent-foreground"
    //           onClick={() => handleRemoveFromCart(product.id)}
    //         >
    //           Remove from Cart
    //         </Button>
    //       ) : (
    //         <Button
    //           variant="ghost"
    //           size="sm"
    //           className="flex-1 border-2 border-border hover:bg-accent hover:text-accent-foreground"
    //           onClick={() => handleAddToCart(product)}
    //         >
    //           Add to Cart
    //         </Button>
    //       )}
    //     </div>
    //     <div className="w-full">
    //       <Button
    //         variant="default"
    //         size="sm"
    //         className="w-full"
    //         onClick={() => router.push(`/products/${product.id}`)}
    //       >
    //         Buy Now
    //       </Button>
    //     </div>
    //   </div>
    // </div>

    <Card className="group max-w-sm rounded-xl shadow-xl transition-all duration-300 overflow-hidden pt-0">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-xl w-full h-60">
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
          <Badge className="absolute top-4 left-4 bg-rose-600 text-white font-bold">
            {discountPercentage}% OFF
          </Badge>
        )}
        {product.isNew && (
          <Badge
            className={`absolute ${
              discountPercentage > 0 ? "top-12" : "top-4"
            } left-4 bg-primary text-black font-medium`}
          >
            New
          </Badge>
        )}
      </div>

      <CardHeader className="px-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
          {product.category}
        </p>
        <h3 className="font-semibold text-foreground transition-colors line-clamp-2">
          {product.name}
        </h3>
      </CardHeader>

      <CardContent className="px-4 -mt-3 -mb-3">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-foreground">
            ৳{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground font-bold line-through">
              ৳{product.originalPrice}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 flex flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-3">
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
        <Button
          variant="default"
          size="sm"
          className="w-full"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
