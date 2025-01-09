"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import Loading from "./loading";
import { Link as IconLink, PhoneCall } from "lucide-react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;


async function searchByResi(resi) {
  const response = await fetch(`${BASE_URL}/api/pengiriman-pelanggan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resi: resi,
    }),
  });

  const data = await response.json();
  return data;
}

export default function PelangganPage() {
  const [resi, setResi] = useState("");
  const [loading, setLoading] = useState(false);
  const [delivery, setDelivery] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDelivery(null);
    setSelectedDelivery(null);

    try {
      const { data } = await searchByResi(resi);

      if (data) {
        setDelivery(data);
      } else {
        setError("Tidak ada pengiriman ditemukan");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mencari pengiriman");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu":
        return "default";
      case "Dalam Pengiriman":
        return "warning";
      case "Selesai":
        return "success";
      default:
        return "secondary";
    }
  };

  const DeliveryDetail = ({ delivery }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detail Pengiriman</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Supir</p>
            <p className="font-medium">{delivery?.Supir.nama_supir}</p>
            <Link href={`https://wa.me/${delivery?.Supir.no_telepon.replace("08", "628")}`} target="_blank">
              <Button variant="outline" className="text-sm">
                <PhoneCall size={16} className="mr-2" />
                {delivery?.Supir.no_telepon}
              </Button>
            </Link>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Kendaraan</p>
            <p className="font-medium">{delivery?.Kendaraan.plat_nomor}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tanggal</p>
            <p className="font-medium">{
              new Date(delivery?.tanggal_pengiriman).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Penerima</p>
            <p className="font-medium">{delivery?.Pelanggan.nama_pelanggan}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Deskripsi</p>
            <p className="font-medium border rounded py-2 px-3">{delivery?.deskripsi}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={getStatusColor(delivery?.status_pengiriman)}>
              {delivery?.status_pengiriman}
            </Badge>
          </div>
        </div>
        {delivery?.bukti_pengiriman && (
          <div className="relative w-full aspect-video">
            <img
              src={process.env.NEXT_PUBLIC_BACKEND_API_URL + delivery?.bukti_pengiriman}
              alt="Bukti Pengiriman"
              className="object-cover rounded-md"
            />
            {/* <Image
              src={process.env.NEXT_PUBLIC_BACKEND_API_URL + delivery?.bukti_pengiriman}
              alt="Bukti Pengiriman"
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            /> */}
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">Alamat</p>
          <p className="font-medium">{delivery?.alamat_tujuan}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Barang</p>
          <ul className="list-disc list-inside">
            {delivery?.DetailPengiriman.map((barang) => (
              <li key={barang.barang_id}>{barang.Barang.nama_barang} - {barang.Barang.kategori}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 w-full max-w-3xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tracking Pengiriman</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Masukkan Resi"
                value={resi}
                onChange={(e) => setResi(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !resi}>
                {loading ? "Mencari..." : "Cari"}
              </Button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <Loading />
      ) : (
        <>
          {delivery &&
            <DeliveryDetail delivery={delivery} />
          }
        </>
      )}
    </div>
  );
}
