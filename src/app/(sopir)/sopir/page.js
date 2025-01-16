"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PengirimanSupir from "./PengirimanSupir";
import { Truck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { getSupirData } from "../sidebar";

export default function Sopir() {
  const isMobile = useIsMobile();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supirData = await getSupirData();
        setData(supirData);
      } catch (err) {
        console.error("Gagal memuat data supir:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 w-full">
      <Card className="text-center max-w-xs md:max-w-full mb-4">
        <CardHeader>
          <CardTitle className="text-lg md:text-2xl">
            Total Pengiriman Anda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2">
            <Truck size={isMobile ? 64 : 128} />
          </div>
          {isLoading ? (
            <p className="text-gray-500">Memuat data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="font-bold text-xl">{data.jumlah_antaran}</p>
          )}
        </CardContent>
      </Card>
      <PengirimanSupir />
    </div>
  );
}
