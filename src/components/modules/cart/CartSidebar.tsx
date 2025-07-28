"use client";
import { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { orderProductsSelector } from "@/redux/features/cartSlice";

const CartSidebar = ({ children }: { children: ReactNode }) => {
  const products = useAppSelector(orderProductsSelector);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
            {products.length}
          </Badge>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({products.length} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {products.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col space-y-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-auto py-4 space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-3 border rounded-lg"
                  >
                    <Image
                      src={product.imageUrl as string}
                      alt={product.name}
                      width={70}
                      height={70}
                      className="object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${product.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        // onClick={() => handleQuantityChange(item.product_id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">
                        {product.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        // onClick={() => handleQuantityChange(item.product_id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        // onClick={() => handleRemoveItem(item.product_id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  {/* <span>${getTotalPrice().toFixed(2)}</span> */}
                </div>
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
