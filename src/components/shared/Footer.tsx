import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { contactInfos, features, footerLinks, socialLinks } from "@/data";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-primary-foreground">
      {/* Features bar */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 justify-center gap-4 ">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 justify-center md:justify-start"
              >
                <feature.icon className="h-5 w-5 text-primary" />
                <span className="text-sm text-white/60 font-semibold">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">W</span>
              </div>
              <span className="text-2xl text-white/60 font-bold">WearGic</span>
            </div>

            <p className="text-white/60 max-w-md">
              Elevating your style with premium fashion accessories. From luxury
              leather goods to contemporary footwear, we curate pieces that
              define modern elegance.
            </p>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white/60">Stay Updated</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/10 border-primary-foreground/20 text-white/60 placeholder:text-white/60"
                />
                <Button
                  variant="default"
                  size="default"
                  className="text-black/80 font-medium"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Shop links */}
          <div className="space-y-4 ">
            <h4 className="font-semibold text-white/60 text-lg">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-white/60 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white/60 text-lg">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-white/60 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white/60 text-lg">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-white/60 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfos.map((info, index) => (
              <div key={index} className="flex items-center gap-3">
                <info.icon className="h-5 w-5 text-primary" />
                <span className="text-sm text-white/60 font-medium">
                  {info.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60">
              © 2024 WearGic. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
