"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { TProduct, TProductImage } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addProductWithQuantity,
  orderProductsSelector,
} from "@/redux/features/cart/cartSlice";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const ProductDetails = ({ productData }: { productData: TProduct }) => {
  const [showedColor, setShowedColor] = useState<TProductImage | null>(
    productData?.productImages?.length ? productData.productImages[0] : null
  );
  const [selectedColor, setSelectedColor] = useState<TProductImage | null>(
    null
  );
  const [colorError, setColorError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const products = useAppSelector(orderProductsSelector);

  useEffect(() => {
    const existsInCart = products.find(
      (cartItem) => cartItem.id === productData.id
    );

    setSelectedColor(
      existsInCart
        ? productData.productImages.find(
            (img) => img.id === existsInCart.selectedProductId
          ) || null
        : null
    );

    setQuantity(existsInCart ? existsInCart.orderQuantity : 1);
  }, [products, productData]);

  // Check if the product with the selected color is already in the cart

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
    dispatch(
      addProductWithQuantity({
        product,
        selectedId: selectedColor.id,
        quantity,
      })
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
      })
    );
    // Redirect to checkout page
    router.push("/checkout");
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
            <Card className="p-6 bg-card">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {productData.category}
                </Badge>
                <h1 className="text-4xl font-black font-montserrat text-foreground mb-2">
                  {productData.name}
                </h1>
                <p className="text-lg text-muted-foreground font-open-sans">
                  {productData.gender} Wear
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <Badge className="bg-rose-600 font-semibold text-white text-sm">
                    {discountPercentage}% OFF
                  </Badge>
                  <Badge className="bg-primary text-black font-semibold text-sm">
                    {productData.isNew ? "New" : "Featured"}
                  </Badge>
                </div>
              </div>

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
                  onClick={() => handleBuyNow(productData)}
                >
                  Buy Now
                </Button>
              </div>
            </Card>

            {/* Product Details */}

            <Card className="p-6 bg-card">
              <h3 className="font-semibold font-montserrat text-lg mb-2">
                Product Details
              </h3>
              {productData.description && (
                <p className="mb-2 text-[15px] text-justify leading-6">
                  {productData.description}
                </p>
              )}

              {/* Specifications Table */}
              {productData.specifications &&
                productData.specifications.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Specifications</h4>
                    <Table>
                      <TableBody className="text-sm font-open-sans">
                        {productData.specifications.map((spec, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-muted-foreground w-1/3">
                              {spec.key}
                            </TableCell>
                            <TableCell>{spec.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
