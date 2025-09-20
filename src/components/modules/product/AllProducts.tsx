"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProductCard from "./ProductCard";
import { TProduct } from "@/types/product";

const AllProducts = ({
  products,
  clearFilters,
  loadMoreProducts,
}: {
  products: {
    data: TProduct[];
    meta: { total: number; page: number; limit: number };
  };
  clearFilters: () => void;
  loadMoreProducts: () => void;
}) => {
  return (
    <section className="py-6 md:py-9 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl text-center md:text-left">
            Showing{" "}
            {products.meta.limit <= products.meta.total
              ? products.meta.limit
              : products.meta.total}{" "}
            of {products.meta.total} products
          </p>
        </div>

        {products.data.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-10 lg:mb-12">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load more button (for pagination simulation) */}
        {products.data.length > 0 &&
          products.meta.total >= products.meta.limit && (
            <div className="text-center mt-12">
              <Button
                onClick={loadMoreProducts}
                variant="outline"
                size="lg"
                className="h-8 md:h-10"
              >
                Load More Products
              </Button>
            </div>
          )}
      </div>
    </section>
  );
};

export default AllProducts;
