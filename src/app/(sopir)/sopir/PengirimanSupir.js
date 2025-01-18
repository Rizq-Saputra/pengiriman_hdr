"use client";

import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_PENGIRIMAN } from "@/constants/status";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

const getSupirData = async () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") {
    redirect("/login");
  }
  const decoded = jwtDecode(token);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const res = await fetch(`${BASE_URL}/api/supir/${decoded.supirId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

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
    window.location.reload();
  }

  const data = await res.json();
  return data.data.Pengiriman;
};

export default function PengirimanSupir() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const getData = async () => {
      try {
        const pengirimanData = await getSupirData();
        setData(pengirimanData);
        setFilteredData(pengirimanData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === "all") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.status_pengiriman === status));
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen">
        <Skeleton className="min-h-[400px] w-full mt-4" />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Filter dropdown */}
      <div className="flex justify-end mb-4">
        <Select onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Dalam Pengiriman">Dalam Pengiriman</SelectItem>
            <SelectItem value="Belum Dikirim">Belum Dikirim</SelectItem>
            <SelectItem value="Selesai">Selesai</SelectItem>
            <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data cards */}
      <div className="grid grid-cols-1 gap-2 mt-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <Card key={item.pengiriman_id}>
              <CardHeader>
                <CardTitle>
                  {Intl.DateTimeFormat("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(item.tanggal_pengiriman))}
                </CardTitle>
                <CardTitle>Status : <Badge
                  variant={
                    item.status_pengiriman === STATUS_PENGIRIMAN.BELUM_DIKIRIM
                      ? "destructive"
                      : item.status_pengiriman ===
                        STATUS_PENGIRIMAN.DALAM_PENGIRIMAN
                      ? "warning"
                      : item.status_pengiriman === STATUS_PENGIRIMAN.DIBATALKAN
                      ? "default"
                      : "success"
                  }
                >
                  {item.status_pengiriman}
                </Badge></CardTitle>
              </CardHeader>
              <CardContent>
                <p>Nama : {item.Pelanggan?.nama_pelanggan}</p>
                <p>Alamat : {item.alamat_tujuan}</p>
                
                {/* 2 button */}
                <div className="flex gap-x-2">
                  <Button variant="default" className="mt-2" asChild>
                    <Link href={`/pengiriman/${item.pengiriman_id}/sopir`}>
                      Detail
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Tidak ada data pengiriman.
          </p>
        )}
      </div>
    </div>
  );
}
