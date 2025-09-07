"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import ProductCard from "./ProductCard";
import { TProduct } from "@/types/product";
import { TCategory } from "@/types/category";

type filterOption = {
  value: string;
  label: string;
};

const AllProducts = ({
  products,
  categories,
  genderOptions,
  sortOptions,
}: {
  products: TProduct[];
  categories: TCategory[];
  genderOptions: filterOption[];
  sortOptions: filterOption[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesGender =
      selectedGender === "all" || product.gender === selectedGender;

    return matchesSearch && matchesCategory && matchesGender;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return b.isNew ? 1 : -1;
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedGender("all");
    setSortBy("featured");
  };

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedGender !== "all",
    searchTerm !== "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Header */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our complete collection of premium fashion accessories
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap gap-4 items-center">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedGender}
                  onValueChange={setSelectedGender}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
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
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="outline" className="gap-2">
                    Category:{" "}
                    {categories.find((c) => c.name === selectedCategory)?.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCategory("all")}
                    />
                  </Badge>
                )}
                {selectedGender !== "all" && (
                  <Badge variant="outline" className="gap-2">
                    Gender:{" "}
                    {
                      genderOptions.find((g) => g.value === selectedGender)
                        ?.label
                    }
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedGender("all")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <p className="text-muted-foreground">
                Showing {sortedProducts.length} of {products.length} products
              </p>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Load more button (for pagination simulation) */}
            {sortedProducts.length > 0 && sortedProducts.length >= 6 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AllProducts;
