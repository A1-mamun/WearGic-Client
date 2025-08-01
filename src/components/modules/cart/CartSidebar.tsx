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
import { ShoppingCart } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import {
  orderProductsSelector,
  subtotalSelector,
} from "@/redux/features/cartSlice";
import CartProductCard from "./CartProductCard";
import Link from "next/link";

const CartSidebar = ({ children }: { children: ReactNode }) => {
  const products = useAppSelector(orderProductsSelector);

  const subtotal = useAppSelector(subtotalSelector);

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
                  <CartProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
