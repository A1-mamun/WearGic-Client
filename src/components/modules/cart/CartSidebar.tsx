"use client";
import { ReactNode, useState } from "react";
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
  subTotalSelector,
} from "@/redux/features/cart/cartSlice";
import CartProductCard from "./CartProductCard";
import { useRouter } from "next/navigation";

const CartSidebar = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const products = useAppSelector(orderProductsSelector);

  const subTotal = useAppSelector(subTotalSelector);

  const handleCheckout = () => {
    setOpen(false); // Close the sidebar
    router.push("/checkout"); // Navigate to checkout
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
                  <CartProductCard
                    key={product.selectedProductId}
                    product={product}
                  />
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>

                <Button className="w-full" size="lg" onClick={handleCheckout}>
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
