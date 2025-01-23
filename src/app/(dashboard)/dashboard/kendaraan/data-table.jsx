"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTable({ columns, data, loading, onRefresh }) {
  const tableData = React.useMemo(
    () => (loading ? Array(30).fill({}) : data),
    [loading, data]
  ); 
  const tableColumns = React.useMemo(
    () =>
      loading
        ? columns.map((column) => ({
            ...column,
            cell: <Skeleton className="h-4 w-full" />,
          }))
        : columns,
    [loading, columns]
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, // Initial page size
  });

  const [globalFilter, setGlobalFilter] = useState([]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    // pageCount: Math.ceil(data.length / pagination.pageSize), // Optional: for server-side data
    state: {
      pagination,
      globalFilter,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    // debugTable: true,
    // Add onRefresh to table options
    onRefresh,
  });

  return (
    <div>
      <div className="flex items-center py-4 gap-2">
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
        <Link href="/dashboard/kendaraan/tambah" className="ml-auto">
          <Button variant="default"><CirclePlus></CirclePlus> Tambah Kendaraan</Button>
        </Link>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  Data Kendaraan tidak ditemukan.
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
