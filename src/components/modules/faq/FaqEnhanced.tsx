"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQEnhancedProps {
  faqs: FAQ[];
  searchQuery?: string;
}

export function FAQEnhanced({ faqs, searchQuery = "" }: FAQEnhancedProps) {
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredFaqs.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No FAQs found matching &quot;{searchQuery}&quot;
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try searching with different keywords or browse all questions below.
        </p>
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-4"
      defaultValue="item-1"
    >
      {filteredFaqs.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index + 1}`}
          className="bg-card border border-border rounded-lg px-6 py-2 shadow-sm hover:shadow-md transition-shadow"
        >
          <AccordionTrigger className="text-left text-lg font-semibold text-card-foreground hover:text-primary hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-balance pt-2 pb-4">
            <p className="text-base text-card-foreground leading-relaxed">
              {item.answer}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
