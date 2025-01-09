import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function PelangganLayout({ children }) {
  return (

    <div className="min-h-screen flex flex-col">
      {children}
      <Footer>
          <Button variant="outline" className="mt-2">
            <Phone className="mr-2 h-4 w-4" />
            Hubungi Kami
          </Button>
        </Footer>
    </div>

  );
}
