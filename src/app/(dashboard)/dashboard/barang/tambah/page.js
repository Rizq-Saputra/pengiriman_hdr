import BarangForm from "../barang-form";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";
export default function AddBarang() {
  return (
    <div>
      <VeryTopBackButton />
      <BarangForm mode="add" initialData={{}} />;
    </div>
  );
}
