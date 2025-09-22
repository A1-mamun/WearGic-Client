import ContactForm from "@/components/modules/contact/ContactForm";
import { ContactInfo } from "@/components/modules/contact/ContactInfo";
import { Map } from "@/components/modules/contact/Map";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | WearGic",
  description: "Your one-stop shop for all things Wearable Technology.",
};

const Contact = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-card py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-montserrat font-black text-4xl md:text-5xl text-primary mb-4 text-balance">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>
      </section>
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <section className="py-16">
          <div className="">
            <div className="grid lg:grid-cols-2 gap-20">
              {/* Contact Form */}
              <div className="space-y-8">
                <h2 className="font-montserrat font-bold text-2xl text-foreground mb-6">
                  Send us a Message
                </h2>
                <ContactForm />
                {/* Map Section */}
                <div>
                  <h3 className="font-montserrat font-semibold text-xl text-foreground mb-4">
                    Find Us
                  </h3>
                  <Map />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-montserrat font-bold text-2xl text-foreground mb-6">
                    Contact Information
                  </h2>
                  <ContactInfo />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Contact;
