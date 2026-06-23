import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl py-0">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />

      <CardContent className="space-y-6 p-5">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-12" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-[95%]" />
          <Skeleton className="h-6 w-[70%]" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />

          <div className="flex gap-5">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-5 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}