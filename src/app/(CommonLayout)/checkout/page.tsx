/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Address from "@/components/modules/checkout/Address";
import CheckoutProducts from "@/components/modules/checkout/CheckoutProducts";
import Coupon from "@/components/modules/checkout/Coupon";
import PaymentDetails from "@/components/modules/checkout/PaymentDetails";
import React, { useState } from "react";
import {
  citySelector,
  clearCart,
  couponSelector,
  discountAmountSelector,
  grandTotalSelector,
  orderProductsSelector,
  orderSelector,
  shippingAddressSelector,
  shippingCostSelector,
  subTotalSelector,
} from "@/redux/features/cart/cartSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createOrder } from "@/services/checkout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCurrentUser } from "@/redux/features/auth/authSlice";

interface IAddressError {
  city: string;
  shippingAddress: string;
}
type PaymentMethod = "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
type PaymentProvider = "BKASH" | "NAGAD" | "ROCKET";

const PAYMENT_NUMBERS = {
  BKASH: "01712-345678",
  NAGAD: "01812-345678",
  ROCKET: "01912-345678",
};

const CheckoutPage = () => {
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [addressError, setAdressError] = useState<IAddressError>({
    city: "",
    shippingAddress: "",
  });
  const [paymentError, setPaymentError] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CASH_ON_DELIVERY");
  const [paymentProvider, setPaymentProvider] =
    useState<PaymentProvider>("BKASH");
  const [open, setOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const totalAmount = useAppSelector(subTotalSelector);
  const shippingCost = useAppSelector(shippingCostSelector);
  const discountAmount = useAppSelector(discountAmountSelector);
  const grandTotal = useAppSelector(grandTotalSelector);
  const order = useAppSelector(orderSelector);
  const city = useAppSelector(citySelector);
  const shippingAddress = useAppSelector(shippingAddressSelector);
  const cartProducts = useAppSelector(orderProductsSelector);
  const coupon = useAppSelector(couponSelector);
  const user = useAppSelector(useCurrentUser);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleOrder = async () => {
    const orderLoading = toast.loading("Order is being placed");

    try {
      if (!user) {
        router.push("/login");
        throw new Error("Please login first.");
      }

      if (cartProducts.length === 0) {
        throw new Error("Cart is empty, what are you trying to order ??");
      }

      let orderData;

      if (coupon.code) {
        orderData = { ...order, coupon: coupon.code };
      } else {
        orderData = order;
      }
      if (paymentMethod === "ONLINE_PAYMENT") {
        if (!transactionId) {
          setPaymentError("Please enter a transaction ID");
          throw new Error("Transaction ID is required for Pay Now method");
        }
        orderData = {
          ...orderData,
          paymentMethod,
          paymentProvider,
          transactionId,
        };
      } else {
        orderData = {
          ...orderData,
          paymentMethod,
        };
      }

      orderData = {
        ...orderData,
        totalAmount,
        shippingCost,
        discountAmount,
        grandTotal,
      };

      const res = await createOrder(orderData);

      if (res.success) {
        toast.success(res.message, { id: orderLoading });
        dispatch(clearCart());
        router.push("/");
      }

      if (!res.success) {
        toast.error(res.message, { id: orderLoading });
      }
    } catch (error: any) {
      toast.error(error.message, { id: orderLoading });
    }
  };

  const handleOpenPaymentModal = () => {
    if (!city) {
      setAdressError({ ...addressError, city: "City is required" });
      toast.error("City is required");
      return;
    }
    if (!shippingAddress) {
      setAdressError({
        ...addressError,
        shippingAddress: "Shipping address is required",
      });
      toast.error("Shipping address is required");
      return;
    }

    setOpen(true);
  };

  return (
    <div className="container px-2 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 my-5">
      <CheckoutProducts isCouponApplied={isCouponApplied} />
      <Coupon setIsApplied={setIsCouponApplied} />
      <Address
        addressError={addressError}
        setAdressError={setAdressError}
        selectedCity={city}
        selectedShippingAddress={shippingAddress}
      />
      <PaymentDetails
        subTotal={totalAmount}
        shippingCost={shippingCost}
        discountAmount={discountAmount}
        grandTotal={grandTotal}
        coupon={coupon}
        handleOpen={handleOpenPaymentModal}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Method</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to complete your order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value as PaymentMethod)
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors">
                  <RadioGroupItem
                    value="CASH_ON_DELIVERY"
                    id="cash-on-delivery"
                  />
                  <Label
                    htmlFor="cash-on-delivery"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    Cash on Delivery
                  </Label>
                </div>

                <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="ONLINE_PAYMENT" id="online-payment" />
                  <Label
                    htmlFor="online-payment"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    Pay Now
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "ONLINE_PAYMENT" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Select Payment Provider
                  </Label>
                  <RadioGroup
                    value={paymentProvider}
                    onValueChange={(value) =>
                      setPaymentProvider(value as PaymentProvider)
                    }
                    className="grid grid-cols-3 gap-3"
                  >
                    <div className="relative">
                      <RadioGroupItem
                        value="BKASH"
                        id="bkash"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="bkash"
                        className="flex items-center justify-center rounded-lg border-2 border-border bg-background p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                      >
                        <span className="font-semibold text-sm">bKash</span>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem
                        value="NAGAD"
                        id="nagad"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="nagad"
                        className="flex items-center justify-center rounded-lg border-2 border-border bg-background p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                      >
                        <span className="font-semibold text-sm">Nagad</span>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem
                        value="ROCKET"
                        id="rocket"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="rocket"
                        className="flex items-center justify-center rounded-lg border-2 border-border bg-background p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                      >
                        <span className="font-semibold text-sm">Rocket</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Alert className="bg-primary/5 border-primary/20">
                  <AlertDescription className="text-sm">
                    <span className="font-medium">Send money to:</span>{" "}
                    <span className="font-bold text-primary">
                      {PAYMENT_NUMBERS[paymentProvider]}
                    </span>
                    <span className="block mt-1 text-xs text-muted-foreground">
                      Use {paymentProvider} to send payment to this number
                    </span>
                  </AlertDescription>
                </Alert>

                <div>
                  <Label
                    htmlFor="transaction-id"
                    className="text-sm font-medium mb-2 block"
                  >
                    Transaction ID
                  </Label>
                  <Input
                    id="transaction-id"
                    type="text"
                    placeholder="Enter your transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full"
                  />
                  {paymentError && (
                    <p className="text-sm text-red-600 mt-1">{paymentError}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Please enter the transaction ID from your {paymentProvider}{" "}
                    payment
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOrder}>Confirm Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;
