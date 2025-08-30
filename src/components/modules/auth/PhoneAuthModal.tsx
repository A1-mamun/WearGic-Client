/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { addUserInfo, loginUser, resendOtp, verifyOtp } from "@/services/auth";
import UserRegistrationForm from "./UserRegistrationForm";
import { useUser } from "@/contexts/userContext";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((phone) => {
      return /^01[3-9]\d{8}$/.test(phone.replace(/\s/g, ""));
    }, "Please enter a valid phone number"),
});

interface PhoneAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PhoneAuthModal = ({ open, onOpenChange }: PhoneAuthModalProps) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "otp" | "info">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [timer, setTimer] = useState<number>(0);

  const { user, refreshUser } = useUser();

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
  });

  const handlePhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
    setLoading(true);
    try {
      const res = await loginUser({ phone: data.phone });
      if (res.success) {
        setPhone(data.phone);
        setStep("otp");
        setTimer(60); // start 120s countdown
        toast.success("OTP sent to your phone number!");
      } else if (!res.success) {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // start countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
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
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await resendOtp({ phone });
      if (res.success) {
        setPhone(phone);
        setTimer(60); // start 60s countdown
        toast.success(res.message || "OTP resent successfully!");
      } else if (!res.success) {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await verifyOtp({ phone, otp });

      console.log(res);

      refreshUser();

      // If no profile exists, show registration form
      if (res.success && res.data.isNewUser) {
        setIsNewUser(true);
        setStep("info");
        toast.success("Successfully logged in!");
      } else if (!res.success) {
        toast.error(res.message || "OTP verification failed");
      } else {
        // Existing user, complete login
        toast.success("Successfully logged in!");
        resetModal();
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
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
      await addUserInfo(userData, user!.userId);
      toast.success("Info updated successfully!");
      refreshUser();
      resetModal();
      onOpenChange(false);
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
  };

  if (step === "info" && isNewUser) {
    return (
      <UserRegistrationForm
        open={open}
        onSubmit={handleUserRegistration}
        loading={loading}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault(); // 🚫 prevent closing on outside click
        }}
      >
        {step === "phone" ? (
          <>
            <DialogHeader>
              <DialogTitle>Login with Phone Number</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="01XXXXXXXXX"
                  {...phoneForm.register("phone")}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your Bangladeshi phone number
                </p>
                {phoneForm.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Verify OTP</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We have sent a verification code to {phone}
              </p>

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
                {timer > 0
                  ? `Resend OTP in ${formatTime(timer)}`
                  : "Resend OTP"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhoneAuthModal;
