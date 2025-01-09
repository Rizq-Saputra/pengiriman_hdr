import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DriverSidebar } from "./sidebar";

export default function DriverLayout({ children }) {
  return (
    <SidebarProvider>
      <DriverSidebar />
        <SidebarInset>
          <SidebarTrigger />
          {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
