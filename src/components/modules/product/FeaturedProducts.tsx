import { useGetAllProductsQuery } from "@/redux/features/product/product";
import { TProduct } from "@/types/product";
import ProductSkeletonCard from "./ProductSkeletonCard";
import { ProductError } from "@/components/shared/ProductError";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  const {
    data: products,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllProductsQuery(undefined);

  const featuredProducts: TProduct[] = products?.data.slice(0, 8) || [];
  return (
    <section className="py-7 md:py-10 lg:py-14 xl-py-16 bg-background">
      <div className="container mx-auto px-3">
        <div className="text-center pb-6 md:pb-9 lg:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Featured Collection
          </h2>
          <p className="text-sm md:text-baselg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium accessories that define
            luxury and style
          </p>
        </div>

        {/* Products Grid */}
        {isLoading || isFetching ? (
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeletonCard key={index} />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
            <ProductError refetch={refetch} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-10 lg:mb-12">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/products">
            <Button variant="outline" size="lg" className="group h-8 md:h-10">
              See All Products
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
