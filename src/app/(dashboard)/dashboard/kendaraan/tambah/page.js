import KendaraanForm from "../kendaraan-form";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";

export default function AddKendaraan() {
  return (
    <div>
      <VeryTopBackButton />
      <KendaraanForm mode="add" initialData={{}} />;
    </div>
  );
}
