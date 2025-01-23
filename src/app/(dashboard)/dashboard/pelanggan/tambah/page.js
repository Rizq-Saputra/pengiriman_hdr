import PelangganForm from "../pelanggan-form";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";
export default function AddPelanggan() {
    return (
      <div>
        <VeryTopBackButton />
        <PelangganForm mode="add" initialData={{}} />
      </div>
    );
} 