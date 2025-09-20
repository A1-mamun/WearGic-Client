"use client";
import SignInPage from "@/components/modules/auth/SignInPage";
import { Suspense } from "react";
const SignIn = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-60px)]">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <SignInPage />
      </Suspense>
    </div>
  );
};

export default SignIn;
