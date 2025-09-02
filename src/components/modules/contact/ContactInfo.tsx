import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Facebook } from "lucide-react";

export function ContactInfo() {
  const contactDetails = [
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      description: "Mon-Fri 9AM-6PM EST",
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@company.com",
      href: "mailto:hello@company.com",
      description: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "123 Business Ave, Suite 100",
      href: "https://maps.google.com/?q=123+Business+Ave+Suite+100",
      description: "New York, NY 10001",
    },
    {
      icon: Facebook,
      label: "Facebook",
      value: "@YourCompany",
      href: "https://facebook.com/yourcompany",
      description: "Follow us for updates",
    },
  ];

  return (
    <div className="space-y-4">
      {contactDetails.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className="border-border hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-montserrat font-semibold text-foreground mb-1">
                    {item.label}
                  </h4>
                  <a
                    href={item.href}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {item.value}
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
