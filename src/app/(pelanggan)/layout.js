import { Footer } from "@/components/footer";

export default function PelangganLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
