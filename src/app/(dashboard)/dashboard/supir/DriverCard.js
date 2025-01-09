"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function DriverCard({ driver, onDelete }) {
  const { toast } = useToast();

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const imageUrl = driver.gambar_supir
    ? `${BASE_URL}${driver.gambar_supir}`
    : "https://placehold.co/150x150";

  const handleDelete = async (id) => {
    try {
      const response = await fetchWithAuth(`/api/supir/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Sukses",
          description: "Supir Berhasil Dihapus",
          variant: "success",
        });
        onDelete();
      } else {
        toast({
          title: "Error",
          description: response.body.message || "Failed to delete driver",
          variant: "destructive",
        });
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
    <Card key={driver.id} className="hover:bg-muted transition-colors">
      <CardHeader className="p-0">
        <div className="w-full h-56 overflow-hidden">
          {/* <Image error in next 15.1.0
                    src={`http://localhost:5000/uploads/1734152745431-175168925-chrome_hf4FrJ4iEW.png`}
                    alt={`${driver.nama_supir} photo`}
                    className="w-full h-full object-cover"
                    width={500}    // Increased size for better quality
                    height={500}   // Increased size for better quality
                    priority      // Optional: loads image immediately
                /> */}
          <img
            src={`${imageUrl}`}
            alt={`${driver.nama_supir} photo`}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col text-left">
            <CardTitle className="text-xl">{driver.nama_supir}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/dashboard/supir/${driver.supir_id}/edit`}>
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
