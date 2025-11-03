"use client";

import { Button } from "@/components/ui/button";

interface PaymentDetailsProps {
  subTotal: number;
  shippingCost: number;
  discountAmount: number;
  grandTotal: number;
  coupon: { code: string; isLoading: boolean };
  handleOpen: () => void;
}

export default function PaymentDetails({
  subTotal,
  shippingCost,
  discountAmount,
  grandTotal,
  coupon,
  handleOpen,
}: PaymentDetailsProps) {
  return (
    <div className="border-2 border-white bg-background brightness-105 rounded-md lg:col-span-4 h-fit p-5">
      <h1 className="text-2xl font-bold">Payment Details</h1>
      {coupon.isLoading && <div>Loading...</div>}
      {!coupon.isLoading && (
        <>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between">
              <p className="text-gray-500 ">Subtotal</p>
              <p className="font-semibold">{subTotal}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-500 ">Discount</p>
              <p className="font-semibold">{discountAmount}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-500 ">Shipment Cost</p>
              <p className="font-semibold">{shippingCost}</p>
            </div>
          </div>
          <div className="flex justify-between mt-10 mb-5">
            <p className="text-gray-500 ">Grand Total</p>
            <p className="font-semibold">{grandTotal}</p>
          </div>
        </>
      )}
      <Button
        onClick={handleOpen}
        className="w-full text-xl font-semibold py-5"
      >
        Order Now
      </Button>
    </div>
  );
}
