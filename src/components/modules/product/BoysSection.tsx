import { useGetAllProductsQuery } from "@/redux/features/product/product";
import ProductSkeletonCard from "./ProductSkeletonCard";
import { ProductError } from "@/components/shared/ProductError";
import ProductCard from "./ProductCard";
import { TProduct } from "@/types/product";

const BoysSection = () => {
  const {
    data: products,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useGetAllProductsQuery({
    category: "Boys Bag",
  });
  return (
    <div className="py-8 md:py-12 lg:py-16 container mx-auto px-3">
      <div className=" text-center flex items-center justify-center gap-5 w-full pb-8 md:pb-12 lg:pb-16">
        <div className="border-t border-black flex-1"></div>
        <p className="text-2xl md:text-3xl lg:text-4xl font-medium md:font-semibold">
          BOYS BAG
        </p>
        <div className="border-t border-black flex-1"></div>
      </div>

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
          {products?.data?.map((product: TProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoysSection;
