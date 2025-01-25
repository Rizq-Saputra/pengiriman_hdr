"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
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
    () => (loading ? Array(10).fill({}) : data),
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
  const [categoryFilter, setCategoryFilter] = useState("all");
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
      kategori: categoryFilter === "all" ? "" : categoryFilter,
    });
  }, [pageIndex, pageSize, categoryFilter, onRefresh]);

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
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    onRefresh,
  });

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setPagination({ pageIndex: 0, pageSize });
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4 gap-2">
        <div className="flex gap-4 items-center">
          <div className="relative w-64">
            <Input
              placeholder="Cari data..."
              onChange={(e) => setGlobalFilter(String(e.target.value))}
              className="pl-10"
            />
            <Search
              className="absolute top-1/2 left-2 transform -translate-y-1/2"
              size={18}
            />
          </div>

          <Select onValueChange={handleCategoryChange} value={categoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Ulin">Ulin</SelectItem>
              <SelectItem value="Meranti">Meranti</SelectItem>
              <SelectItem value="Kapur">Kapur</SelectItem>
              <SelectItem value="Kruing">Kruing</SelectItem>
              <SelectItem value="Septic Tank">Septic Tank</SelectItem>
              <SelectItem value="Bahan Bangunan">Bahan Bangunan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Link href="/dashboard/barang/tambah">
          <Button variant="default">
            <CirclePlus></CirclePlus> Tambah Barang
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  Barang Tidak Ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
    </div>
  );
}
