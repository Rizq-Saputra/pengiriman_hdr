"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
// Import the plugin code
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Import the plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSwal } from "@/hooks/use-swal";
import { useRouter } from "next/navigation";
import { z } from "zod";

registerPlugin(FilePondPluginImagePreview);

// Defining the validation schema with Zod
const supirSchema = z.object({
  nama_supir: z.string().min(3, "Nama supir harus terdiri dari minimal 3 karakter"),
  no_telepon: z.string().min(10, "Nomor telepon harus terdiri dari minimal 10 karakter"),
  gambar_supir: z.string().optional(),
  jumlah_antaran: z.number().min(0, "Jumlah antaran tidak bisa negatif"),
  password: z.string().min(6, "Password harus terdiri dari minimal 6 karakter").optional(),
});

export default function SupirForm({ initialData, mode }) {
  const { showPostRedirectAlert, showAlert } = useSwal();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const driverData = initialData?.data || {};
  const [formData, setFormData] = React.useState({
    nama_supir: driverData?.nama_supir || "",
    no_telepon: driverData?.no_telepon || "",
    gambar_supir: driverData?.gambar_supir || "",
    jumlah_antaran: driverData?.jumlah_antaran || 0,
    password: "",
  });

  const [errorData, setError] = React.useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate the form data with Zod schema
    try {
      supirSchema.parse(formData); // This will throw if validation fails

      if (mode === "edit") {
        // if the password is empty, don't send it
        if (formData.password === "") {
          delete formData.password;
        }

        const response = await fetchWithAuth(
          `/api/supir/${initialData.data.supir_id}`,
          {
            method: "PATCH",
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          setError({ general: "An unexpected error occurred" });
        } else {
          showPostRedirectAlert({
            title: "Success",
            text: "Supir berhasil diperbarui",
            icon: "success",
          });
          router.push("/dashboard/supir");
        }
      } else {
        const response = await fetchWithAuth(`/api/supir`, {
          method: "POST",
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          setError({ general: "An unexpected error occurred" });
        } else {
          showPostRedirectAlert({
            title: "Success",
            text: "Supir berhasil ditambahkan",
            icon: "success",
          });
          router.push("/dashboard/supir");
        }

        // clear the form
        setFormData({
          nama_supir: "",
          no_telepon: "",
          gambar_supir: "",
          jumlah_antaran: 0,
          password: "",
        });
      }
    } catch (e) {
      // Handle validation errors
      if (e instanceof z.ZodError) {
        const errorObj = e.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        setError(errorObj);
      }
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === "edit" ? "Edit Supir" : "Tambah Supir"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={formData.nama_supir}
              onChange={(e) =>
                setFormData({ ...formData, nama_supir: e.target.value })
              }
              placeholder="Masukkan nama supir"
            />
            {errorData.nama_supir && (
              <p className="text-red-500 text-sm">{errorData.nama_supir}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gambar_supir">Foto</Label>
            <FilePond
              allowMultiple={false}
              server={{
                url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`,
                load: (source, load, error) => {
                  if (!source) {
                    error("No source provided");
                    return;
                  }
                  const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${source}`;
                  fetch(fullUrl)
                    .then((res) => {
                      if (!res.ok) throw new Error("Failed to load image");
                      return res.blob();
                    })
                    .then(load)
                    .catch(error);
                },
                process: {
                  url: "/api/uploads",
                  method: "POST",
                  onload: (response) => {
                    const parsedResponse = JSON.parse(response);
                    setFormData((prev) => ({
                      ...prev,
                      gambar_supir: parsedResponse.path,
                    }));
                    return parsedResponse.path;
                  },
                },
              }}
              onremovefile={(error, file) => {
                if (file.origin !== 1) {
                  fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api${file.serverId}`,
                    {
                      method: "DELETE",
                    }
                  );
                  setFormData((prev) => ({
                    ...prev,
                    gambar_supir: null,
                  }));
                }
              }}
              name="file"
              labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
              acceptedFileTypes={["image/*"]}
              plugins={[FilePondPluginImagePreview]}
              allowRevert={true}
              {...(mode === "edit" && formData.gambar_supir
                ? {
                    files: [
                      {
                        source: formData.gambar_supir,
                        options: { type: "local" },
                      },
                    ],
                  }
                : {})}
            />
            {errorData.gambar_supir && (
              <p className="text-red-500 text-sm">{errorData.gambar_supir}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Masukkan password"
            />
            {errorData.password && (
              <p className="text-red-500 text-sm">{errorData.password}</p>
            )}
            {mode === "edit" && (
              <p className="text-sm text-gray-500">
                Kosongkan jika tidak ingin mengubah password
              </p>
            )}
          </div>

          <div className={`space-y-2 ${mode === "add" ? "hidden" : ""}`}>
            <Label htmlFor="jumlah_antaran">Jumlah Antaran</Label>
            <Input
              id="jumlah_antaran"
              type="number"
              value={formData.jumlah_antaran}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  jumlah_antaran: parseInt(e.target.value) || 0,
                })
              }
              placeholder="Masukkan jumlah antaran"
            />
            {errorData.jumlah_antaran && (
              <p className="text-red-500 text-sm">{errorData.jumlah_antaran}</p>
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
            {errorData.no_telepon && (
              <p className="text-red-500 text-sm">{errorData.no_telepon}</p>
            )}
          </div>

          {errorData.general && (
            <p className="text-red-500 text-sm">{errorData.general}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "menyimpan..."
              : mode === "edit"
              ? "Simpan Perubahan"
              : "Tambah Supir"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
