"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Minus,
  Plus,
  BadgeCheckIcon,
  BadgeIcon,
} from "lucide-react";
import Image from "next/image";
import { TProduct, TProductImage, TShowedproductImage } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addProductWithQuantity,
  orderProductsSelector,
} from "@/redux/features/cart/cartSlice";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const ProductDetails = ({ productData }: { productData: TProduct }) => {
  const [showedImage, setShowedImage] = useState<TShowedproductImage | null>(
    productData?.productImages?.length ? productData.productImages[0] : null,
  );

  // const [showedColor, setShowedcolor] = useState<TProductImage | null>();

  const [selectedColor, setSelectedColor] = useState<TProductImage | null>(
    null,
  );
  const [colorError, setColorError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const products = useAppSelector(orderProductsSelector);

  useEffect(() => {
    const existsInCart = products.find(
      (cartItem) => cartItem.id === productData.id,
    );

    setSelectedColor(
      existsInCart
        ? productData.productImages.find(
            (img) => img.id === existsInCart.selectedProductId,
          ) || null
        : null,
    );

    setQuantity(existsInCart ? existsInCart.orderQuantity : 1);
  }, [products, productData]);

  // Check if the product with the selected color is already in the cart

  const discountPercentage = Math.round(
    (((productData?.originalPrice ?? 0) - productData?.price) /
      (productData?.originalPrice ?? 0)) *
      100,
  );

  const dispatch = useAppDispatch();

  const handleQuantityChange = (change: number) => {
    if (!selectedColor) {
      setColorError(true);
      return;
    }
    const newQuantity = quantity + change;
    if (
      newQuantity >= 1 &&
      selectedColor?.stock !== undefined &&
      newQuantity <= selectedColor.stock
    ) {
      setQuantity(newQuantity);
    }
  };

  const handleColorChange = (color: string) => {
    const colorImage = productData.productImages.find(
      (img) => img.color === color,
    );
    if (colorImage) {
      setSelectedColor(colorImage as TProductImage);
      setColorError(false);
      const matchingImage = productData.productImages.find(
        (img) => img.color === color,
      );
      if (matchingImage) {
        setShowedImage(matchingImage);
      }
    } else {
      setColorError(true);
    }
  };

  const handleAddToCart = (product: TProduct) => {
    if (!selectedColor) {
      setColorError(true);
      return;
    }
    dispatch(
      addProductWithQuantity({
        product,
        selectedId: selectedColor.id,
        quantity,
      }),
    );
  };

  const handleBuyNow = (product: TProduct) => {
    if (!selectedColor) {
      setColorError(true);
      return;
    }
    dispatch(
      addProductWithQuantity({
        product,
        selectedId: selectedColor.id,
        quantity,
      }),
    );
    // Redirect to checkout page
    router.push("/checkout");
  };

  // all images array containing product images and bulk images
  const allImages = [
    ...(productData.productImages || []),
    ...(productData.bulkImages || []),
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-5 md:gap-12 max-w-7xl mx-auto">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main image */}
        <div className="relative w-full mx-auto aspect-[4/3] overflow-hidden rounded-lg bg-card">
          <Image
            key={showedImage?.id}
            src={showedImage?.imageUrl || "/placeholder.svg"}
            alt={`${productData.name} in ${showedImage?.color ?? "default"}`}
            width={1500}
            height={1500}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            unoptimized
            priority
          />
        </div>

        {/* image Selection */}
        <div className="flex flex-wrap gap-2 overflow-x-auto sm:overflow-visible md:pb-1">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setShowedImage(image)}
              className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border transition-all
          ${
            showedImage?.id === image.id
              ? "border-primary ring-2 ring-primary/30"
              : "border-border hover:border-primary/50"
          }`}
            >
              <Image
                src={image.imageUrl || "/placeholder.svg"}
                alt={`${productData.name}-${index}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Specifications Table */}
        <Card className="p-6 bg-card hidden lg:block">
          {productData.specifications &&
            productData.specifications.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Specifications</h4>
                <Table className="w-full table-fixed">
                  <TableBody className="text-sm font-open-sans">
                    {productData.specifications.map((spec, index) => (
                      <TableRow key={index}>
                        {/* Key cell */}
                        <TableCell className="text-muted-foreground break-words whitespace-normal align-top">
                          {spec.key}
                        </TableCell>

                        {/* Value cell */}
                        <TableCell className="break-words whitespace-normal align-top">
                          {spec.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
        </Card>
      </div>

      {/* Product Information */}
      <div className="space-y-6">
        <Card className="p-6 bg-card">
          <div>
            <div className="mb-2 flex gap-2">
              <Badge variant="secondary" className="bg-green-300 text-black">
                {productData.brand}
              </Badge>
              <Badge variant="secondary" className="">
                {productData.category}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-montserrat text-foreground mb-2">
              {productData.name}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground font-open-sans">
              <span className="font-medium text-black">Product Code: </span>
              {productData.code}
            </p>

            <div className="flex items-center gap-3 mt-4">
              <Badge className="bg-rose-600 font-semibold text-white text-xs md:text-sm">
                {discountPercentage}% OFF
              </Badge>
              <Badge className="bg-primary text-black font-semibold text-xs md:text-sm">
                {productData.isNew ? "New" : "Featured"}
              </Badge>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-end gap-3">
              <span className="text-2xl md:text-3xl font-semibold text-foreground">
                TK {productData.price}
              </span>
              <span className="text-base md:text-xl text-muted-foreground line-through">
                TK {productData.originalPrice}
              </span>
            </div>
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="w-fit">
                Limited Time Offer
              </Badge>
            )}
          </div>

          {/* available color options */}
          <div className="space-y-1 md:space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {productData?.productImages?.map((image) => (
                <div
                  key={image.id}
                  className={`bg-gray-200 flex items-center gap-2 px-3 py-1 text-black font-medium text-base rounded-full hover:cursor-pointer ${
                    showedImage?.id === image.id ? "border border-primary" : ""
                  }`}
                  onClick={() => setShowedImage(image)}
                >
                  {showedImage?.id === image.id ? (
                    <BadgeCheckIcon size={20} color="green" />
                  ) : (
                    <BadgeIcon size={20} color="green" />
                  )}
                  {image.color}
                </div>
              ))}
            </div>
          </div>

          {/* Color and Stock Info */}
          <div className="space-y-1 md:space-y-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                Color: <span className="text-destructive">*</span>
              </label>
            </div>
            <select
              value={selectedColor?.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className={`w-full px-2 md:px-3 py-1 md:py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${
                colorError ? "border-destructive" : "border-border"
              }`}
            >
              <option value="">Select a color</option>
              {productData?.productImages?.map((image) => (
                <option key={image.id} value={image.color}>
                  {image.color}
                </option>
              ))}
            </select>
            {colorError && (
              <p className="text-sm text-destructive font-medium">
                Please select a color to continue
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          {!selectedColor && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Quantity</p>
              <div className="flex items-center gap-2 md:gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 md:h-4 w-3 md:w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-3 md:h-4 w-3 md:w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {selectedColor &&
              (selectedColor.stock > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Quantity
                  </p>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 md:h-4 w-3 md:w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={
                        selectedColor ? quantity >= selectedColor.stock : false
                      }
                    >
                      <Plus className="h-3 md:h-4 w-3 md:w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-base font-medium text-red-500">
                    Out of Stock
                  </p>
                </div>
              ))}
          </div>

          {/* Add to Cart */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              onClick={() => handleAddToCart(productData)}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart - ${(productData.price * quantity).toFixed(2)}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full bg-transparent"
              onClick={() => handleBuyNow(productData)}
            >
              Buy Now
            </Button>
          </div>
        </Card>

        {/* Product Details */}

        <Card className="p-6 bg-card">
          {productData.description && (
            <div>
              <h3 className="font-semibold font-montserrat text-lg mb-2">
                Product Details
              </h3>
              <p className="mb-2 text-[15px] text-justify leading-6">
                {productData.description}
              </p>
            </div>
          )}

          <div className="lg:hidden">
            {/* Specifications Table */}
            {productData.specifications &&
              productData.specifications.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Specifications</h4>
                  <Table className="w-full table-fixed">
                    <TableBody className="text-sm font-open-sans">
                      {productData.specifications.map((spec, index) => (
                        <TableRow key={index}>
                          {/* Key cell */}
                          <TableCell className="text-muted-foreground break-words whitespace-normal align-top">
                            {spec.key}
                          </TableCell>

                          {/* Value cell */}
                          <TableCell className="break-words whitespace-normal align-top">
                            {spec.value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
