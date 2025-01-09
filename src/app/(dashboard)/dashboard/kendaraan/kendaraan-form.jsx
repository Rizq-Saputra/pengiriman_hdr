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
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSwal } from "@/hooks/use-swal";
import { useRouter } from "next/navigation";

export default function KendaraanForm({ initialData, mode }) {
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    plat_nomor: initialData?.data?.plat_nomor || "",
    jenis_kendaraan: initialData?.data?.jenis_kendaraan || "",
    kapasitas: initialData?.data?.kapasitas || "",
    status_kendaraan: initialData?.data?.status_kendaraan || "tersedia",
  });
  const { showPostRedirectAlert, showAlert } = useSwal();

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (mode === "edit") {
      const response = await fetchWithAuth(
        `/api/kendaraan/${initialData.data?.kendaraan_id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        // Format the error message properly
        if (Array.isArray(response.body.errors)) {
          // If it's an array of errors, join them
          setError(response.body.errors.map((err) => err.message).join(", "));
        } else if (typeof response.body.errors === "object") {
          // If it's an object with validation errors
          setError(Object.values(response.body.errors).join(", "));
        } else {
          // Fallback error message
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
          text: "Kendaraan berhasil diupdate.",
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
    } else {
      const response = await fetchWithAuth(`/api/kendaraan`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Format the error message properly
        if (Array.isArray(response.body.errors)) {
          // If it's an array of errors, join them
          setError(response.body.errors.map((err) => err.message).join(", "));
        } else if (typeof response.body.errors === "object") {
          // If it's an object with validation errors
          setError(Object.values(response.body.errors).join(", "));
        } else {
          // Fallback error message
          setError(
            response.body.message ||
              "An error occurred while submitting the form"
          );
        }
      }

      if (response.ok) {
        showPostRedirectAlert({
          title: "Success",
          text: "Kendaraan berhasil ditambahkan.",
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

      // clear error
      setError(null);
      setFormData({
        plat_nomor: "",
        jenis_kendaraan: "",
        kapasitas: "",
        status_kendaraan: "tersedia",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Edit Kendaraan" : "Tambah Kendaraan"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plat_nomor">Plat Nomor</Label>
            <Input
              id="plat_nomor"
              value={formData.plat_nomor}
              onChange={(e) =>
                setFormData({ ...formData, plat_nomor: e.target.value })
              }
              placeholder="Contoh: B 1234 ABC"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jenis_kendaraan">Jenis Kendaraan</Label>
            <Input
              id="jenis_kendaraan"
              value={formData.jenis_kendaraan}
              onChange={(e) =>
                setFormData({ ...formData, jenis_kendaraan: e.target.value })
              }
              placeholder="Contoh: Toyota"
            />
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
          </div>

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
                <SelectItem value="tersedia">Tersedia</SelectItem>
                <SelectItem value="sedang mengirim">Sedang Mengirim</SelectItem>
                <SelectItem value="dalam perbaikan">Dalam Perbaikan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-red-500">{error}</p>}

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
