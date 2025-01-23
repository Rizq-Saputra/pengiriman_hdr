"use client";

import BarangForm from "../../barang-form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";
export default function EditBarangPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`/api/barang/${id}`);
        setInitialData(response.body);
      } catch (error) {
        console.error("Error fetching barang data:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!initialData) return <Loading />;

  return (
    <div>
      <VeryTopBackButton />
      <BarangForm mode="edit" initialData={initialData} />;
    </div>
  );
}
