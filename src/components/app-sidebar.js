"use client";

import { CarFront, Home, LogOut, PackagePlus, Truck, User } from "lucide-react";
import Image from "next/image";
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
    await fetchWithAuth("/api/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("API Error:", error);
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
        <div className="flex items-center space-x-3 cursor-pointer mt-4 p-4">
          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            <Image
              width={32}
              height={32}
              src="/logo.png"
              alt="Logo UD Haderah"
            />
          </div>
          <span className="text-xl font-bold">UD Haderah</span>
        </div>
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
                    <SidebarMenuButton
                      asChild
                      isActive={isUrlMatch(pathname, item.url, item.exact)}
                    >
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
                <button className="text-destructive font-bold p-4 mb-2 hover:text-destructive">
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
