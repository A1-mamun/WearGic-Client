import { Button } from "@/components/ui/button";
import { features, socialLinks } from "@/data";
import logo from "../../../public/Weargic_Logo_white.png";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary-foreground text-white">
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
                <span className="text-sm font-semibold">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-3 py-8 md:py-12 lg:py-14 flex flex-col gap-4 items-center justify-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium md:font-semibold">
          CONNECT WITH US
        </h2>
        <div className="border-t border-white w-[300px] md:w-[500px] lg:w-[700px] xl:w-[900px]"></div>
        <div className="flex gap-5 w-full justify-center ">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              className="flex items-center gap-2 text-sm font-semibold text-white hover:text-primary"
            >
              <Button
                variant="outline"
                size="icon"
                className="border-white text-white bg-transparent hover:bg-white hover:text-primary"
              >
                <link.icon className="h-5 w-10" />
              </Button>
            </a>
          ))}
        </div>
        <p>
          Call Now - <a href="tel:+8801345880782">+8801345880782</a>
        </p>
        <div className="flex gap-1">
          <MapPin className="inline-block mr-2" />
          <span>Rajshahi Bangladesh</span>
        </div>
        <Select>
          <SelectTrigger className="w-60 md:w-72 lg:w-96 ">
            <SelectValue className="text-white" placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bn">Bangla</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
        <Image
          src={logo}
          width={250}
          height={30}
          alt="Weargic Logo"
          className="w-48 md:w-56 lg:w-72"
        />
        <div className="text-white/80 flex flex-wrap items-center justify-center text-sm md:text-base">
          <Link
            href="/terms-and-conditions"
            className="mx-2 hover:text-primary"
          >
            Terms & Conditions
          </Link>
          <span className="text-primary">|</span>
          <Link href="/privacy-policy" className="mx-2 hover:text-primary">
            Privacy Policy
          </Link>
          <span className="text-primary">|</span>
          <Link
            href="/refund-and-return-policy"
            className="mx-2 hover:text-primary"
          >
            Refund Policy
          </Link>
        </div>
        <p className="text-sm md:text-base">
          &copy; 2024 Weargic. All rights reserved.
        </p>
        <p className="text-sm md:text-base">weargic.com</p>
      </div>
    </footer>
  );
};

export default Footer;
