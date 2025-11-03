import { TUser } from "@/types/user";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const verifyToken = (base64Token: string) => {
  const token = Buffer.from(base64Token, "base64").toString("utf-8");
  if (!token) {
    toast.error("Your session has expired. Please log in again.");
  }
  const decoded: TUser = jwtDecode(token);

  return {
    user: {
      userId: decoded.userId,
      name: decoded.name,
      role: decoded.role,
      phone: decoded.phone,
    },
  };
};
