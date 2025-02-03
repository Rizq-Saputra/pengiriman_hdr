"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { useSwal } from "@/hooks/use-swal";
import { MoreVertical } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function DriverCard({ driver, onDelete }) {
  const { showAlert } = useSwal();

  const handleDelete = async (id) => {
    try {
      const response = await fetchWithAuth(`/api/supir/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showAlert({
          title: "Sukses",
          text: "Supir Berhasil Dihapus",
          icon: "success",
          confirmButtonText: "OK",
        });
        onDelete();
      } else {
        showAlert({
          title: "Gagal Menghapus",
          text: "Data tidak dapat dihapus karena masih memiliki relasi dengan data lain",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      showAlert({
        title: "Gagal Menghapus data",
        text: "Gagal menghapus data karena masih memiliki relasi dengan data lain",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Card key={driver.id} className="hover:bg-muted transition-colors">
      <CardHeader className="p-0">
        <div className="w-full h-56 overflow-hidden">
          <img
            src="https://placehold.co/150x150"
            alt={`${driver.nama_supir} photo`}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col text-left">
            <CardTitle className="text-xl">{driver.nama_supir}</CardTitle>
            <CardDescription>Antaran = {driver.jumlah_antaran}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/dashboard/supir/${driver.supir_id}/edit`}>
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
                      onClick={() => handleDelete(driver.supir_id)}
                    >
                      Hapus Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}