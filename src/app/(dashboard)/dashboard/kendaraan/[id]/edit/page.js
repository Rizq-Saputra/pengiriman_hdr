"use client";

import KendaraanForm from "../../kendaraan-form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";

export default function EditKendaraanPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchData = async () => {
      // Simulate API call
      try {
        const response = await fetchWithAuth(`/api/kendaraan/${id}`);
        setInitialData(response.body);
      } catch (error) {
        console.error('Error fetching kendaraan data:', error);
      }
    };
    fetchData();
  }, [id]);

  if (!initialData) return <Loading />;

  return (
  <div>
      <VeryTopBackButton />

  <KendaraanForm mode="edit" initialData={initialData} />;
  </div>);
} 