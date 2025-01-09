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
import { Badge } from "@/components/ui/badge";
import { fetchWithAuth } from "@/lib/fetchWithAuth";


const ActionCell = ({ row, onRefresh }) => {
  const { toast } = useToast();
  const data = row.original;

  const handleDelete = async (id) => {
    try {
      const response = await fetchWithAuth(`/api/kendaraan/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Kendaraan has been deleted successfully",
          variant: "success",
        });
        onRefresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
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
        <Link href={`/dashboard/kendaraan/${data.kendaraan_id}/edit`}>
          <DropdownMenuItem>
            Edit
          </DropdownMenuItem>
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
                kendaraan data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(data.kendaraan_id)}
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
    accessorKey: "plat_nomor",
    header: "Plat Nomor",
  },
  {
    accessorKey: "jenis_kendaraan",
    header: "Merk",
  },
  {
    accessorKey: "kapasitas",
    header: "Kapasitas",
    cell: ({ row }) => {
      const kapasitas = row.getValue("kapasitas");
      return `${kapasitas.toLocaleString('id-ID')} Kg`;
    }
  },
  {
    accessorKey: "status_kendaraan",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status_kendaraan");
      
      const variants = {
        "tersedia": "success",        // green
        "sedang mengirim": "warning", // yellow
        "dalam perbaikan": "destructive" // red
      };

      return (
        <Badge variant={variants[status] || "default"}>
          {status.toLocaleUpperCase()}
        </Badge>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      return <ActionCell row={row} table={table} onRefresh={table.options.onRefresh} />;
    },
  },
];