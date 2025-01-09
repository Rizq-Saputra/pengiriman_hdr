"use client";

import PelangganForm from "../../pelanggan-form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function EditPelangganPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`/api/pelanggan/${id}`);
        setInitialData(response.body);
      } catch (error) {
        console.error('Error fetching pelanggan data:', error);
        // Handle error appropriately
      }
    };
    fetchData();
  }, [id]);

  if (!initialData) return <Loading />;

  return <PelangganForm mode="edit" initialData={initialData} />;
} 