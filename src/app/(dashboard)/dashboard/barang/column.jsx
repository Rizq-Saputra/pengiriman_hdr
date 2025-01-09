"use client";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const ActionCell = ({ row, onRefresh }) => {
  const { toast } = useToast();
  const data = row.original;

  const handleDelete = async (id) => {
    try {
      const response = await fetchWithAuth(`/api/barang/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Barang has been deleted successfully",
          variant: "success",
        });
        onRefresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred " + error,
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/dashboard/barang/${data.barang_id}/edit`}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => e.preventDefault()}
            >
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                barang data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(data.barang_id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns = [
  {
    accessorKey: "nama_barang",
    header: "Nama Barang",
  },
  {
    accessorKey: "kategori",
    header: "Kategori",
  },
  {
    accessorKey: "berat",
    header: "Berat",
    cell: ({ row }) => {
      return `${row.getValue("berat")} kg`;
    },
  },
  {
    accessorKey: "harga",
    header: "Harga",
    cell: ({ row }) => {
      return Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(row.getValue("harga"));
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      return (
        <ActionCell
          row={row}
          table={table}
          onRefresh={table.options.onRefresh}
        />
      );
    },
  },
];
