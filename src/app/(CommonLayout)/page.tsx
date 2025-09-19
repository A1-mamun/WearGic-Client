"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import Link from "next/link";
import ProductCard from "@/components/modules/product/ProductCard";
import { TProduct } from "@/types/product";
import { useGetAllProductsQuery } from "@/redux/features/product/product";
import ProductSkeletonCard from "@/components/modules/product/ProductSkeletonCard";
import { ProductError } from "@/components/shared/ProductError";

const HomePage = () => {
  const {
    data: products,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllProductsQuery(undefined);

  const featuredProducts: TProduct[] = products?.data.slice(0, 8);

  return (
    <main className="min-h-screen bg-background">
      {/* Featured Products Section */}
      <section className="py-7 md:py-10 lg:py-14 xl-py-16 bg-background">
        <div className="container mx-auto px-3">
          <div className="text-center pb-6 md:pb-9 lg:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Featured Collection
            </h2>
            <p className="text-sm md:text-baselg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium accessories that
              define luxury and style
            </p>
          </div>

          {/* Products Grid */}
          {isLoading || isFetching ? (
            <div className="container mx-auto px-4 py-8 md:py-12">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-8">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 mb-8 md:mb-10 lg:mb-12">
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

      {/* Stats Section */}
      {/* <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto shadow-glow">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

      {/* CTA Section */}
      <section className="py-10 md:py-16 lg:py-20 bg-primary text-black">
        <div className="container mx-auto px-3 text-center">
          <div className="max-w-xs md:max-w-2xl lg:max-w-3xl mx-auto space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Ready to Elevate Your Style?
            </h2>
            <p className="text-sm md:text-baselg:text-lg text-black/70 max-w-2xl mx-auto">
              Join thousands of fashion enthusiasts who trust WearGic for their
              premium accessories
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                className="bg-black/80 text-white font-medium hover:bg-black/60 h-8 md:h-10"
              >
                Start Shopping
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-black/80 font-medium border-black/80 hover:bg-black/80 hover:text-white h-8 md:h-10"
              >
                Explore Surprise Gifts
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
