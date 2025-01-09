 "use client";

import SupirForm from "../../supir-form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function EditSupirPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`/api/supir/${id}`);
        setInitialData(response.body);
      } catch (error) {
        console.error('Error fetching driver data:', error);
      }
    };
    fetchData();
  }, [id]);

  if (!initialData) return <Loading />;

  return <SupirForm mode="edit" initialData={initialData} />;
}