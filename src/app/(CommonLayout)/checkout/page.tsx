import Address from "@/components/modules/checkout/Address";
import CheckoutProducts from "@/components/modules/checkout/CheckoutProducts";
import Coupon from "@/components/modules/checkout/Coupon";
import PaymentDetails from "@/components/modules/checkout/PaymentDetails";
import React from "react";

const ChekoutPage = () => {
  return (
    <div className="container mx-auto grid grid-cols-12 gap-8 my-5">
      <CheckoutProducts />
      <Coupon />
      <Address />
      <PaymentDetails />
    </div>
  );
};

export default ChekoutPage;
