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
    const token = request.cookies.get("refreshToken")?.value;

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
  } catch {
    return null;
  }
};
