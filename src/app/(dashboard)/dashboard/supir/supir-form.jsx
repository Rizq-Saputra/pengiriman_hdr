"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
// Import the plugin code
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Import the plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { ToastAction } from "@/components/ui/toast";
import { useSwal } from "@/hooks/use-swal";
import { useRouter } from "next/navigation";

registerPlugin(FilePondPluginImagePreview);

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

  const [errorData, setError] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
          text: "Supir berhasil diperbarui",
          icon: "success",
        });

        router.push("/dashboard/supir");
      } else {
        showAlert({
          title: "Error",
          text: "An unexpected error occurred",
          icon: "error",
        });
      }
    } else {
      const response = await fetchWithAuth(`/api/supir`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        console.log(response.body);
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
          text: "Supir berhasil ditambahkan",
          icon: "success",
        });

        router.push("/dashboard/supir");
      } else {
        showAlert({
          title: "Error",
          text: "An unexpected error occurred",
          icon: "error",
        });
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="gambar_supir">Foto</Label>
            <FilePond
              allowMultiple={false}
              server={{
                url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`,
                load: (source, load, error) => {
                  console.log(source);
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
                    // console.log("Process response:", response);
                    const parsedResponse = JSON.parse(response);
                    // console.log("Parsed path:", parsedResponse.path);

                    setFormData((prev) => {
                      // console.log("Previous formData:", prev);
                      const newState = {
                        ...prev,
                        gambar_supir: parsedResponse.path,
                      };
                      // console.log("New formData state:", newState);
                      return newState;
                    });

                    return parsedResponse.path;
                  },
                },
              }}
              onremovefile={(error, file) => {
                console.log("onremovefile", error, file);

                // Check if this is a user-initiated removal and not an automatic replacement
                if (file.origin !== 1) {
                  // 1 indicates user removal
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
              // conditionally set the files prop
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

          {errorData && <p className="text-red-500">{errorData}</p>}

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
