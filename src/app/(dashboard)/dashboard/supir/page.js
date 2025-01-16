'use client';

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DriverCard from "./DriverCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useEffect, useState } from "react";
import Loading from "./loading";


export default function SupirPage() {
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDrivers = async () => {
        setIsLoading(true);
        try {
            const response = await fetchWithAuth('/api/supir');
            setDrivers(response.body['data']);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    return (
        <div className="p-8 w-full">
            <Card>
                <div className="flex justify-between items-center p-4">
                    <CardTitle className="text-2xl">Sopir</CardTitle>
                    <Link href="/dashboard/supir/tambah" className="ml-auto">
                        <Button>Tambah Sopir</Button>
                    </Link>
                </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full my-4">
                {isLoading ? (
                    <Loading />
                ) : drivers.length > 0 ? (
                    drivers.map((driver) => (
                        <DriverCard
                            key={driver.supir_id}
                            driver={driver}
                            onDelete={() => fetchDrivers()}
                        />
                    ))
                ) : (
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Tidak ada supir</CardTitle>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}
