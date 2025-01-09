"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      redirect("/login/admin");
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger/>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
