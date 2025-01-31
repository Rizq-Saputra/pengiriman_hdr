"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSwal } from "@/hooks/use-swal";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function PelangganForm({ initialData, mode }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const { showPostRedirectAlert, showAlert } = useSwal();
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    nama_pelanggan: initialData?.data?.nama_pelanggan || "",
    no_telepon: initialData?.data?.no_telepon || "",
  });

  const schema = z.object({
    nama_pelanggan: z.string().nonempty("Nama harus diisi."),
    no_telepon: z
      .string()
      .nonempty("No telepon harus diisi.")
      .regex(/^\d+$/, "No telepon harus berupa angka."),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi data form menggunakan Zod
    const result = schema.safeParse(formData);

    if (!result.success) {
      // Tangani error validasi
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }

    // Reset error jika validasi berhasil
    setFieldErrors({});
    setIsLoading(true);

    try {
      let response;

      if (mode === "edit") {
        response = await fetchWithAuth(
          `/api/pelanggan/${initialData.data.pelanggan_id}`,
          {
            method: "PUT",
            body: JSON.stringify(formData),
          }
        );
      } else {
        response = await fetchWithAuth(`/api/pelanggan`, {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errors = response.body.errors;
        if (errors) {
          setFieldErrors(
            Array.isArray(errors)
              ? { global: errors.map((err) => err.message).join(", ") }
              : errors
          );
        } else {
          throw new Error("Pastikan nama dan nomor Telepon tidak sama");
        }
        return;
      }

      // Tampilkan notifikasi sukses
      showPostRedirectAlert({
        title: "Sukses",
        text:
          mode === "edit"
            ? "Pelanggan berhasil diperbarui"
            : "Pelanggan berhasil ditambahkan",
        icon: "success",
      });

      // Redirect ke halaman pelanggan
      router.push("/dashboard/pelanggan");
    } catch (err) {
      setFieldErrors({ global: err.message });
    } finally {
      setIsLoading(false);
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
            {fieldErrors.nama_pelanggan && (
              <p className="text-red-500 text-sm">
                {fieldErrors.nama_pelanggan[0]}
              </p>
            )}
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
            {fieldErrors.no_telepon && (
              <p className="text-red-500 text-sm">
                {fieldErrors.no_telepon[0]}
              </p>
            )}
          </div>

          {fieldErrors.global && (
            <p className="text-red-500 text-sm">{fieldErrors.global}</p>
          )}

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
