"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Button } from "@/components/ui/button";

// Function to fetch total deliveries
const fetchTotalPengiriman = async (weekOffset = 0) => {
  const response = await fetchWithAuth(
    `/api/pengiriman/minggu-ini?weekOffset=${weekOffset}`
  );
  const data = response.body.data;
  const total = data.reduce(
    (sum, item) => sum + item._count.tanggal_pengiriman,
    0
  );
  return total;
};

// Function to fetch chart data
const fetchChartData = async (weekOffset = 0) => {
  try {
    const response = await fetchWithAuth(
      `/api/pengiriman/minggu-ini?weekOffset=${weekOffset}`
    );
    const weekDays = getWeekDates(weekOffset);

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

// Function to get dates in a week
const getWeekDates = (weekOffset = 0) => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(
    today.getDate() -
      today.getDay() +
      (today.getDay() === 0 ? -6 : 1) -
      weekOffset * 7
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
    });
  }
  return week;
};

// Function to get month name in Indonesian
const getMonthName = (date) => {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return months[date.getMonth()];
};

export default function Dashboard() {
  const [total, setTotal] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const isMobile = useIsMobile();

  // Fetch total deliveries and chart data
  useEffect(() => {
    const getData = async () => {
      try {
        const [totalData, chartData] = await Promise.all([
          fetchTotalPengiriman(weekOffset),
          fetchChartData(weekOffset),
        ]);
        setTotal(totalData);
        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [weekOffset]);

  // Handler for "Previous Week" button
  const handlePreviousWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  // Handler for "Next Week" button
  const handleNextWeek = () => {
    setWeekOffset((prev) => Math.max(0, prev - 1));
  };

  const currentMonth = getMonthName(new Date(new Date().setDate(new Date().getDate() - weekOffset * 7)));

  if (loading) {
    return (
      <div className="p-8 w-full">
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
        <Skeleton className="min-h-[400px] w-full mt-4" />
      </div>
    );
  }

  return (
    <div className="p-8 w-full">

      {/* Card Total Pengiriman */}
      <Card className="text-center max-w-xs md:max-w-full mb-8">
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

      {/* Chart Component */}
      <div>
        <div className="flex justify-between mt-4 gap-2">
          <Button onClick={handlePreviousWeek}>Sebelumnya</Button>
          <Button onClick={handleNextWeek} disabled={weekOffset === 0}>
            Selanjutnya
          </Button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">{currentMonth}</h2>
        <div className="w-full flex justify-center mt-4">
          <div className="w-full max-w-3xl">
            <BarChart
              data={chartData}
              width={isMobile ? 300 : 800}
              height={400}
              margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dayName"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
                tickFormatter={(value, index) =>
                  `${value}\n${chartData[index]?.tanggal || ""}`
                }
              />
              <YAxis hide />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="data"
                name="Jumlah Pengiriman"
                fill="#2C3192"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="data"
                  position="top"
                  fill="#000"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}