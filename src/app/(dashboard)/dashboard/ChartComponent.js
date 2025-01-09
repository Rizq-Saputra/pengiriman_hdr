"use client";

import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, LabelList, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const getWeekDates = () => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(
    today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
  );

  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push({
      dayName: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][
        day.getDay()
      ],
      date: day.toISOString().split("T")[0],
      tanggal: day.getDate(),
      data: 0,
    });
  }
  return week;
};
const fetchChartData = async () => {
  try {
    const response = await fetchWithAuth("/api/pengiriman/minggu-ini");
    const weekDays = getWeekDates();

    response.body.data.forEach((item) => {
      const date = new Date(item.tanggal_pengiriman)
        .toISOString()
        .split("T")[0];
      const dayIndex = weekDays.findIndex((day) => day.date === date);
      if (dayIndex !== -1) {
        weekDays[dayIndex].data = item._count.tanggal_pengiriman;
      }
    });

    return weekDays;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const chartConfig = {
  jumlahPengiriman: {
    label: "Jumlah Pengiriman",
    color: "#60a5fa",
  },
};

export default function ChartComponent() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchChartData();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <Skeleton className="min-h-[400px] w-full mt-4" />;
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[400px] w-full max-w-xs md:max-w-full"
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        width={isMobile ? 100 : 600}
        height={isMobile ? 100 : 400}
        margin={
          isMobile
            ? { top: 20, right: 20, bottom: 20, left: 20 }
            : { top: 20, right: 30, bottom: 20, left: 30 }
        }
      >
        <XAxis
          dataKey="dayName"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          angle={isMobile ? -45 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          height={isMobile ? 60 : 30}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="data" fill="var(--color-jumlahPengiriman)" radius={4}>
          <LabelList
            position="bottom"
            dataKey={"tanggal"}
            offset={6}
            className="fill-foreground"
            fontSize={isMobile ? 10 : 12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
