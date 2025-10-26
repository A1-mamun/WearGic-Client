import { Card, CardContent } from "@/components/ui/card";
import { Package, Heart, Award, TrendingUp } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "At Weargic, our customers come first. Every decision we make is guided by your needs and satisfaction.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "We never compromise on quality. Each bag is crafted with precision and built to last for years.",
  },
  {
    icon: Package,
    title: "Thoughtful Design",
    description:
      "Every detail matters. Our bags combine functionality with elegant aesthetics for everyday use.",
  },
  {
    icon: TrendingUp,
    title: "Fair Pricing",
    description:
      "Exceptional quality shouldn't break the bank. We offer premium bags at prices that make sense.",
  },
];

export function AboutValues() {
  return (
    <section className="px-4 py-16 md:py-24 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-balance mb-4">
            What We Stand For
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {"Our values guide everything we do, from design to delivery"}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <Card key={value.title} className="border-border/50">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
