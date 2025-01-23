import SupirForm from "../supir-form";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";
export default function AddSupir() {
  return (
    <div>
      <VeryTopBackButton />
      <SupirForm mode="add" initialData={{}} />;
    </div>
  );
}
