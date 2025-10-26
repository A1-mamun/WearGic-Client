import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function AboutCTA() {
  return (
    <section className="px-4 py-16 md:py-24 bg-stone-800 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-light tracking-tight text-balance mb-6">
          Carry confidence, comfort, and creativity
        </h2>
        <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-2xl mx-auto">
          {
            "Experience the Weargic difference. Discover our exceptional collections and find the perfect bag for your journey."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" passHref>
            <Button size="lg" variant="secondary" className="group">
              Shop Our Collections
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-primary-foreground hover:text-primary"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
