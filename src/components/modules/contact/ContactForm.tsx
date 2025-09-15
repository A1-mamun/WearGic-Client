/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendEmail } from "@/services/contact";

const contactFormSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^01[3-9]\d{8}$/, "Invalid phone number"),
  subject: z
    .string()
    .nonempty("Subject is required")
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .nonempty("Message is required")
    .min(5, "Message must be at least 5 characters")
    .max(500, "Message must be less than 500 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const handleEmailSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const res = await sendEmail(data);
      if (res.success) {
        toast.success("Email sent successfully!");

        resetForm();
      } else if (!res.success) {
        toast.error(res.message || "Failed to send email");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                className={`bg-background border-border focus:ring-ring ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={`bg-background border-border focus:ring-ring ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                className={`bg-background border-border focus:ring-ring ${
                  errors.phone ? "border-red-500" : ""
                }`}
                placeholder="01XXXXXXXXX"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-foreground font-medium">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                type="text"
                {...register("subject")}
                className={`bg-background border-border focus:ring-ring ${
                  errors.subject ? "border-red-500" : ""
                }`}
                placeholder="What's this about?"
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground font-medium">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              {...register("message")}
              className={`bg-background border-border focus:ring-ring min-h-32 ${
                errors.message ? "border-red-500" : ""
              }`}
              placeholder="Tell us more about your inquiry..."
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
