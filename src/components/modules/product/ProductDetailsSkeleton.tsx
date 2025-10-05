import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailsSkeleton = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
      {/* Product Images Skeleton */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
          <Skeleton className="w-full h-full bg-gray-300" />
        </div>

        {/* Color Selection Thumbnails */}
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-20 h-20 rounded-lg bg-gray-300"
            />
          ))}
        </div>
      </div>

      {/* Product Information Skeleton */}
      <div className="space-y-6">
        <Card className="p-6 bg-card">
          <div className="space-y-4">
            {/* Category Badge */}
            <Skeleton className="h-6 w-20 rounded-full" />

            {/* Product Name */}
            <Skeleton className="h-10 w-3/4" />

            {/* Gender Fashion */}
            <Skeleton className="h-6 w-32" />

            {/* Badges */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          {/* Pricing Skeleton */}
          <div className="space-y-2 mt-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>

          {/* Color Selection Skeleton */}
          <div className="space-y-3 mt-6">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>

          {/* Quantity Selector Skeleton */}
          <div className="space-y-3 mt-6">
            <Skeleton className="h-5 w-16" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="space-y-3 mt-6">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </Card>

        {/* Product Details Skeleton */}
        <Card className="p-6 bg-card">
          <div className="space-y-4">
            {/* Title */}
            <Skeleton className="h-6 w-32" />

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Specifications Title */}
            <Skeleton className="h-5 w-28 mt-6" />

            {/* Specifications Table */}
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-border"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
