import SopirForm from "../sopir-form";
import { VeryTopBackButton } from "@/components/ui/very-top-back-button";
export default function AddSupir() {
  return (
    <div>
      <VeryTopBackButton />
      <SopirForm mode="add" initialData={{}} />;
    </div>
  );
}
