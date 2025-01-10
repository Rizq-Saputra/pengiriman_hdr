"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function TableClient() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const fetchData = useCallback(async (pageIndex = 0, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `/api/barang?page=${pageIndex?.pageIndex + 1}&limit=${pageSize}`
      );
      setData(response.body.data || []);
      setPageCount(response.body.meta.totalPages);
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
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      onRefresh={fetchData}
      pageCount={pageCount}
    />
  );
}
