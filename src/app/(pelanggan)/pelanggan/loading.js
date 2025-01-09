import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <Card>
            <CardContent className="pt-6">
                <Skeleton className={`w-full`} />
                <Skeleton className={`w-full h-[400px]`} />
            </CardContent>
        </Card>
    )
}