"use client";

import { CarFront, Home, LogOut, PackagePlus, Truck, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SteeringWheel from "./icons/steering-wheel";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { isUrlMatch } from "@/lib/url";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// Menu items.
const items = [
  {
    title: "Beranda",
    url: "/dashboard",
    icon: Home,
    exact: true,
  },
  {
    title: "Pengiriman",
    url: "/dashboard/pengiriman",
    icon: Truck,
  },
  {
    title: "Supir",
    url: "/dashboard/supir",
    icon: SteeringWheel,
  },
  {
    title: "Pelanggan",
    url: "/dashboard/pelanggan",
    icon: User,
  },
  {
    title: "Kendaraan",
    url: "/dashboard/kendaraan",
    icon: CarFront,
  },
  {
    title: "Barang",
    url: "/dashboard/barang",
    icon: PackagePlus,
  },
];

async function handleLogout() {
  try {
    await fetchWithAuth('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('API Error:', error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    redirect("/login");
  }
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        {/* Main menu items */}
        <div className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel className="flex justify-between">
              Admin
              <SidebarTrigger className="md:hidden w-4" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isUrlMatch(pathname, item.url, item.exact)}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Logout button at bottom */}
        <div className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleLogout}>
                <button>
                  <LogOut />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
