import TableClient from "./table-client";

export const metadata = {
  title: "Pengiriman",
};

export default function PengirimanPage() {
  return (
    <div className="p-8 w-full">
      <TableClient />
    </div>
  );
}