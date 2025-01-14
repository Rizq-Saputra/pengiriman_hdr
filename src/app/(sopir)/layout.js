import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SopirSidebar } from "./sidebar";

export default function SopirLayout({ children }) {
  return (
    <SidebarProvider>
      <SopirSidebar />
        <SidebarInset>
          <SidebarTrigger />
          {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
