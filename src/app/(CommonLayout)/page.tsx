"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Zap, Users } from "lucide-react";

import Link from "next/link";
import ProductCard from "@/components/modules/product/ProductCard";
import { TProduct } from "@/types/product";
import { useGetAllProductsQuery } from "@/redux/features/product/product";

const HomePage = () => {
  const stats = [
    { icon: Users, value: "10K+", label: "Happy Customers" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Zap, value: "99%", label: "Customer Satisfaction" },
  ];
  const {
    data: products,
    isError,
    isLoading,
  } = useGetAllProductsQuery(undefined);

  const featuredProducts: TProduct[] = products?.data.slice(0, 8);

  if (isLoading) {
    return <div>Loading........</div>;
  }

  if (isError) {
    return <div>Error loading products.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Featured Products Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Collection
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our handpicked selection of premium accessories that
                define luxury and style
              </p>
            </div>
            {/* 
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : ( */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* )} */}

            <div className="text-center">
              <Link href="/products">
                <Button variant="outline" size="lg" className="group">
                  See All Products
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-subtle">
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
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Elevate Your Style?
              </h2>
              <p className="text-lg text-primary-foreground/80">
                Join thousands of fashion enthusiasts who trust WearGic for
                their premium accessories
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="default" size="lg">
                  Start Shopping
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Explore Surprise Gifts
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
