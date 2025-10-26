/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { IOrder } from "@/types/order";
import { cookies } from "next/headers";

export const createOrder = async (order: IOrder) => {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    throw new Error("You must be logged in to create a category");
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order/place-order`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );

    // console.log("Order data:", order);

    return await res.json();
    // return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const addCoupon = async (couponCode: string, subTotal: number) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/coupon/${couponCode}`,
      {
        method: "POST",
        headers: {
          // Authorization: (await cookies()).get("accessToken")!.value,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderAmount: subTotal }),
      }
    );

    return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};
