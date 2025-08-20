/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TCreateProduct } from "@/types/product";
import { revalidateTag } from "next/cache";
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

    if (!res.ok) {
      throw new Error("Failed to create product");
    }

    const data = await res.json();

    //Invalidate the product cache after creating a new product
    revalidateTag("PRODUCT");

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const getAllProducts = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/product/products`,
      {
        next: {
          tags: ["PRODUCT"],
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    // console.log("Get all products response:", await res.json());

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getProductById = async (id: string) => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) {
      throw new Error("No access token found");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/product/product/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
