import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-8 w-full">
      <Skeleton className="h-[250px] w-full mb-4" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
} 