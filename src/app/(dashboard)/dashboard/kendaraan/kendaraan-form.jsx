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

export default function KendaraanForm({ initialData, mode }) {
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    plat_nomor: initialData?.data?.plat_nomor || "",
    jenis_kendaraan: initialData?.data?.jenis_kendaraan || "",
    kapasitas: initialData?.data?.kapasitas || "",
    status_kendaraan: initialData?.data?.status_kendaraan || "Tersedia",
  });
  const { showPostRedirectAlert, showAlert } = useSwal();

  const router = useRouter();

  const schema = z.object({
    plat_nomor: z.string().nonempty("Plat nomor harus diisi."),
    jenis_kendaraan: z.string().nonempty("Jenis kendaraan harus diisi."),
    kapasitas: z
      .number()
      .min(1, "Kapasitas harus lebih dari 0.")
      .or(z.string().regex(/^\d+$/, "Kapasitas harus berupa angka")),
    status_kendaraan: z.string().nonempty("Status kendaraan harus diisi."),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi data form
    const result = schema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.flatten();
      setError({ fieldErrors: errors.fieldErrors });
      return;
    }

    // Jika validasi berhasil, lanjutkan dengan logika submit
    setError(null);
    setIsLoading(true);

    try {
      const url =
        mode === "edit"
          ? `/api/kendaraan/${initialData.data.kendaraan_id}` // Pastikan ID kendaraan tersedia
          : `/api/kendaraan`;

      const method = mode === "edit" ? "PUT" : "POST";

      console.log("Data yang dikirim:", result.data); // Logging data
      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(result.data), // Gunakan data yang sudah divalidasi
      });

      if (!response.ok) {
        if (Array.isArray(response.body.errors)) {
          setError(response.body.errors.map((err) => err.message).join(", "));
        } else if (typeof response.body.errors === "object") {
          setError(Object.values(response.body.errors).join(", "));
        } else {
          setError(
            response.body.message ||
              "An error occurred while submitting the form"
          );
        }
      } else {
        setError(null);
      }
      
      if (response.ok) {
        showPostRedirectAlert({
          title: "Success",
          text:
            mode === "edit"
              ? "Kendaraan berhasil diupdate."
              : "Kendaraan berhasil ditambahkan.",
          icon: "success",
        });
        router.push("/dashboard/kendaraan");
      } else {
        showAlert({
          title: "Error",
          text: "An unexpected error occurred",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      setError({ general: "Terjadi kesalahan tak terduga." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Edit Kendaraan" : "Tambah Kendaraan"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="plat_nomor">Plat Nomor</Label>
            <Input
              id="plat_nomor"
              value={formData.plat_nomor}
              onChange={(e) =>
                setFormData({ ...formData, plat_nomor: e.target.value })
              }
              placeholder="Masukkan Plat Nomor"
            />
            {error?.fieldErrors?.plat_nomor && (
              <p className="text-red-500">{error.fieldErrors.plat_nomor[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jenis_kendaraan">Jenis Kendaraan</Label>
            <Input
              id="jenis_kendaraan"
              value={formData.jenis_kendaraan}
              onChange={(e) =>
                setFormData({ ...formData, jenis_kendaraan: e.target.value })
              }
              placeholder="Masukkan Jenis atau Merk Kendaraan"
            />
            {error?.fieldErrors?.jenis_kendaraan && (
              <p className="text-red-500">
                {error.fieldErrors.jenis_kendaraan[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kapasitas">Kapasitas (kg)</Label>
            <Input
              id="kapasitas"
              type="number"
              value={formData.kapasitas}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kapasitas: parseInt(e.target.value),
                })
              }
              placeholder="Masukkan kapasitas"
            />
            {error?.fieldErrors?.kapasitas && (
              <p className="text-red-500">{error.fieldErrors.kapasitas[0]}</p>
            )}
          </div>

          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="status_kendaraan">Status</Label>
              <Select
                value={formData.status_kendaraan}
                onValueChange={(value) =>
                  setFormData({ ...formData, status_kendaraan: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tersedia">Tersedia</SelectItem>
                  <SelectItem value="sedang mengirim">Sedang Mengirim</SelectItem>
                  <SelectItem value="dalam perbaikan">Dalam Perbaikan</SelectItem>
                </SelectContent>
              </Select>
              {error?.fieldErrors?.status_kendaraan && (
                <p className="text-red-500">
                  {error.fieldErrors.status_kendaraan[0]}
                </p>
              )}
            </div>
          )}

          {error?.general && (
            <p className="text-red-500 text-center">{error.general}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "menyimpan..."
              : mode === "edit"
              ? "Simpan Perubahan"
              : "Tambah Kendaraan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
