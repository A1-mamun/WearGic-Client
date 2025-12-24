import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import { ReactNode } from "react";

const CommonLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
        <WhatsAppFloat />
      </main>
      <Footer />
    </>
  );
};

export default CommonLayout;
