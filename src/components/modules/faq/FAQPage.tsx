"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { faqs } from "@/data";
import { MessageCircle, HelpCircle, Mail, Phone } from "lucide-react";
import { SearchBar } from "@/components/modules/faq/SearchBar";
import { FAQEnhanced } from "@/components/modules/faq/FaqEnhanced";

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Orders & Shipping", icon: "📦", count: 4 },
    { name: "Returns & Refunds", icon: "↩️", count: 2 },
    { name: "Account & Payment", icon: "💳", count: 3 },
    { name: "Support", icon: "🎧", count: 1 },
  ];
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Find answers to common questions about our products, services, and
              policies. Can&apos;t find what you&apos;re looking for? We&apos;re
              here to help.
            </p>
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search for answers..."
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium text-card-foreground">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Contact Support Card */}
              <Card className="mt-8 bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">
                      Still need help?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our support team is ready to assist you with any
                      questions.
                    </p>
                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        size="sm"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Us
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - FAQs */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-foreground ">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "All Questions"}
              </h2>
            </div>

            <FAQEnhanced faqs={faqs} searchQuery={searchQuery} />

            {/* Bottom CTA */}
            <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Didn&apos;t find what you were looking for?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Submit your question and we&apos;ll get back to you within 24
                  hours.
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Submit a Question
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
