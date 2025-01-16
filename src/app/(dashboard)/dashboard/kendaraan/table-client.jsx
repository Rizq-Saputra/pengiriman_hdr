'use client';

import { useEffect, useState, useCallback } from 'react';
import { DataTable } from "./data-table";
import { columns } from "./column";
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export default function TableClient() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth('/api/kendaraan');
            setData(response.body.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

   return (
       <>
         <Card>
           <CardHeader>
             <CardTitle className="text-2xl">Kendaraan</CardTitle>
           </CardHeader>
         </Card>
         <DataTable
           columns={columns}
           data={data}
           loading={loading}
           onRefresh={fetchData}
         />
       </>
     );
}