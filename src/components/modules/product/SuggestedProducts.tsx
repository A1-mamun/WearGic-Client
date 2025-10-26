import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useGetAllProductsQuery } from "@/redux/features/product/product";
import { TProduct } from "@/types/product";
import ProductSkeletonCard from "./ProductSkeletonCard";
import { ProductError } from "@/components/shared/ProductError";
import Link from "next/link";

const SuggestedProducts = ({ product }: { product: TProduct }) => {
  const {
    data: products,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllProductsQuery({
    category: product.category,
  });

  const suggestedProducts = products?.data?.filter(
    (p: TProduct) => p.id !== product.id
  );

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance text-center">
            You Might Also Like
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl text-center mx-auto">
            Discover our curated selection of complementary products that pair
            perfectly with your choice
          </p>
        </div>

        {suggestedProducts?.length === 0 && (
          <p className="text-center text-red-500 mb-8">
            No suggested products available.
          </p>
        )}

        {/* Products Grid */}
        {isLoading || isFetching ? (
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {suggestedProducts?.data?.map((product: TProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Link href="/" passHref>
            <Button size="lg" className="gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuggestedProducts;
