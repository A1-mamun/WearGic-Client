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
    console.log("Error creating product:", error);
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
    console.log("Error fetching products:", error);
  }
};

export const getProductById = async (id: string) => {
  console.log("id:", id);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/product/${id}`,
      {
        next: {
          tags: ["PRODUCT"],
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.log("Error fetching product by ID:", error);
  }
};
