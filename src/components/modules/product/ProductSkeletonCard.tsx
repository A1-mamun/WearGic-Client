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
    <Card className="group max-w-sm rounded-t-none shadow-xl overflow-hidden pt-0 pb-2 md:pb-3">
      {/* Image placeholder */}
      <div className="relative overflow-hidden rounded-t-none  w-full h-32 md:h-60 bg-gray-300">
        <Skeleton className="h-full w-full" />
        <div className="absolute top-0 left-0 space-y-2">
          <Skeleton className="h-4 md:h-6 w-12 md:w-16 rounded-none" />
          <Skeleton className="h-4 md:h-6 w-9 md:w-12 rounded-none" />
        </div>
      </div>

      <CardHeader className="px-2 md:px-3 lg:px-4 -mt-3">
        <Skeleton className="h-3 w-24" />
        {/* <Skeleton className="h-5 w-40" /> */}
      </CardHeader>

      <CardContent className="px-2 md:px-3 lg:px-4 -my-6 md:-my-4 flex justify-between items-end">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 md:h-5 w-6" />
          <Skeleton className="h-4 w-5" />
        </div>
        <div>
          <Skeleton className="h-5 w-5" />
        </div>
      </CardContent>

      <CardFooter className="px-4 flex flex-col gap-3">
        {/* <div className="flex w-full items-center justify-between gap-3">
          <Skeleton className="h-6 md:h-8 w-full md:w-1/2 md:flex-1" />
          <Skeleton className="h-6 md:h-8 w-full md:w-1/2 md:flex-1" />
        </div> */}
        <Skeleton className="h-6 md:h-8 w-full" />
      </CardFooter>
    </Card>
  );
}
