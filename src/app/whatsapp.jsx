import { Link, Phone } from "lucide-react";

export const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors cursor-pointer">
      <Phone size={32} className="text-white fill-white" />
    </div>
  );
};
