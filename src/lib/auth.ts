/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { supabase } from "@/integrations/supabase/client";

export const auth = {
  // Sign up with phone number
  signUp: async (phone: string, userData?: { full_name?: string }) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        data: userData,
      },
    });

    return { data, error };
  },

  // Verify OTP
  verifyOtp: async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (data.user && !error) {
      // Create or update profile
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: data.user.id,
        phone: phone,
        phone_verified: true,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }
    }

    return { data, error };
  },

  // Sign in with phone number
  signIn: async (phone: string) => {
    return await supabase.auth.signInWithOtp({
      phone,
    });
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  // Get current session
  getSession: () => {
    return supabase.auth.getSession();
  },

  // Get user role
  getUserRole: async () => {
    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("role")
      .single();

    return { data: userRoles };
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
