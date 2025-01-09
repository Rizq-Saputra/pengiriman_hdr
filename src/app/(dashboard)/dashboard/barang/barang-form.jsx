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

export default function BarangForm({ initialData, mode }) {
  const { showPostRedirectAlert, showAlert } = useSwal();

  const router = useRouter();
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    nama_barang: initialData?.data?.nama_barang || "",
    kategori: initialData?.data?.kategori || "",
    berat: initialData?.data?.berat || 0,
    harga: initialData?.data?.harga || 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (mode === "edit") {
      const response = await fetchWithAuth(
        `/api/barang/${initialData.data.barang_id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        }
      );

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
          title: "Success!",
          text: "Pengiriman berhasil diupdate",
          icon: "success",
          confirmButtonText: "OK",
        });
        router.push("/dashboard/barang");
      } else {
        showAlert({
          title: "Error",
          text: "An unexpected error occurred",
          icon: "error",
        });
      }
    } else {
      const response = await fetchWithAuth(`/api/barang`, {
        method: "POST",
        body: JSON.stringify(formData),
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
        setFormData({
          nama_barang: "",
          kategori: "",
          berat: 0,
          harga: 0,
        });
      }

      if (response.ok) {
        showPostRedirectAlert({
          title: "Success!",
          text: "Barang berhasil ditambahkan",
          icon: "success",
          confirmButtonText: "OK",
        });

        router.push("/dashboard/barang");
      } else {
        showAlert({
          title: "Error",
          text: "An unexpected error occurred",
          icon: "error",
        });
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
                <SelectItem value="Kategori 3">Kategori 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="berat">Berat (kg)</Label>
            <Input
              id="berat"
              type="number"
              value={formData.berat}
              onChange={(e) =>
                setFormData({ ...formData, berat: parseInt(e.target.value) })
              }
              placeholder="Masukkan berat"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="harga">Harga</Label>
            <Input
              id="harga"
              type="number"
              value={formData.harga}
              onChange={(e) =>
                setFormData({ ...formData, harga: parseInt(e.target.value) })
              }
              placeholder="Masukkan harga"
            />
          </div>

          <Button type="submit" className="w-full">
            {mode === "edit" ? "Simpan Perubahan" : "Tambah Barang"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
