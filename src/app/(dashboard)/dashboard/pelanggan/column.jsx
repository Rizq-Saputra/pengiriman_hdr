"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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
import Swal from "sweetalert2"; // Import SweetAlert2
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const ActionCell = ({ row, onRefresh }) => {
  const data = row.original;

  const handleDelete = async (id) => {
    try {
      const response = await fetchWithAuth(`/api/pelanggan/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          title: "Sukses",
          text: "Pelanggan Berhasil Dihapus",
          icon: "success",
          confirmButtonText: "OK",
        });
        onRefresh();
      } else {
        Swal.fire({
          title: "Gagal menghapus data",
          text: "Pastikan data pelanggan tidak memiliki relasi dengan data lain",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "OK",
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
        <Link href={`/dashboard/pelanggan/${data.pelanggan_id}/edit`}>
          <DropdownMenuItem className="text-yellow-600 cursor-pointer">
            <Pencil /> Edit
          </DropdownMenuItem>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 /> Hapus
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Anda yakin menghapus data ini?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Data ini akan dihapus secara permanen. Anda tidak dapat
                mengembalikan data yang telah dihapus.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batalkan</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(data.pelanggan_id)}
              >
                Hapus Data
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
    accessorKey: "nama_pelanggan",
    header: "Nama",
  },
  {
    accessorKey: "no_telepon",
    header: "No. Telepon",
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
