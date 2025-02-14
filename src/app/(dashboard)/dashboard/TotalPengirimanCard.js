"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// Simulate API call
const fetchTotalPengiriman = async () => {
  // Simulate network delay
  const response = await fetchWithAuth("/api/pengiriman/minggu-ini");
  const data = response.body.data;
  const total = data.reduce(
    (sum, item) => sum + item._count.tanggal_pengiriman,
    0
  );

  return total;
};

export default function TotalPengirimanCard() {
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchTotalPengiriman();
        setTotal(data);
      } catch (error) {
        console.error("Error fetching total:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-lg md:text-2xl">
            Total Pengiriman Minggu ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <Skeleton className="h-32 w-32" />
          </div>
          <Skeleton className="h-4 w-8 mx-auto mt-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="text-center max-w-xs md:max-w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-2xl">
          Total Pengiriman Minggu ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <Truck size={isMobile ? 32 : 64} />
        </div>
        <p className="font-bold text-xl">{total}</p>
      </CardContent>
    </Card>
  );
}
