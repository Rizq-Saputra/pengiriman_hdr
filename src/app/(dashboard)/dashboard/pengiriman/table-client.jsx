"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import StatusCards from "./statusCard";

export default function TableClient() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);

  const fetchData = useCallback(
    async ({ pageIndex = 0, pageSize = 10, status = "" } = {}) => {
      setLoading(true);
      try {
        const statusQuery = status ? `&status_pengiriman=${status}` : "";
        const response = await fetchWithAuth(
          `/api/pengiriman?page=${pageIndex + 1}&limit=${pageSize}${statusQuery}`
        );
        setData(response.body.data || []);
        setPageCount(response.body.meta.totalPages);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Pengiriman</CardTitle>
        </CardHeader>
      </Card>

      <StatusCards />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onRefresh={fetchData}
        pageCount={pageCount}
      />
    </>
  );
}
