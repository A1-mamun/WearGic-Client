"use client";

import { floatWhatsAppData } from "@/data";
import { MessageCircleQuestionMark } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function WhatsAppFloat() {
  const { phoneNumber, message } = floatWhatsAppData;

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleWhatsAppClick}
            className="fixed bottom-6 right-6 p-1 md:p-2 lg:p-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors duration-200 z-50"
            aria-label="Chat with us on WhatsApp"
            title="Chat with us on WhatsApp"
          >
            <MessageCircleQuestionMark size={30} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm text-white">Chat with us on WhatsApp</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
