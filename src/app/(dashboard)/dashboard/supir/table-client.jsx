"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function TableClient({ promise }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("/api/supir");
      setData(response.body.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
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
          <CardTitle className="text-2xl">Sopir</CardTitle>
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
