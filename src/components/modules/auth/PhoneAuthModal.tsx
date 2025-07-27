import React, { useState } from "react";
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

const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((phone) => {
      // Bangladesh phone number validation
      return /^(\+88)?01[3-9]\d{8}$/.test(phone.replace(/\s/g, ""));
    }, "Please enter a valid Bangladeshi phone number"),
});

interface PhoneAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PhoneAuthModal = ({ open, onOpenChange }: PhoneAuthModalProps) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "otp" | "register">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  //   const [isNewUser, setIsNewUser] = useState(false);
  //   const { signIn, verifyOtp } = useAuth();

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
  });

  const handlePhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
    // setLoading(true);
    // try {
    //   // Normalize phone number to Bangladesh format
    //   let normalizedPhone = data.phone.replace(/\s/g, '');
    //   if (!normalizedPhone.startsWith('+88')) {
    //     normalizedPhone = '+88' + normalizedPhone;
    //   }
    //   const { error } = await signIn(normalizedPhone);
    //   if (error) {
    //     toast.error(error.message);
    //     return;
    //   }
    //   setPhoneNumber(normalizedPhone);
    //   setStep('otp');
    //   toast.success('OTP sent to your phone number!');
    // } catch (error) {
    //   toast.error('An unexpected error occurred');
    // } finally {
    //   setLoading(false);
    // }
  };

  //   const handleVerifyOtp = async () => {
  //     setLoading(true);
  //     try {
  //       // Check if user exists
  //       const { data: profile } = await supabase
  //         .from('profiles')
  //         .select('*')
  //         .eq('phone', phoneNumber)
  //         .single();

  //       const { error } = await verifyOtp(phoneNumber, otp);
  //       if (error) {
  //         toast.error(error.message);
  //         return;
  //       }

  //       // If no profile exists, show registration form
  //       if (!profile) {
  //         setIsNewUser(true);
  //         setStep('register');
  //       } else {
  //         // Existing user, complete login
  //         toast.success('Successfully logged in!');
  //         resetModal();
  //         onOpenChange(false);
  //       }
  //     } catch (error) {
  //       toast.error('An unexpected error occurred');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const handleUserRegistration = async (userData: { full_name: string; district: string }) => {
  //     setLoading(true);
  //     try {
  //       // Get current user from auth
  //       const { data: { user } } = await supabase.auth.getUser();

  //       if (!user) {
  //         toast.error('User not authenticated');
  //         return;
  //       }

  //       // Create profile for the new user
  //       const { error } = await supabase
  //         .from('profiles')
  //         .insert({
  //           user_id: user.id,
  //           phone: phoneNumber,
  //           full_name: userData.full_name,
  //           district: userData.district,
  //           phone_verified: true,
  //         });

  //       if (error) {
  //         toast.error('Failed to create profile');
  //         return;
  //       }

  //       toast.success('Account created successfully!');
  //       resetModal();
  //       onOpenChange(false);
  //     } catch (error) {
  //       toast.error('An unexpected error occurred');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const resetModal = () => {
  //     setStep('phone');
  //     setPhoneNumber('');
  //     setOtp('');
  //     setIsNewUser(false);
  //     phoneForm.reset();
  //   };

  //   if (step === 'register') {
  //     return (
  //       <UserRegistrationForm
  //         open={open}
  //         phone={phoneNumber}
  //         onSubmit={handleUserRegistration}
  //         loading={loading}
  //       />
  //     );
  //   }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
                We have sent a verification code to {phoneNumber}
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
                // onClick={handleVerifyOtp}
                className="w-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button
                variant="outline"
                onClick={() => setStep("phone")}
                className="w-full"
              >
                Back to Phone Number
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhoneAuthModal;
