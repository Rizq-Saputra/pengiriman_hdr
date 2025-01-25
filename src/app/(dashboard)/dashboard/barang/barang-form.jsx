"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSwal } from "@/hooks/use-swal";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Skema validasi menggunakan Zod
const barangSchema = z.object({
  nama_barang: z
    .string()
    .nonempty("Nama barang harus diisi.")
    .max(255, "Nama barang tidak boleh lebih dari 255 karakter."),
  kategori: z.string().nonempty("Kategori harus dipilih."),
  harga: z
    .number({
      invalid_type_error: "Harga harus berupa angka.",
    })
    .positive("Harga harus lebih dari 0."),
});

export default function BarangForm({ initialData, mode }) {
  const { showPostRedirectAlert, showAlert } = useSwal();
  const router = useRouter();
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    nama_barang: initialData?.data?.nama_barang || "",
    kategori: initialData?.data?.kategori || "",
    harga: initialData?.data?.harga || 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationResult = barangSchema.safeParse({
      ...formData,
      harga: parseFloat(formData.harga),
    });

    if (!validationResult.success) {
      setError(validationResult.error.flatten().fieldErrors);
      setIsLoading(false);
      return;
    }

    setError(null);

    const payload = validationResult.data;

    if (mode === "edit") {
      const response = await fetchWithAuth(
        `/api/barang/${initialData.data.barang_id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        showAlert({
          title: "Kesalahan saat memperbarui barang",
          text: "Terjadi kesalahan saat memperbarui barang.",
          icon: "error",
        });

        setError(
          response.body?.message || "Terjadi kesalahan saat memperbarui barang."
        );
      } else {
        showPostRedirectAlert({
          title: "Sukses",
          text: "Barang berhasil diperbarui.",
          icon: "success",
        });
        router.push("/dashboard/barang");
      }
    } else {
      const response = await fetchWithAuth(`/api/barang`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      console.log(response);
      if (!response.ok) {
        showAlert({
          title: "Kesalahan saat menambahkan barang",
          text: response.body.message,
          icon: "error",
        });

        setError(
          response.body?.message || "Terjadi kesalahan saat menambahkan barang."
        );
      } else {
        setFormData({
          nama_barang: "",
          kategori: "",
          harga: 0,
        });
        showPostRedirectAlert({
          title: "Sukses",
          text: "Barang berhasil ditambahkan.",
          icon: "success",
        });
        router.push("/dashboard/barang");
      }
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Edit Barang" : "Tambah Barang"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nama_barang">Nama Barang</Label>
            <Input
              id="nama_barang"
              value={formData.nama_barang}
              onChange={(e) =>
                setFormData({ ...formData, nama_barang: e.target.value })
              }
              placeholder="Masukkan nama barang"
            />
            {error?.nama_barang && (
              <p className="text-red-500">{error.nama_barang[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori">Kategori</Label>
            <Select
              value={formData.kategori}
              onValueChange={(value) =>
                setFormData({ ...formData, kategori: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Meranti">Meranti</SelectItem>
                <SelectItem value="Ulin">Ulin</SelectItem>
                <SelectItem value="Kapur">Kapur</SelectItem>
                <SelectItem value="Kruing">Kruing</SelectItem>
                <SelectItem value="Septic Tank">Septic Tank</SelectItem>
                <SelectItem value="Bahan Bangunan">Bahan Bangunan</SelectItem>
              </SelectContent>
            </Select>
            {error?.kategori && (
              <p className="text-red-500">{error.kategori[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="harga">Harga</Label>
            <Input
              id="harga"
              type="number"
              min={0}
              value={formData.harga}
              onChange={(e) =>
                setFormData({ ...formData, harga: e.target.value })
              }
              placeholder="Masukkan harga"
            />
            {error?.harga && <p className="text-red-500">{error.harga[0]}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : mode === "edit"
              ? "Simpan Perubahan"
              : "Tambah Barang"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
