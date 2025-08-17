/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TCreateProduct, TProduct } from "@/types/product";
import { cookies } from "next/headers";

export const createProduct = async (product: TCreateProduct) => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) {
      throw new Error("You must be logged in to create a product");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/product/create-product`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    );

    // console.log("Product data:", product);
    return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const getAllProducts = async (): Promise<TProduct[]> => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) {
      throw new Error("No access token found");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/product/products`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ standard format
          "Content-Type": "application/json",
        },
        cache: "no-store", // ✅ prevents Next.js caching
      }
    );

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    // console.error("Get all products error:", error);
    throw error;
  }
};
