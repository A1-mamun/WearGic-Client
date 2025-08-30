export type TUser = {
  userId: string;
  phone: string;
  name: string;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
};
