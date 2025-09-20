"use client";

import Banner from "@/components/modules/home/Banner";
import BoysSection from "@/components/modules/product/BoysSection";
import LadiesSection from "@/components/modules/product/LadiesSection";
// import FeaturedProducts from "@/components/modules/product/FeaturedProducts";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Banner />
      {/* Boys aection */}
      <BoysSection />
      <LadiesSection />
      {/* Featured Products Section */}
      {/* <FeaturedProducts /> */}

      {/* CTA Section */}
      {/* <section className="py-10 md:py-16 lg:py-20 bg-primary text-black">
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
      </section> */}
    </main>
  );
};

export default HomePage;
