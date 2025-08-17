/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TCategory } from "@/types/category";
import { TProduct } from "@/types/product";
import { cookies } from "next/headers";

export const createCategory = async (category: TCategory) => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) {
      throw new Error("You must be logged in to create a category");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/category/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      }
    );

    // console.log("Product data:", product);
    return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const getAllCategories = async (): Promise<TCategory[]> => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) {
      throw new Error("You must be logged in to get categories");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/category/categories`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
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
