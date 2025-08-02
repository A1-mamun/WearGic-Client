/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { IOrder } from "@/types/order";
import { cookies } from "next/headers";

export const createOrder = async (order: IOrder) => {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/order`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: (await cookies()).get("accessToken")!.value,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(order),
    // });

    console.log("Order data:", order);

    return order;
    // return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const addCoupon = async (couponCode: string, subTotal: number) => {
  try {
    const res = await fetch(`http://localhost:5000/cupon/1`, {
      method: "POST",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderAmount: subTotal }),
    });

    return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};
