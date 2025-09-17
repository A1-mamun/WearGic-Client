"use client";

import { Shield, Calendar, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TableOfContents } from "@/components/modules/privacyPolicy/TableOfContents";
import { privacyPolicy } from "@/data";
import { PrivacyPolicyEnhanced } from "@/components/modules/privacyPolicy/PrivacyPolicyEnhanced";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {privacyPolicy.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6 text-pretty">
              We are committed to protecting your privacy and ensuring the
              security of your personal information. This policy explains how we
              collect, use, and safeguard your data.
            </p>

            {/* Last Updated Badge */}
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm text-card-foreground">
                Last updated: {privacyPolicy.lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TableOfContents sections={privacyPolicy.sections} />

              {/* Quick Info Card */}
              <Card className="mt-6 bg-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-accent mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Quick Summary
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We collect only necessary data, protect it with
                      industry-standard security, and give you full control over
                      your information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <PrivacyPolicyEnhanced privacyPolicy={privacyPolicy} />
          </div>
        </div>
      </div>
    </div>
  );
}
