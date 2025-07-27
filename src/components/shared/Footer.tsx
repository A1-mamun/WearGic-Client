import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: "All Products", path: "/products" },
      { name: "Men's Collection", path: "/products?category=men" },
      { name: "Women's Collection", path: "/products?category=women" },
      { name: "Accessories", path: "/products?category=accessories" },
      { name: "Surprise Gifts", path: "/surprise-gift" },
    ],
    support: [
      { name: "Track Your Order", path: "/track-order" },
      { name: "FAQ", path: "/faq" },
      { name: "Contact Us", path: "/contact" },
      { name: "Size Guide", path: "/size-guide" },
      { name: "Returns", path: "/returns" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Careers", path: "/careers" },
      { name: "Press", path: "/press" },
    ],
  };

  const features = [
    { icon: Truck, text: "Free Shipping" },
    { icon: RotateCcw, text: "30-Day Returns" },
    { icon: Shield, text: "Secure Payment" },
    { icon: CreditCard, text: "Easy Checkout" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/weargic", label: "Facebook" },
    {
      icon: Instagram,
      href: "https://instagram.com/weargic",
      label: "Instagram",
    },
    { icon: Twitter, href: "https://twitter.com/weargic", label: "Twitter" },
  ];

  return (
    <footer className="bg-sidebar-foreground text-primary-foreground">
      {/* Features bar */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 justify-center md:justify-start"
              >
                <feature.icon className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">{feature.text}</span>
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
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">W</span>
              </div>
              <span className="text-2xl font-bold">WearGic</span>
            </div>

            <p className="text-primary-foreground/80 max-w-md">
              Elevating your style with premium fashion accessories. From luxury
              leather goods to contemporary footwear, we curate pieces that
              define modern elegance.
            </p>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="font-semibold">Stay Updated</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button variant="default" size="default">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Shop links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-primary-foreground/80 hover:text-accent transition-colors text-sm"
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
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-accent" />
              <span className="text-sm">support@weargic.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-accent" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent" />
              <span className="text-sm">New York, NY 10001</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2024 WearGic. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
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
