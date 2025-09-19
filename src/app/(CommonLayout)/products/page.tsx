/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import AllProducts from "@/components/modules/product/AllProducts";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category";
import { useGetAllProductsQuery } from "@/redux/features/product/product";
import { useState } from "react";
import { genders, sortOptions } from "@/data";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { TCategory } from "@/types/category";
import { Skeleton } from "@/components/ui/skeleton";
import ProductSkeletonCard from "@/components/modules/product/ProductSkeletonCard";
import { ProductError } from "@/components/shared/ProductError";
const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedGender("");
    setSortOrder("asc");
  };

  const activeFiltersCount = [
    selectedCategory !== "",
    selectedGender !== "",
    searchTerm !== "",
  ].filter(Boolean).length;

  const {
    data: products,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useGetAllProductsQuery({
    gender: selectedGender,
    category: selectedCategory,
    searchTerm,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const { data: categories, isLoading: loadingCategories } =
    useGetAllCategoriesQuery(undefined);

  const loadMoreProducts = () => {
    setLimit((prevLimit) => prevLimit + 10);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-7 md:py-10 lg:py-14 xl-py-16 bg-gradient-subtle">
        <div className="container mx-auto px-3 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            All Products
          </h1>
          <p className="text-sm md:text-baselg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of premium fashion accessories
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-black/60 border-black/40"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-end w-full md:max-w-lg lg:w-2/3">
              <div className="flex gap-4 w-full">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="border-black/40 w-1/2 md:w-1/3 lg:w-40 flex-1">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {loadingCategories ? (
                      <SelectItem key="loading" value="loading">
                        Loading...
                      </SelectItem>
                    ) : (
                      categories?.data?.map((category: TCategory) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedGender}
                  onValueChange={setSelectedGender}
                >
                  <SelectTrigger className="border-black/40 w-1/2 md:w-1/3 lg:w-40 flex-1">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full md:w-1/3 lg:w-40 border-black/40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                </Button>
              )}
            </div>
          </div>

          {/* Active filters display */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="outline" className="gap-2">
                  Search: &quot;{searchTerm}&quot;
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 p-0 bg-primary hover:bg-primary/90 rounded-sm"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent parent badge click if any
                      setSearchTerm("");
                    }}
                  >
                    <X className="h-3 w-3 text-white" />
                  </Button>
                </Badge>
              )}
              {selectedCategory !== "" && (
                <Badge variant="outline" className="gap-2">
                  Category:{" "}
                  {
                    categories.data.find(
                      (category: TCategory) =>
                        category.name === selectedCategory
                    )?.name
                  }
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 p-0 bg-primary hover:bg-primary/90 rounded-sm"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent parent badge click if any
                      setSelectedCategory("");
                    }}
                  >
                    <X className="h-3 w-3 text-white" />
                  </Button>
                </Badge>
              )}
              {selectedGender !== "" && (
                <Badge variant="outline" className="gap-2">
                  Gender:{" "}
                  {genders.find((g) => g.value === selectedGender)?.label}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 p-0 bg-primary hover:bg-primary/90 rounded-sm"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent parent badge click if any
                      setSelectedGender("");
                    }}
                  >
                    <X className="h-3 w-3 text-white" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      {isLoading || isFetching ? (
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-6 w-48 bg-gray-300" />
          </div>
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
        <AllProducts
          products={products}
          clearFilters={clearFilters}
          loadMoreProducts={loadMoreProducts}
        />
      )}
    </main>
  );
};

export default Products;
