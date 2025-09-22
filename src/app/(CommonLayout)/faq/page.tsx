import FAQPage from "@/components/modules/faq/FAQPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | WearGic",
  description: "Your one-stop shop for all things Wearable Technology.",
};

export default function FAQ() {
  return (
    <main>
      <FAQPage />
    </main>
  );
}
