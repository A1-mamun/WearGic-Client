"use server";

import { cookies } from "next/headers";
// import { FieldValues } from "react-hook-form";

// export const addUserInfo = async (userData: FieldValues, id: string) => {
//   try {
//     const token = (await cookies()).get("accessToken")?.value;

//     if (!token) {
//       throw new Error("You must be logged in to create a category");
//     }

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_API}/auth/add-user-info/${id}`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//         credentials: "include",
//       }
//     );

//     const result = await res.json();
//     return result;
//   } catch (error: any) {
//     return Error(error);
//   }
// };

// export const loginUser = async (userData: FieldValues) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(userData),
//       credentials: "include",
//     });

//     const result = await res.json();
//     return result;
//   } catch (error: any) {
//     return Error(error);
//   }
// };

// export const verifyOtp = async (userData: FieldValues) => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_API}/auth/verify-otp`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//         credentials: "include",
//       }
//     );

//     const result = await res.json();

//     if (result?.success) {
//       (await cookies()).set("accessToken", result?.data?.accessToken);
//       (await cookies()).set("refreshToken", result?.data?.refreshToken);
//     }

//     return result;
//   } catch (error: any) {
//     return Error(error);
//   }
// };

// export const resendOtp = async (userData: FieldValues) => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_API}/auth/resend-otp`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//         credentials: "include",
//       }
//     );

//     const result = await res.json();
//     return result;
//   } catch (error: any) {
//     return Error(error);
//   }
// };

export const logoutUser = async () => {
  const cookieStore = await cookies();

  // Delete with the same options used when setting
  cookieStore.delete({
    name: "accessToken",
    path: "/",
    domain: ".weargic.com", // Uncomment if you set domain when creating cookie
  });

  cookieStore.delete({
    name: "refreshToken",
    path: "/",
    domain: ".weargic.com", // Uncomment if you set domain when creating cookie
  });
};
