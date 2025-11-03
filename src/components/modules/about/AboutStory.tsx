import { Card } from "@/components/ui/card";
import Image from "next/image";
import coverImage from "@/./../public/weargic-cover.jpg";
export function AboutStory() {
  return (
    <section className="container mx-auto px-2">
      <div className="">
        <div className="relative h-[400px] md:h-[500px]">
          <Card className="absolute inset-0 overflow-hidden bg-muted">
            <Image
              src={coverImage}
              alt="Weargic craftsmanship"
              className="w-full h-full object-cover"
              fill
              priority
            />
          </Card>
        </div>
        <div className="space-y-6 mt-10 md:mt-16 lg:mt-24">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-balance text-center">
            Our Story
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Welcome to Weargic — where style meets quality. We specialize in
              premium bags crafted for every occasion — from durable boys school
              bags to chic ladies handbags and classy school bags for women.
              Each piece is designed with care, precision, and a promise of
              long-lasting elegance.
            </p>
            <p>
              At Weargic, our customers come first. We believe everyone deserves
              top-quality bags without the high price tag. That&apos;s why we
              offer exceptional collections at prices that make sense. Carry
              confidence, comfort, and creativity — carry Weargic
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
