"use client";
import Address from "@/components/modules/checkout/Address";
import CheckoutProducts from "@/components/modules/checkout/CheckoutProducts";
import Coupon from "@/components/modules/checkout/Coupon";
import PaymentDetails from "@/components/modules/checkout/PaymentDetails";
import React, { useState } from "react";

const CheckoutPage = () => {
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  return (
    <div className="container mx-auto grid grid-cols-12 gap-8 my-5">
      <CheckoutProducts isCouponApplied={isCouponApplied} />
      <Coupon setIsApplied={setIsCouponApplied} />
      <Address />
      <PaymentDetails />
    </div>
  );
};

export default CheckoutPage;
