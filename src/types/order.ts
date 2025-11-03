export interface IOrder {
  products: IOrderProduct[];
  coupon?: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentProvider?: string;
  transactionId?: string;
  totalAmount: number;
  shippingCost: number;
  discountAmount: number;
  grandTotal: number;
}

export interface IOrderProduct {
  productId: string;
  quantity: number;
}

export interface IOrderResponse {
  id: string;
  orderId: string;
  totalAmount: number;
  discount: number;
  shippingCost: number;
  grandTotal: number;
  orderStatus: "ACCEPTED" | "CANCELLED" | "DELIVERED" | "COMPLETED" | string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | string;
  paymentMethod: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT" | string;
  paymentProvider?: string;
  transactionId?: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    phone: string;
    district: string;
  };
  orderItems: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      code: string;
      name: string;
      price: number;
    };
    productImage: {
      imageUrl: string;
      color: string;
    };
  }>;
}
