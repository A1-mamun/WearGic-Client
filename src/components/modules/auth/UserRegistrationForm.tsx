/* eslint-disable no-unused-vars */
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cities } from "@/constants/cities";

const registrationSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  district: z.string().min(1, "Please select a district"),
});

interface UserRegistrationFormProps {
  open: boolean;
  onSubmit: (data: { name: string; district: string }) => Promise<void>;
  loading: boolean;
}

const UserRegistrationForm = ({
  open,
  onSubmit,
  loading,
}: UserRegistrationFormProps) => {
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
  });

  const handleSubmit = async (data: z.infer<typeof registrationSchema>) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
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
              <SelectTrigger>
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
      </DialogContent>
    </Dialog>
  );
};

export default UserRegistrationForm;
