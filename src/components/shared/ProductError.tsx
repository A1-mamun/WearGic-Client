"use client";

import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// interface ProductErrorStateProps {
//   onRetry?: () => void;
//   onBrowseProducts?: () => void;
//   onGoHome?: () => void;
// }

// {
//   onRetry,
//   onBrowseProducts,
//   onGoHome,
// }: ProductErrorStateProps
export function ProductError({ refetch }: { refetch: () => void }) {
  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardContent className="pt-8 pb-8">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="">
            <div className=" w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive-foreground" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-3">
          <h2 className="text-2xl font-bold text-foreground text-balance">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground text-pretty leading-relaxed">
            We couldn&apos;t load the products you were looking for. This could
            be due to a network issue or a temporary glitch.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={refetch} className="w-full gap-2" size="lg">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>

          {/* <div className="flex gap-2">
              <Button
                variant="outline"
                // onClick={onBrowseProducts}
                className="flex-1 gap-2 bg-transparent"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Products
              </Button>

              <Button
                variant="outline"
                // onClick={onGoHome}
                className="flex-1 gap-2 bg-transparent"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div> */}
        </div>

        {/* Support Link */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Still having trouble?{" "}
            <Link
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
