import React from "react";
import { Card, CardContent } from "../ui/card";
import { Package, Search } from "lucide-react";
import Link from "next/link";

const ProductNotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Content Card */}
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="pt-12 pb-12 text-center space-y-8">
            {/* Illustration Area */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-muted rounded-full opacity-20"></div>

                {/* Package Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package
                    className="w-16 h-16 text-muted-foreground/60"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Floating Search Icon */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground text-balance">
                Product Not Found
              </h1>
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-md mx-auto">
                  We couldn&apos;t find the product you&apos;re looking for.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="space-y-4 max-w-sm mx-auto">
              <div className="flex gap-3">
                <Button
                  onClick={onSearchProducts}
                  className="flex-1 gap-2 h-11"
                  size="lg"
                >
                  <Search className="w-4 h-4" />
                  Search Products
                </Button>

                <Button
                  onClick={onBrowseCategories}
                  variant="outline"
                  className="flex-1 gap-2 h-11 bg-transparent"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Browse All
                </Button>
              </div>

              <Link href="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full gap-2 h-11 text-muted-foreground hover:text-foreground"
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div> */}

            {/* Suggestions */}
            {/* <div className="pt-8 border-t border-border/50">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Popular Categories
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Electronics",
                    "Clothing",
                    "Home & Garden",
                    "Sports",
                    "Books",
                  ].map((category) => (
                    <Link
                      key={category}
                      href={`/category/${category
                        .toLowerCase()
                        .replace(" & ", "-")
                        .replace(" ", "-")}`}
                      className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Help Link */}
            <div className="pt-6">
              <p className="text-sm text-muted-foreground">
                Need help finding something?{" "}
                <Link
                  href="/contact"
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Contact our support team
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductNotFound;
