"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeletonCard() {
  return (
    <Card className="group max-w-sm rounded-xl shadow-xl overflow-hidden pt-0 pb-2 md:pb-3">
      {/* Image placeholder */}
      <div className="relative overflow-hidden rounded-t-sm md:rounded-t-xl w-full h-32 md:h-60 bg-gray-300">
        <Skeleton className="h-full w-full" />
        <div className="absolute top-2 left-2 md:top-3 md:left-3 space-y-2">
          <Skeleton className="h-4 md:h-6 w-12 md:w-16 rounded-md" />
          <Skeleton className="h-4 md:h-6 w-9 md:w-12 rounded-md" />
        </div>
      </div>

      <CardHeader className="px-4 space-y-2 mt-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-40" />
      </CardHeader>

      <CardContent className="px-4 -mt-3 -mb-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 md:h-5 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>
      </CardContent>

      <CardFooter className="px-4 flex flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-3">
          <Skeleton className="h-6 md:h-8 w-full md:w-1/2 md:flex-1" />
          <Skeleton className="h-6 md:h-8 w-full md:w-1/2 md:flex-1" />
        </div>
        <Skeleton className="h-6 md:h-8 w-full" />
      </CardFooter>
    </Card>
  );
}
