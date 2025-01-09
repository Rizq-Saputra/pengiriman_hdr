import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import PengirimanSupir from "./PengirimanSupir";


export default async function Driver() {
    return (
        <div className="p-8 w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Pengiriman Anda</CardTitle>
                </CardHeader>
            </Card>
            <PengirimanSupir />
        </div>
    )
}
