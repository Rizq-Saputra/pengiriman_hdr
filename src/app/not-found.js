// pages/404.js
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Image 
      width={400}
      height={100}
      src="/halamannotfound.png"
      alt="Halaman tidak ditemukan"
      />
      <Link className='mt-5' href="/">
        <Button variant="destructive" className="font-bold">Kembali Ke halaman utama</Button>
      </Link>
    </div>
  );
}
