"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, Database, Users, Mail, Phone } from "lucide-react";

interface PrivacyPolicyData {
  title: string;
  lastUpdated: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    icon?: string;
    subsections?: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  }>;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

interface PrivacyPolicyEnhancedProps {
  privacyPolicy: PrivacyPolicyData;
}

const iconMap = {
  shield: Shield,
  eye: Eye,
  database: Database,
  users: Users,
  mail: Mail,
  phone: Phone,
};

export function PrivacyPolicyEnhanced({
  privacyPolicy,
}: PrivacyPolicyEnhancedProps) {
  return (
    <div className="space-y-8">
      {privacyPolicy.sections.map((section, index) => {
        const IconComponent = section.icon
          ? iconMap[section.icon as keyof typeof iconMap]
          : null;

        return (
          <Card key={section.id} id={section.id} className="scroll-mt-20">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                {IconComponent && (
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      {section.title}
                    </h2>
                    <Badge variant="outline" className="text-xs">
                      Section {index + 1}
                    </Badge>
                  </div>
                  <div
                    className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              </div>

              {section.subsections && section.subsections.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-6">
                    {section.subsections.map((subsection) => (
                      <div
                        key={subsection.id}
                        id={subsection.id}
                        className="scroll-mt-20"
                      >
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          {subsection.title}
                        </h3>
                        <div
                          className="text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: subsection.content,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Contact Information */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Questions About This Policy?
            </h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a
                  href={`mailto:${privacyPolicy.contact.email}`}
                  className="text-primary hover:underline"
                >
                  {privacyPolicy.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href={`tel:${privacyPolicy.contact.phone}`}
                  className="text-primary hover:underline"
                >
                  {privacyPolicy.contact.phone}
                </a>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {privacyPolicy.contact.address}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
