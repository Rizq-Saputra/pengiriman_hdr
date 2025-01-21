"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CirclePlus,Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DataTable({ columns, data, loading, onRefresh, pageCount }) {
  const tableData = React.useMemo(
    () => (loading ? Array(5).fill({}) : data),
    [loading, data]
  );

  const tableColumns = React.useMemo(
    () =>
      loading
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-4 w-full" />,
          }))
        : columns,
    [loading, columns]
  );

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  useEffect(() => {
    onRefresh({ 
      pageIndex, 
      pageSize, 
      status: statusFilter === "all" ? "" : statusFilter 
    });
  }, [pageIndex, pageSize, statusFilter, onRefresh]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    pageCount: pageCount,
    state: {
      pagination,
      globalFilter,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    onRefresh,
  });

  const downloadExcel = async () => {
    try {
      const url =
        process.env.NEXT_PUBLIC_BACKEND_API_URL + "/api/pengiriman/export";
      const a = document.createElement("a");
      a.href = url;
      a.download = "pengiriman.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Failed to download the file. Please try again.");
    }
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination({ pageIndex: 0, pageSize });
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-4 items-center">
          <div className="relative w-64">
            <Input
              placeholder="Cari data..."
              onChange={(e) => table.setGlobalFilter(String(e.target.value))}
              className="pl-10"
            />
            <Search
              className="absolute top-1/2 left-2 transform -translate-y-1/2"
              size={18}
            />
          </div>

          <Select onValueChange={handleStatusChange} value={statusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Dalam Pengiriman">Dalam Pengiriman</SelectItem>
              <SelectItem value="Belum Dikirim">Belum Dikirim</SelectItem>
              <SelectItem value="Selesai">Selesai</SelectItem>
              <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-x-2 flex items-center flex-col sm:flex-row">
          <Button variant="success" onClick={downloadExcel}>
          <Download /> Unduh Pengiriman
          </Button>
          <Link href="/dashboard/pengiriman/tambah">
            <Button variant="default"><CirclePlus></CirclePlus> Tambah Pengiriman</Button>
          </Link>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="border-r last:border-r-0 bg-gray-100 font-bold text-center h-12">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-r last:border-r-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Data yang anda cari tidak ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {pageCount}
            </strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}