/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TCategory } from "@/types/category";
import { revalidateTag } from "next/cache";
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

    revalidateTag("CATEGORY");
    return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const getAllCategories = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/category/categories`,
      {
        next: {
          tags: ["CATEGORY"],
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    return await res.json();
  } catch (error) {
    // console.error("Get all products error:", error);
    throw error;
  }
};
