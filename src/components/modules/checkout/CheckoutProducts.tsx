"use client";
import emptyCart from "@/assets/empty-cart.png";
import CartProductCard from "../cart/CartProductCard";
import { useAppSelector } from "@/redux/hooks";
import { orderProductsSelector } from "@/redux/features/cart/cartSlice";
import Image from "next/image";
import ICartProduct from "@/types/cartProduct";
const CheckoutProducts = ({
  isCouponApplied,
}: {
  isCouponApplied: boolean;
}) => {
  const products = useAppSelector(orderProductsSelector);

  return (
    <div className="border-2 border-gray-300 bg-background brightness-105 rounded-md lg:col-span-8 h-full row-span-3 p-2 md:p-5 lg:p-10 space-y-3 md:space-y-4 lg:space-y-5">
      {products.length === 0 && (
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold">Your cart is empty</p>
          <p className="mt-2">
            Looks like your cart is on vacation—bring it back to work by adding
            some items!
          </p>
          <div className="flex justify-center items-center ">
            <Image
              src={emptyCart.src}
              width={500}
              height={500}
              alt="empty cart"
            />
          </div>
        </div>
      )}
      {products?.map((product: ICartProduct) => (
        <CartProductCard
          isCouponApplied={isCouponApplied}
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};

export default CheckoutProducts;
