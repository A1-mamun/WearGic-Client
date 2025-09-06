/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import {
  couponSelector,
  fetchCoupon,
  removeCoupon,
  subTotalSelector,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

interface CouponProps {
  // eslint-disable-next-line no-unused-vars
  setIsApplied: (isApplied: boolean) => void;
}

export default function Coupon({ setIsApplied }: CouponProps) {
  const subTotal = useAppSelector(subTotalSelector);
  const { isLoading, code } = useAppSelector(couponSelector);

  useEffect(() => {
    if (code === "") {
      form.reset();
    }
  }, [code]);

  const dispatch = useAppDispatch();

  const form = useForm();

  const couponInput = form.watch("coupon");

  const handleRemoveCoupon = () => {
    setIsApplied(false);
    form.reset();
    dispatch(removeCoupon());
    console.log("Coupon removed");
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await dispatch(
        fetchCoupon({ couponCode: data.coupon, subTotal })
      ).unwrap();
      if (res.success) {
        setIsApplied(true);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="border-2 border-white bg-background brightness-105 rounded-md col-span-4  p-5 ">
      <div className="flex flex-col justify-between h-full">
        <h1 className="text-2xl font-bold">Use Coupon code</h1>
        <p className="text-gray-500">Enter your coupon code if you have one.</p>

        <Form {...form}>
          <form className="mt-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="coupon"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className=""
                          placeholder="Promo / Coupon code"
                          value={field.value || code}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {couponInput && (
                <Button
                  onClick={handleRemoveCoupon}
                  variant="outline"
                  type="button"
                  className="bg-red-100 size-"
                >
                  <Trash size={24} className="text-red-500" />
                </Button>
              )}
            </div>
            <Button
              disabled={!couponInput}
              type="submit"
              className="w-full text-xl font-semibold py-5 "
            >
              {isLoading ? "Applying..." : "Apply"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
