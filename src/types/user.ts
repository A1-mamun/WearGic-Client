export type TUser = {
  userId: string;
  phone: string;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
};
