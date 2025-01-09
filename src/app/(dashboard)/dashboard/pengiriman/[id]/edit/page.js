"use client";

import ShippingForm from "../../shipping-form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function EditShippingPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`/api/pengiriman/${id}`);
        setInitialData(response.body);
      } catch (error) {
        console.error('Error fetching driver data:', error);
      }
    };
    fetchData();
  }, [id]);

  if (!initialData) return <Loading />;

  const handleDeleteItem = async (itemId) => {
    try {
      await fetchWithAuth(`/api/barang/${itemId}`, {
        method: "DELETE"
      });
      // Update formData state to remove deleted item
      setFormData(prev => ({
        ...prev,
        DetailPengiriman: prev.DetailPengiriman.filter(item => item.id !== itemId)
      }));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return <ShippingForm mode="edit" initialData={initialData}  onDeleteItem={handleDeleteItem}/>;
}
