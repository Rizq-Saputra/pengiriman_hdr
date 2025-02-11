"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Loading from "./loading";
import { jwtDecode } from "jwt-decode";
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
import { Label } from "@/components/ui/label";
import * as React from "react";
import { PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";

// Import FilePond styles
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
// Import the plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { STATUS_PENGIRIMAN } from "@/constants/status";
import Link from "next/link";
import { useSwal } from "@/hooks/use-swal";

registerPlugin(FilePondPluginImagePreview);

export default function DeliveryDetails({ id }) {
  const [data, setData] = useState(null);
  const [updateDeskripsi, setUpdateDeskripsi] = useState(data?.deskripsi);
  const [updateBuktiPengiriman, setUpdateBuktiPengiriman] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showAlert } = useSwal();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        if (!token || token == "undefined" || token == "null") {
          redirect("/login");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/pengiriman/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // if res is 401, try to use refresh token
        if (res.status === 401) {
          const refreshTokenLocal = localStorage.getItem("refreshToken");
          const res = await fetch(`${BASE_URL}/api/supir/auth/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: refreshTokenLocal }),
          });
          const { token, refreshToken } = await res.json();
          localStorage.setItem("token", token);
          // refresh
          window.location.reload();
        }

        if (res.status === 404) {
          notFound();
        }
        const data = await res.json();

        setData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      if (!token || token == "undefined" || token == "null") {
        redirect("/login");
      }
      // craft update data
      const updateData = {
        // deskripsi is optional
        ...(updateDeskripsi && { deskripsi: updateDeskripsi }),
        status_pengiriman: STATUS_PENGIRIMAN.SELESAI,
        // bukti pengiriman is optional
        ...(updateBuktiPengiriman && {
          bukti_pengiriman: updateBuktiPengiriman,
        }),
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/pengiriman/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );
      // if res is 401, try to use refresh token
      if (res.status === 401) {
        const refreshTokenLocal = localStorage.getItem("refreshToken");
        const res = await fetch(`${BASE_URL}/api/supir/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken: refreshTokenLocal }),
        });
        const { token, refreshToken } = await res.json();
        localStorage.setItem("token", token);
        // refresh
        window.location.reload();
        return;
      }
      if (res.status === 404) {
        notFound();
      }
      const data = await res.json();
      console.log(data);
      // setData(data.data);
      showAlert(
        {
          title: "Pengiriman telah dikonfirmasi",
          icon: "success",
        },
        (result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert({
        title: "Terjadi kesalahan",
        icon: "error",
      });
    }
  };

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      if (!token || token == "undefined" || token == "null") {
        redirect("/login");
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/pengiriman/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deskripsi: updateDeskripsi,
            status_pengiriman: STATUS_PENGIRIMAN.DIBATALKAN,
          }),
        }
      );
      // if res is 401, try to use refresh token
      if (res.status === 401) {
        const refreshTokenLocal = localStorage.getItem("refreshToken");
        const res = await fetch(`${BASE_URL}/api/supir/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken: refreshTokenLocal }),
        });
        const { token, refreshToken } = await res.json();
        localStorage.setItem("token", token);
        // refresh
        window.location.reload();
        return;
      }
      if (res.status === 404) {
        notFound();
      }
      const data = await res.json();
      // setData(data.data);
      showAlert(
        {
          title: "Pengiriman telah dikonfirmasi",
          icon: "success",
        },
        (result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (isLoading) return <Loading />;
  if (!data) return notFound();

  return (
    <div className="p-8 w-full">
      <VeryTopBackButton />
      <Card>
        <CardHeader>
          <CardTitle>Detail Pengiriman</CardTitle>
        </CardHeader>
      </Card>
      <Card className="mt-4 p-4">
        <CardHeader>
          <h1 className="text-sm font-bold my-2">
            {Intl.DateTimeFormat("id-ID", {
              dateStyle: "full",
            }).format(new Date(data.tanggal_pengiriman))}
          </h1>
          <p className="mb-4 font-bold">
            Pelanggan : {data.Pelanggan.nama_pelanggan}
          </p>
        </CardHeader>
        <CardContent className="flex space-x-2 items-center">
          <Link
            href={`https://wa.me/${data.Pelanggan.no_telepon.replace(
              "08",
              "628"
            )}`}
            target="_blank"
          >
            <Button variant="outline" className="text-sm">
              <PhoneCall size={16} className="mr-2" />
              {data.Pelanggan.no_telepon}
            </Button>
          </Link>
          <Badge variant="warning" className="p-2 cursor-pointer">
            {data.status_pengiriman}
          </Badge>
          <Badge className="p-2 cursor-pointer">{data.pembayaran}</Badge>
        </CardContent>
        <CardContent>
          <p>Alamat</p>
          <Textarea className="mb-4" value={data.alamat_tujuan} />
          <p>Deskripsi</p>
          <Textarea value={data.deskripsi} />
        </CardContent>
        <div className="p-8">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barang</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.DetailPengiriman.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold text-nowrap">
                      {item.Barang.nama_barang}
                    </TableCell>
                    <TableCell>{item.Barang.kategori}</TableCell>
                    <TableCell className="">{item.jumlah_barang}</TableCell>
                    <TableCell>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.Barang.harga)}
                    </TableCell>
                    <TableCell>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.jumlah_barang * item.Barang.harga)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center border-gray-200 pt-4 px-4 mt-4">
            <p className="text-lg">Ongkir</p>
            <p className="text-lg">
              {Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(data.ongkir)}
            </p>
          </div>
          <div className="flex justify-between items-center border-t-2 border-gray-200 pt-4 px-4 mt-4">
            <p className="text-lg font-medium">Total</p>
            <p className="text-lg font-bold">
              {Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(data.total) + Number(data.ongkir))}
            </p>
          </div>
        </div>
        {/* add bukti pengiriman if exist */}
        {data.bukti_pengiriman && (
          <div className="p-8 flex flex-col">
            <CardTitle className="font-semibold mb-4 text-center">
              Bukti Pengiriman
            </CardTitle>
            <img
              src={
                process.env.NEXT_PUBLIC_BACKEND_API_URL + data.bukti_pengiriman
              }
            />
            {/* <Image
              alt="bukti pengiriman"
              src={
                process.env.NEXT_PUBLIC_BACKEND_API_URL + data.bukti_pengiriman
              }
              width={500}
              height={500}
            /> */}
          </div>
        )}
        {data.status_pengiriman === STATUS_PENGIRIMAN.BELUM_DIKIRIM ||
        data.status_pengiriman === STATUS_PENGIRIMAN.DALAM_PENGIRIMAN ? (
          <div className="flex justify-end gap-x-2 mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Konfirmasi Pengiriman</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Pengiriman?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isikan bukti pengiriman dan konfirmasi pengiriman ini
                  </AlertDialogDescription>
                  <div className="space-y-2">
                    <Label htmlFor="deskripsi">Tambahkan deskripsi</Label>
                    <Textarea
                      id="deskripsi"
                      value={updateDeskripsi}
                      onChange={(e) => {
                        setUpdateDeskripsi(e.target.value);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gambar_supir">Bukti Pengiriman</Label>
                    <FilePond
                      allowMultiple={false}
                      maxFileSize="2MB" // Batas ukuran file 2 MB
                      onwarning={(error, file, status) => {
                        if (error.code === 1) {
                          // Error code 1 adalah ukuran file melebihi batas
                          showAlert({
                            title: "Ukuran File Melebihi Batas",
                            text: "Ukuran file harus kurang dari 2 MB.",
                            icon: "warning",
                          });
                        }
                      }}
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
                              if (!res.ok)
                                throw new Error("Failed to load image");
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
                            setUpdateBuktiPengiriman(parsedResponse.path);
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

                          setData({
                            ...data,
                            bukti_pengiriman: null,
                          });
                        }
                      }}
                      name="file"
                      labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
                      acceptedFileTypes={["image/*"]}
                      plugins={[FilePondPluginImagePreview]}
                      allowRevert={true}
                    />
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-primary text-white"
                    onClick={handleConfirm}
                  >
                    Konfirmasi
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Batalkan Pengiriman</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Batalkan Pengiriman?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah anda yakin ingin membatalkan pengiriman ini?
                  </AlertDialogDescription>
                  <div className="space-y-2">
                    <Label htmlFor="deskripsi">Tambahkan deskripsi</Label>
                    <Textarea
                      id="deskripsi"
                      value={updateDeskripsi}
                      onChange={(e) => {
                        setUpdateDeskripsi(e.target.value);
                      }}
                    />
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-primary text-white"
                    onClick={handleCancel}
                  >
                    Ya, Batalkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="success" asChild>
              <Link
                href={`https://api.whatsapp.com/send?phone=${data.Pelanggan.no_telepon.replace(
                  /\D/g,
                  ""
                )}&text=Halo%20${
                  data.Pelanggan.nama_pelanggan
                },%20kami%20dari%20Kurir%20Express`}
              >
                <PhoneCall size={16} />
                Hubungi Pelanggan
              </Link>
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
