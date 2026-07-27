/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";

// import { useUser } from "@/contexts/userContext";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useAddUserInfoMutation,
  useLoginMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/authApi";
// import { verifyOtp } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cities } from "@/constants/cities";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser, useCurrentUser } from "@/redux/features/auth/authSlice";
import { verifyToken } from "@/utils/decodeToken";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((phone) => {
      return /^01[3-9]\d{8}$/.test(phone.replace(/\s/g, ""));
    }, "Please enter a valid phone number"),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

const registrationSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  district: z.string().min(1, "Please select a district"),
});

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "otp" | "info">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath") || "/";

  const [showOtp, setShowOtp] = useState(null);

  const OTP_DURATION = 180;

  const router = useRouter();

  // const { user, refreshUser } = useUser();
  const user = useAppSelector(useCurrentUser);
  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();
  const [addUserInfo] = useAddUserInfoMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
      terms: false,
    },
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = phoneForm;

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
  });

  // Load persisted state on mount
  useEffect(() => {
    // Only load persisted state if user is not logged in
    if (user) return;

    const savedStep = sessionStorage.getItem("auth_step");
    const savedPhone = sessionStorage.getItem("auth_phone");
    const savedTimerEnd = sessionStorage.getItem("auth_timer_end");

    if (savedStep && savedPhone) {
      setStep(savedStep as "phone" | "otp" | "info");
      setPhone(savedPhone);

      // Calculate remaining time
      if (savedTimerEnd) {
        const endTime = parseInt(savedTimerEnd);
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimer(remaining);
      }
    }
  }, [user]);

  const handleUserSubmit = async (data: z.infer<typeof registrationSchema>) => {
    await handleUserRegistration(data);
  };

  const handlePhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
    setLoading(true);
    try {
      const res = await login({ phone: data.phone }).unwrap();
      // console.log("Login response:", res);
      if (res.success) {
        setPhone(data.phone);
        setStep("otp");
        setShowOtp(res.data); // Store the OTP for testing purposes

        // Persist state
        sessionStorage.setItem("auth_step", "otp");
        sessionStorage.setItem("auth_phone", data.phone);

        const timerEnd = Date.now() + OTP_DURATION * 1000;
        sessionStorage.setItem("auth_timer_end", timerEnd.toString());

        setTimer(OTP_DURATION); // start 180s countdown
        // toast.success("OTP sent to your phone number!");
        toast.success(
          `Insufficient balance! Please use the OTP ${res.data} to log in.`,
          {
            duration: 10000,
          },
        );
      } else if (!res.success) {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to send OTP");
      // Log the full error to see its structure
      // console.log("Full error object:", error);
      // console.log("Error data:", error.data);
      // console.log("Error status:", error.status);

      // RTK Query error structure
      const errorMessage =
        error?.data?.message || error?.message || "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // start countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev - 1;
          if (newTimer <= 0) {
            sessionStorage.removeItem("auth_timer_end");
          }
          return newTimer;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // function to reset timer when resend clicked
  // const handleResendOtp = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await resendOtp({ phone }).unwrap();
  //     if (res.success) {
  //       setPhone(phone);

  //       // Update timer and persist
  //       const timerEnd = Date.now() + 60000;
  //       sessionStorage.setItem("auth_timer_end", timerEnd.toString());
  //       setTimer(180);

  //       toast.success(res.message || "OTP resent successfully!");
  //     } else if (!res.success) {
  //       toast.error(res.message || "Failed to send OTP");
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message || "Failed to send OTP");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const res = await resendOtp({ phone }).unwrap();

      if (res.success) {
        setShowOtp(res.data); // Store the OTP for testing purposes
        // Update timer and persist
        const timerEnd = Date.now() + OTP_DURATION * 1000;
        sessionStorage.setItem("auth_timer_end", timerEnd.toString());

        setTimer(OTP_DURATION);

        // toast.success(res.message || "OTP resent successfully!");

        toast.success(
          `Insufficient balance! Please use the OTP ${res.data} to log in.`,
          {
            duration: 10000,
          },
        );
      } else {
        toast.error(res.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      // RTK Query error structure
      const errorMessage =
        error?.data?.message || error?.message || "Failed to resend OTP";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // function to handle OTP verification
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await verifyOtp({ phone, otp }).unwrap();

      if (res.success && res.data.isNewUser) {
        // Decode the access token
        const user = verifyToken(res.data.accessToken);

        // Set user and token in Redux store
        dispatch(
          setUser({
            user: user.user,
            token: res.data.accessToken,
          }),
        );
        setIsNewUser(true);
        setStep("info");
        sessionStorage.setItem("auth_step", "info");
        toast.success("Successfully logged in!");
        // await refreshUser();
      } else if (!res.success) {
        toast.error(res.message || "OTP verification failed");
      } else {
        // Decode the access token
        const user = verifyToken(res.data.accessToken);

        // Set user and token in Redux store
        dispatch(
          setUser({
            user: user.user,
            token: res.data.accessToken,
          }),
        );

        toast.success("Successfully logged in!");
        // Clear session storage before navigation
        sessionStorage.removeItem("auth_step");
        sessionStorage.removeItem("auth_phone");
        sessionStorage.removeItem("auth_timer_end");

        // await refreshUser();
        router.push(redirect);
      }
    } catch (error: any) {
      toast.error(error.data.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUserRegistration = async (userData: {
    name: string;
    district: string;
  }) => {
    setLoading(true);
    try {
      await addUserInfo({ id: user!.userId, userInfo: userData });
      toast.success("Info updated successfully!");
      resetModal();

      router.push(redirect);
    } catch (error: any) {
      toast.error(error.message || "Failed to update info");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep("phone");
    setPhone("");
    setOtp("");
    setIsNewUser(false);
    phoneForm.reset();

    // Clear persisted state
    sessionStorage.removeItem("auth_step");
    sessionStorage.removeItem("auth_phone");
    sessionStorage.removeItem("auth_timer_end");
  };

  if (step === "info" && isNewUser) {
    return (
      <main className="max-w-sm border border-gray-300 rounded-lg p-6 shadow-md">
        <form
          onSubmit={form.handleSubmit(handleUserSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              className="border border-gray-300"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Select onValueChange={(value) => form.setValue("district", value)}>
              <SelectTrigger className="w-full border border-gray-300">
                <SelectValue placeholder="Select your district" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.district && (
              <p className="text-sm text-destructive">
                {form.formState.errors.district.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Complete Registration"}
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main>
      {step === "phone" ? (
        <div className="max-w-sm border border-gray-200 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-medium  mb-5">Login with Phone Number</h3>

          <form
            onSubmit={handleSubmit(handlePhoneSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="01XXXXXXXXX"
                {...register("phone")}
              />

              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* ✅ Terms & Conditions */}
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I accept the{" "}
                    <a
                      href="/terms-and-conditions"
                      className="text-blue-500 underline"
                    >
                      Terms and Conditions
                    </a>
                  </Label>
                </div>
              )}
            />
            {errors.terms && (
              <p className="text-sm text-destructive">{errors.terms.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="max-w-sm border border-gray-200 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-medium mb-5">Verify OTP</h3>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We have sent a verification code to {phone}
            </p>

            <div>
              {showOtp && (
                <p className="text-sm text-green-700 font-semibold text-center">
                  Use the OTP: {showOtp}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleVerifyOtp}
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              variant="outline"
              onClick={handleResendOtp}
              className="w-full"
              disabled={timer > 0}
            >
              {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : "Resend OTP"}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default SignInPage;
