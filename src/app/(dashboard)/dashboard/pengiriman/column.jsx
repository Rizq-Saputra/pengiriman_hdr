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
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { STATUS_PENGIRIMAN } from "@/constants/status";
import { useSwal } from "@/hooks/use-swal";

const ActionCell = ({ row, onRefresh }) => {
  const { showAlert } = useSwal();
  const data = row.original;

  const handleDelete = async (id) => {
    try {
      const response = await fetchWithAuth(`/api/pengiriman/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showAlert({
          title: "Sukses",
          text: "Pengiriman berhasil dihapus.",
          icon: "success",
        });
        onRefresh();
      } else {
        showAlert({
          title: "Gagal menghapus data",
          text: "Terjadi kesalahan saat menghapus data. Silahkan coba lagi.",
          icon: "error",
        });
      }
    } catch (error) {
      showAlert({
        title: "Gagal menghapus data",
        text: "Terjadi kesalahan saat menghapus data. Silahkan coba lagi.",
        icon: "error",
      });
      console.error("Error deleting data:", error);
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
        <Link href={`/dashboard/pengiriman/${data.pengiriman_id}/edit`}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => e.preventDefault()}
            >
              Hapus
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
                onClick={() => {
                  handleDelete(data.pengiriman_id);
                }}
              >
                Hapus Data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* show bukti pengiriman if exist */}
        {data.bukti_pengiriman && (
          <Link href={data.bukti_pengiriman} passHref>
            <DropdownMenuItem as="a" target="_blank">
              Bukti Pengiriman
            </DropdownMenuItem>
          </Link>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns = [
  {
    accessorKey: "resi",
    header: "No. Resi",
  },
  {
    accessorKey: "tanggal_pengiriman",
    header: "Tanggal",
    cell: ({ row }) => {
      const tanggal = row.getValue("tanggal_pengiriman");
      return (
        <span>
          {new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(tanggal))}
        </span>
      );
    },
  },
  {
    accessorKey: "Kendaraan.plat_nomor",
    header: "Plat Nomor",
    cell: ({ row }) => {
      const platNomor = row.original.Kendaraan?.plat_nomor;
      return <span className="whitespace-nowrap">{platNomor}</span>;
    },
  },
  {
    accessorKey: "Supir.nama_supir",
    header: "Supir",
  },
  {
    accessorKey: "alamat_tujuan",
    header: "Alamat",
  },
  {
    accessorKey: "Pelanggan.nama_pelanggan",
    header: "Pelanggan",
  },
  {
    accessorKey: "status_pengiriman",
    header: "Status",
    cell: ({ row }) => {
      const statusData = row.getValue("status_pengiriman");
      return (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
            statusData === STATUS_PENGIRIMAN.BELUM_DIKIRIM
              ? "bg-red-200 text-red-800"
              : statusData === STATUS_PENGIRIMAN.DALAM_PENGIRIMAN
              ? "bg-yellow-200 text-yellow-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {statusData}
        </span>
      );
    },
  },
  {
    accessorKey: "deskripsi",
    header: "Deskripsi",
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
