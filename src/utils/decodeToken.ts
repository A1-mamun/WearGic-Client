import { TUser } from "@/types/user";
import { jwtDecode } from "jwt-decode";

export const verifyToken = (token: string) => {
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
