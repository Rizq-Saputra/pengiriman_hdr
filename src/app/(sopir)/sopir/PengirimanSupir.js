'use client';

import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_PENGIRIMAN } from "@/constants/status";


const getSupirData = async () => {
    const token = localStorage.getItem("token");
    if (!token || token == "undefined" || token == "null") {
        redirect("/login");
    }
    const decoded = jwtDecode(token);
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/supir/${decoded.supirId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
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
    return data.data.Pengiriman;
}

export default function PengirimanSupir() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await getSupirData();
                setData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (loading) {
        return (
            <div className="grid  min-h-screen">
                <Skeleton className="min-h-[400px] w-full mt-4" />

            </div>
        )
    }


    return (
        <div className="grid grid-cols-1 gap-4 mt-4">
            {data.length > 0 ? (
                data.map((item) => (
                    <Card key={item.pengiriman_id}>
                        <CardHeader>
                            <CardTitle>{item.Pelanggan?.nama_pelanggan}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge
                                variant={
                                    item.status_pengiriman === STATUS_PENGIRIMAN.BELUM_DIKIRIM
                                        ? "destructive"
                                        : item.status_pengiriman === STATUS_PENGIRIMAN.DALAM_PENGIRIMAN
                                            ? "warning"
                                            : item.status_pengiriman === STATUS_PENGIRIMAN.DIBATALKAN
                                                ? "default"
                                                : "success"
                                }
                            >
                                {item.status_pengiriman}
                            </Badge>
                            <p>
                                {Intl.DateTimeFormat("id-ID", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }).format(new Date(item.tanggal_pengiriman))}
                            </p>
                            <p>{item.alamat_tujuan}</p>
                            {/* 2 button */}
                            <div className="flex gap-x-2">
                                <Button variant="default" asChild>
                                    <Link href={`/pengiriman/${item.pengiriman_id}/sopir`}>
                                        Detail
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="text-center text-gray-500">Belum ada data pengiriman.</p>
            )}
        </div>
    )
}