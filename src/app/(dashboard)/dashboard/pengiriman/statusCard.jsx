"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, Truck } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const StatusCards = () => {
  const [statusCounts, setStatusCounts] = useState({
    "Belum Dikirim": 0,
    Selesai: 0,
    "Dalam Pengiriman": 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const response = await fetchWithAuth("/api/pengiriman/stats");
        const data = response.body.data;
        const newCounts = {
          "Belum Dikirim": 0,
          Selesai: 0,
          "Dalam Pengiriman": 0,
        };

        data.forEach((stat) => {
          newCounts[stat.status_pengiriman] = stat._count.status_pengiriman;
        });

        setStatusCounts(newCounts);
      } catch (error) {
        console.error("Error fetching status counts:", error);
      }
    };

    fetchStatusCounts();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3 mt-5">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Belum Dikirim</CardTitle>
          <Clock className="w-4 h-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statusCounts["Belum Dikirim"]}
          </div>
          <p className="text-xs text-muted-foreground">Menunggu pengiriman</p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Dalam Pengiriman
          </CardTitle>
          <Truck className="w-4 h-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statusCounts["Dalam Pengiriman"]}
          </div>
          <p className="text-xs text-muted-foreground">
            Sedang dalam perjalanan
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Selesai Dikirim</CardTitle>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statusCounts["Selesai"]}</div>
          <p className="text-xs text-muted-foreground">Pengiriman selesai</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusCards;
