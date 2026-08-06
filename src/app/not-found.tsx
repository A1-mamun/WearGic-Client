"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-7xl font-bold text-primary">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>

      <p className="mt-2 max-w-md text-muted-foreground">
        Sorry, the page you&rsquo;re looking for doesn&rsquo;t exist or has been
        moved.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>

          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
