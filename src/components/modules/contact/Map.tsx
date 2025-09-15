import { Card, CardContent } from "@/components/ui/card";

export function Map() {
  return (
    <Card className="border-border overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full h-64 bg-muted">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.264073888197!2d88.56496057529269!3d24.37966437826416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbefa96a38d031%3A0x10f93a950ed6f410!2sRajshahi!5e0!3m2!1sen!2sbd!4v1694372642621!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
            title="Rajshahi Location"
          />
        </div>
        <div className="p-4 bg-card">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Office Hours:</strong> Sunday -
            Thursday, 9:00 AM - 6:00 PM BDT
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
