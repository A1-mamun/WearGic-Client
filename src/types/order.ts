import { TProduct } from "./product";

export interface IOrder {
  products: TProduct[];
  coupon?: string;
  shippingAddress: string;
  paymentMethod: string;
}
