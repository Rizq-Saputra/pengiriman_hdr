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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { isUrlMatch } from "@/lib/url";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// get supir data from jwt token

export const getSupirData = async () => {
  const token = localStorage.getItem("token");
  if (!token || token == "undefined" || token == "null") {
    redirect("/login");
  }
  const decoded = jwtDecode(token);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/supir/${decoded.supirId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // if res is 401, try to use refresh token
  if (res.status === 401) {
    const refreshTokenLocal = localStorage.getItem("refreshToken");
    const res = await fetch(`${BASE_URL}/api/supir/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshTokenLocal }),
    });
    const { token, refreshToken } = await res.json();
    localStorage.setItem("token", token);
    // refresh
    window.location.reload();
  }
  const data = await res.json();

  //   return res.json();
  return data.data;
};

// Menu items.
const items = [
  {
    title: "Beranda",
    url: "/sopir",
    icon: Home,
    exact: true,
  },
];

function handleLogout() {
  localStorage.removeItem("token");

  redirect("/login");
}

export function SopirSidebar() {
  const pathname = usePathname();

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getSupirData();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

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
            <SidebarGroupLabel>
              Selamat datang, {data.nama_supir}!
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
                <button className="text-destructive font-bold p-4 mb-2 hover:text-destructive transition-colors duration-500 ease-in-out ">
                  <LogOut />
                  <span>Keluar</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
