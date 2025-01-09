// src/app/(dashboard)/dashboard/pengiriman/loading-stats.jsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full my-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-8 text-center flex flex-col items-center">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-12 w-24 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}