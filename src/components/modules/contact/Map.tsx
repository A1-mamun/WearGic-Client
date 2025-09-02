import { Card, CardContent } from "@/components/ui/card";

export function Map() {
  return (
    <Card className="border-border overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full h-64 bg-muted">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1635959592621!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
            title="Company Location"
          />
        </div>
        <div className="p-4 bg-card">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Office Hours:</strong> Monday -
            Friday, 9:00 AM - 6:00 PM EST
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
