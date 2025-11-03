import { jwtDecode } from "jwt-decode";
import { NextRequest } from "next/server";

interface DecodedToken {
  userId: string;
  name: string;
  role: string;
  phone: string;
  iat?: number;
  exp?: number;
}

export const getCurrentUser = (request: NextRequest): DecodedToken | null => {
  try {
    const allCookies = request.cookies.getAll();
    console.log("All cookies in middleware:", allCookies);

    const accessToken = request.cookies.get("accessToken")?.value;
    console.log("Access token exists:", !!accessToken);

    const token = accessToken
      ? Buffer.from(accessToken, "base64").toString("utf-8")
      : null;

    if (!token) {
      return null;
    }

    // Decode the JWT directly (no base64 decoding)
    const decodedData = jwtDecode<DecodedToken>(token);

    // Check if token is expired
    if (decodedData.exp && decodedData.exp * 1000 < Date.now()) {
      return null;
    }

    return decodedData;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
