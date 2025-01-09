"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSwal } from "@/hooks/use-swal";
import { useRouter } from "next/navigation";

export default function PelangganForm({ initialData, mode }) {
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { showPostRedirectAlert, showAlert } = useSwal();
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    nama_pelanggan: initialData?.data?.nama_pelanggan || "",
    email: initialData?.data?.email || "",
    no_telepon: initialData?.data?.no_telepon || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (mode === "edit") {
      const response = await fetchWithAuth(
        `/api/pelanggan/${initialData.data.pelanggan_id}`,
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

      setIsLoading(false);

      if (response.ok) {
        showPostRedirectAlert({
          title: "Success",
          text: "Pelanggan berhasil diperbarui",
          icon: "success",
        });

        router.push("/dashboard/pelanggan");
      }else{
        showAlert({
          title: "Error",
          text: "An unexpected error occurred",
          icon: "error",
        });
      }
    } else {
      const response = await fetchWithAuth(`/api/pelanggan`, {
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
      }

      setIsLoading(false);

      if (response.ok) {
        showPostRedirectAlert({
          title: "Success",
          text: "Pelanggan berhasil ditambahkan",
          icon: "success",
        });

        router.push("/dashboard/pelanggan");
      }else{
        showAlert({
          title: "Error",
          text: "An unexpected error occurred",
          icon: "error",
        });
      }

      // clear error
      setError(null);
      setFormData({
        nama_pelanggan: "",
        email: "",
        no_telepon: "",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "Edit Pelanggan" : "Tambah Pelanggan"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={formData.nama_pelanggan}
              onChange={(e) =>
                setFormData({ ...formData, nama_pelanggan: e.target.value })
              }
              placeholder="Masukkan nama pelanggan"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Masukkan email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              value={formData.no_telepon}
              onChange={(e) =>
                setFormData({ ...formData, no_telepon: e.target.value })
              }
              placeholder="Masukkan nomor telepon"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : mode === "edit"
              ? "Simpan Perubahan"
              : "Tambah Pelanggan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
