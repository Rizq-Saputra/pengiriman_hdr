import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <Skeleton className="h-4 w-1/2 m-4" />
      <CardContent className="grid grid-cols-1 gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
} 