"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { TProduct, TProductImage } from "@/types/product";
import { useAppDispatch } from "@/redux/hooks";
import { addProduct } from "@/redux/features/cartSlice";

const ProductDetails = ({ productData }: { productData: TProduct }) => {
  const [showedColor, setShowedColor] = useState<TProductImage | null>(
    productData?.productImages?.length ? productData.productImages[0] : null
  );
  const [selectedColor, setSelectedColor] = useState<TProductImage | null>(
    null
  );
  const [colorError, setColorError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const discountPercentage = Math.round(
    (((productData?.originalPrice ?? 0) - productData?.price) /
      (productData?.originalPrice ?? 0)) *
      100
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
      (img) => img.color === color
    );
    if (colorImage) {
      setSelectedColor(colorImage as TProductImage);
      setColorError(false);
    } else {
      setColorError(true);
    }
  };

  const handleAddToCart = (product: TProduct) => {
    if (!selectedColor) {
      setColorError(true);
      return;
    }
    dispatch(addProduct(product));
  };

  const handleBuyNow = () => {
    if (!selectedColor) {
      setColorError(true);
      return;
    }
    // Buy now logic here
    // console.log("Buy now:", { color: selectedColor, quantity });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
              <Image
                src={showedColor?.imageUrl || "/placeholder.svg"}
                alt={`${productData.name} in ${showedColor?.color}`}
                width={1500}
                height={1500}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm">
                {discountPercentage}% OFF
              </Badge>
              <Badge className="absolute top-12 left-4 bg-primary text-primary-foreground text-sm">
                {productData.isNew ? "New" : "Featured"}
              </Badge>
              {/* <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-background/80 hover:bg-background"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  }`}
                />
              </Button> */}
            </div>

            {/* Color Selection */}
            <div className="flex gap-3">
              {productData?.productImages?.map((image) => (
                <button
                  key={image.id}
                  onClick={() => {
                    setShowedColor(image);
                  }}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-1 transition-all ${
                    showedColor?.id === image.id
                      ? "border-primary ring-1 ring-accent/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`${productData.name} in ${image.color}`}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {productData.category}
              </Badge>
              <h1 className="text-4xl font-black font-montserrat text-foreground mb-2">
                {productData.name}
              </h1>
              <p className="text-lg text-muted-foreground font-open-sans">
                {productData.description}
              </p>
            </div>

            {/* Rating */}
            {/* <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (4.8) • 127 reviews
              </span>
            </div> */}

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-foreground">
                  ${productData.price}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ${productData.originalPrice}
                </span>
              </div>
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="w-fit">
                  Limited Time Offer
                </Badge>
              )}
            </div>

            {/* Color and Stock Info */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Color: <span className="text-destructive">*</span>
                </label>
              </div>
              <select
                value={selectedColor?.color}
                onChange={(e) => handleColorChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${
                  colorError ? "border-destructive" : "border-border"
                }`}
              >
                <option value="">Select a color</option>
                {productData?.productImages?.map((image) => (
                  <option key={image.id} value={image.color}>
                    {image.color} ({image.stock} in stock)
                  </option>
                ))}
              </select>
              {colorError && (
                <p className="text-sm text-destructive font-medium">
                  Please select a color to continue
                </p>
              )}
              <div>
                {selectedColor && selectedColor.stock < 50 && (
                  <Badge variant="destructive" className="w-fit">
                    Only {selectedColor.stock} left in stock!
                  </Badge>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Quantity</p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={
                    selectedColor ? quantity >= selectedColor.stock : false
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>

            {/* Product Details */}
            {/* <Card className="p-6 bg-card">
              <h3 className="font-semibold font-montserrat text-lg mb-4">
                Product Details
              </h3>
              <div className="space-y-3 text-sm font-open-sans">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Material:</span>
                  <span>80% Cotton, 20% Polyester</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fit:</span>
                  <span>Regular Fit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Care:</span>
                  <span>Machine Wash Cold</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span>{productData.gender}</span>
                </div>
              </div>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
