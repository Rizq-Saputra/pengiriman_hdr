import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
        {[1, 2, 3].map((index) => (
          <Card key={index} className="p-8">
            <CardHeader className="p-0">
              <Skeleton className="w-full h-48" />
            </CardHeader>
            <CardContent className="flex gap-2 mt-4">
              <div className="flex flex-col text-left w-full">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
    </>
  );
}