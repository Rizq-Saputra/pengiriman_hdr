"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ChevronsUpDown, Check } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useSwal } from "@/hooks/use-swal";
import { STATUS_PENGIRIMAN, STATUS_PEMBAYARAN } from "@/constants/status";
import { useRouter } from "next/navigation";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function ShippingForm({ initialData, mode }) {
  const { showAlert, showPostRedirectAlert } = useSwal();
  const router = useRouter();

  const [items, setItems] = React.useState(
    initialData?.data?.DetailPengiriman.map((item) => ({
      ...item,
      barang_id: item.barang_id.toString(), // Konversi ke string
    })) || [{ jumlah_barang: 0, barang_id: "" }]
  );

  const [supir, setSupir] = React.useState(
    initialData?.data?.supir_id.toString() || ""
  );
  const [pelanggan, setPelanggan] = React.useState(
    initialData?.data?.pelanggan_id.toString() || ""
  );
  const [kendaraan, setKendaraan] = React.useState(
    initialData?.data?.kendaraan_id.toString() || ""
  );
  const [alamat, setAlamat] = React.useState(
    initialData?.data?.alamat_tujuan || ""
  );
  const [deskripsi, setDeskripsi] = React.useState(
    initialData?.data?.deskripsi || ""
  );
  const [pembayaran, setPembayaran] = React.useState(
    initialData?.data?.pembayaran || STATUS_PEMBAYARAN.COD
  );
  const [ongkir, setOngkir] = React.useState(initialData?.data?.ongkir || 0);
  const [status, setStatus] = React.useState(
    initialData?.data?.status_pengiriman || STATUS_PENGIRIMAN.BELUM_DIKIRIM
  );
  const [buktiPengiriman] = React.useState(
    initialData?.data?.bukti_pengiriman || ""
  );
  const [loading, setLoading] = React.useState(false);
  const [barangList, setBarangList] = React.useState([]);
  const [supirList, setSupirList] = React.useState([]);
  const [pelangganList, setPelangganList] = React.useState([]);
  const [kendaraanList, setKendaraanList] = React.useState([]);
  const memoizedBarangList = React.useMemo(() => barangList, [barangList]);
  const memoizedSupirList = React.useMemo(() => supirList, [supirList]);

  React.useEffect(() => {
    const fetchData = async () => {
      const [barangRes, supirRes, pelangganRes, kendaraanRes] =
        await Promise.all([
          fetchWithAuth("/api/barang?all_data=true"),
          fetchWithAuth("/api/supir"),
          fetchWithAuth("/api/pelanggan?all_data=true"),
          fetchWithAuth("/api/kendaraan"),
        ]);

      setBarangList(barangRes.body.data);
      setSupirList(supirRes.body.data);
      setPelangganList(pelangganRes.body.data);
      setKendaraanList(kendaraanRes.body.data);
    };

    fetchData();
  }, []);

  // Fungsi untuk menambah item
  const addItem = () =>
    setItems([...items, { jumlah_barang: 1, barang_id: "", subtotal: 0 }]);

  // Fungsi untuk mengupdate item
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Fungsi untuk menghapus item
  const deleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (mode === "edit") {
      const initialItems = initialData.data.DetailPengiriman || [];
      const currentItems = items;
  
      const itemsToAdd = currentItems.filter(
        (item) =>
          !item.detail_pengiriman_id && item.barang_id && item.jumlah_barang > 0
      );
  
      const itemsToUpdate = currentItems.filter((item) => {
        const initialItem = initialItems.find(
          (initialItem) =>
            initialItem.detail_pengiriman_id === item.detail_pengiriman_id
        );
        return (
          initialItem &&
          (initialItem.jumlah_barang !== item.jumlah_barang ||
            initialItem.barang_id !== item.barang_id)
        );
      });
  
      const itemsToRemove = initialItems.filter(
        (initialItem) =>
          !currentItems.some(
            (item) =>
              item.detail_pengiriman_id === initialItem.detail_pengiriman_id
          )
      );
  
      try {
        const data = {
          tanggal_pengiriman: initialData.data.tanggal_pengiriman,
          status_pengiriman: status,
          alamat_tujuan: alamat,
          deskripsi: deskripsi,
          pembayaran: pembayaran,
          ongkir: ongkir,
          total: items.reduce(
            (acc, item) => acc + (item.subtotal || 0),
            0
          ),
          kendaraan_id: parseInt(kendaraan),
          supir_id: parseInt(supir),
          pelanggan_id: parseInt(pelanggan),
        };
  
        // Update main shipment data
        const response = await fetchWithAuth(
          `/api/pengiriman/${initialData.data.pengiriman_id}`,
          {
            method: "PATCH",
            body: JSON.stringify(data),
          }
        );
  
        if (response.ok) {
          // Handle item changes
          const itemRequests = [];
  
          // Add new items
          if (itemsToAdd.length > 0) {
            itemRequests.push(
              fetchWithAuth(`/api/detail-pengiriman`, {
                method: "POST",
                body: JSON.stringify(
                  itemsToAdd.map((item) => ({
                    barang_id: parseInt(item.barang_id),
                    jumlah_barang: parseInt(item.jumlah_barang),
                    pengiriman_id: initialData.data.pengiriman_id,
                  }))
                ),
              })
            );
          }
  
          // Update changed items
          if (itemsToUpdate.length > 0) {
            itemsToUpdate.forEach((item) => {
              itemRequests.push(
                fetchWithAuth(
                  `/api/detail-pengiriman/${item.detail_pengiriman_id}`,
                  {
                    method: "PUT",
                    body: JSON.stringify({
                      jumlah_barang: item.jumlah_barang,
                      pengiriman_id: initialData.data.pengiriman_id,
                      barang_id: item.barang_id,
                    }),
                  }
                )
              );
            });
          }
  
          // Remove deleted items
          if (itemsToRemove.length > 0) {
            itemsToRemove.forEach((item) => {
              itemRequests.push(
                fetchWithAuth(
                  `/api/detail-pengiriman/${item.detail_pengiriman_id}`,
                  {
                    method: "DELETE",
                  }
                )
              );
            });
          }
  
          // Execute all item requests
          await Promise.all(itemRequests);
          showPostRedirectAlert({
            title: "Sukses",
            text: "Pengiriman berhasil diperbarui",
            icon: "success",
            confirmButtonText: "OK",
          });
          router.push("/dashboard/pengiriman");
        } else {
          throw new Error("Gagal update pengiriman");
        }
      } catch (error) {
        showAlert({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      const data = {
        tanggal_pengiriman: new Date().toISOString().split("T")[0],
        status_pengiriman: status,
        alamat_tujuan: alamat,
        deskripsi: deskripsi,
        pembayaran: pembayaran,
        ongkir: ongkir,
        total: 0,
        kendaraan_id: parseInt(kendaraan),
        supir_id: parseInt(supir),
        pelanggan_id: parseInt(pelanggan),
      };

      try {
        const responsePengiriman = await fetchWithAuth("/api/pengiriman", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!responsePengiriman.ok) {
          throw new Error("Pastikan semua data terisi dengan benar");
        }

        const responseDetailPengiriman = await fetchWithAuth(
          `/api/detail-pengiriman`,
          {
            method: "POST",
            body: JSON.stringify([
              ...items.map((item) => ({
                jumlah_barang: item.jumlah_barang,
                barang_id: parseInt(item.barang_id),
                pengiriman_id: responsePengiriman.body.data.pengiriman_id,
              })),
            ]),
          }
        );

        if (!responseDetailPengiriman.ok) {
          throw new Error("Failed to create shipment details");
        }

        showPostRedirectAlert({
          title: "Sukses",
          text: "Pengiriman berhasil ditambahkan",
          icon: "success",
          confirmButtonText: "OK",
        });
        router.push("/dashboard/pengiriman");
      } catch (error) {
        showAlert({
          title: "Gagal Membuat Pengiriman",
          text: error.message || "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      setItems([{ jumlah_barang: 0, barang_id: "", subtotal: 0 }]);
      setSupir("");
      setPelanggan("");
      setKendaraan("");
      setAlamat("");
      setDeskripsi("");
      setPembayaran("");
      setOngkir(0);
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <VeryTopBackButton />
      <CardHeader className="relative">
        <CardTitle>
          {mode === "edit" ? "Edit Pengiriman" : "Tambah Pengiriman"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Label>Barang</Label>
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {item.barang_id
                        ? barangList.find(
                            (barang) =>
                              barang.barang_id.toString() === item.barang_id
                          )?.nama_barang
                        : "Pilih barang"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Cari barang..." />
                      <CommandList>
                        <CommandEmpty>Barang tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {barangList.map((barang) => (
                            <CommandItem
                              key={barang.barang_id}
                              value={barang.nama_barang} // Ubah dari barang_id ke nama_barang
                              onSelect={() => {
                                const newItems = [...items];
                                newItems[index] = {
                                  ...newItems[index],
                                  barang_id: barang.barang_id.toString(),
                                };
                                setItems(newItems);
                              }}
                            >
                              {barang.nama_barang}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  item.barang_id === barang.barang_id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Input
                  type="number"
                  placeholder="Jumlah"
                  min={1}
                  value={item.jumlah_barang}
                  className="w-20"
                  onChange={(e) =>
                    updateItem(index, "jumlah_barang", parseInt(e.target.value))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addItem}
            >
              Tambah Barang
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver">Supir</Label>
            <Select value={supir} onValueChange={(value) => setSupir(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih supir" />
              </SelectTrigger>
              <SelectContent>
                {memoizedSupirList.map((supir) => (
                  <SelectItem
                    key={supir.supir_id}
                    value={supir.supir_id.toString()}
                  >
                    {supir.nama_supir}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer">Pelanggan</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {pelanggan
                    ? pelangganList.find(
                        (p) => p.pelanggan_id.toString() === pelanggan
                      )?.nama_pelanggan
                    : "Pilih pelanggan"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Cari pelanggan..." />
                  <CommandList>
                    <CommandEmpty>Pelanggan tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {pelangganList.map((p) => (
                        <CommandItem
                          key={p.pelanggan_id}
                          value={p.nama_pelanggan}
                          onSelect={() =>
                            setPelanggan(p.pelanggan_id.toString())
                          }
                        >
                          {p.nama_pelanggan}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              pelanggan === p.pelanggan_id.toString()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kendaraan">Kendaraan</Label>
            <Select
              value={kendaraan}
              onValueChange={(value) => setKendaraan(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kendaraan" />
              </SelectTrigger>
              <SelectContent>
                {kendaraanList
                  .filter(
                    (kendaraan) => kendaraan.status_kendaraan === "tersedia"
                  ) // Filter kendaraan yang tersedia
                  .map((kendaraan) => (
                    <SelectItem
                      key={kendaraan.kendaraan_id}
                      value={kendaraan.kendaraan_id.toString()}
                    >
                      {kendaraan.jenis_kendaraan} | {kendaraan.plat_nomor}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              placeholder="Masukkan alamat"
              className="min-h-[100px]"
              required
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Masukkan deskripsi"
              className="min-h-[100px]"
              required
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ongkir">Ongkir</Label>
            <Input
              type="number"
              placeholder="Masukkan ongkir"
              min={0}
              value={ongkir}
              onChange={(e) => setOngkir(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pembayaran">Pembayaran</Label>
            <Select
              value={pembayaran}
              onValueChange={(value) => setPembayaran(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih pembayaran" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(STATUS_PEMBAYARAN).map((pembayaran) => (
                  <SelectItem key={pembayaran} value={pembayaran}>
                    {pembayaran}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(STATUS_PENGIRIMAN).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="resi">Resi</Label>
              <Input
                type="text"
                placeholder="Masukkan resi"
                value={initialData.data.resi}
                readOnly
              />
            </div>
          )}

          {buktiPengiriman && mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="buktiPengiriman">Bukti Pengiriman</Label>
              <img
                src={process.env.NEXT_PUBLIC_BACKEND_API_URL + buktiPengiriman}
                alt="bukti pengiriman"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Menunggu..."
              : mode === "edit"
              ? "Simpan Perubahan"
              : "Tambah Pengiriman"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
