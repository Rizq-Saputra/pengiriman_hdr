import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function NotFound() {
    return (
        <Card className="w-full max-w-2xl mx-auto">
          
          <CardContent className="grid grid-cols-1 gap-4">
            <h1 className="text-2xl font-bold">Pengiriman tidak ditemukan</h1>
            <p>Pengiriman dengan ID tersebut tidak ditemukan.</p>
            <Button variant="outline" asChild>
                <Link href="/sopir">Kembali ke halaman utama</Link>
            </Button>
          </CardContent>
        </Card>
    );
}