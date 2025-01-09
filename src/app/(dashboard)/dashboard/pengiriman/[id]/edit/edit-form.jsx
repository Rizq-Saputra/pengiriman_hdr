import { useState, useEffect } from "react";
import ShippingForm from "./shipping-form";

export default function EditForm({ initialData }) {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`/api/pengiriman/${initialData.id}`);
        setFormData(response.body);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [initialData.id]);

  if (loading) return <div>Loading...</div>;

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

  return (
    <ShippingForm 
      mode="edit" 
      initialData={formData}
      onDeleteItem={handleDeleteItem}
    />
  );
}