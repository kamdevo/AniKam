import { Skeleton } from "./skeleton";
import { GlassCard } from "./glass-card";

export function AnimeCardSkeleton() {
  return (
    <GlassCard className="overflow-hidden animate-pulse group relative h-[420px] flex flex-col">
      {/* Cover Image Skeleton */}
      <div className="relative h-[280px] overflow-hidden flex-shrink-0">
        <Skeleton className="w-full h-full bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />

        {/* Type and Status badges skeleton */}
        <div className="absolute top-2 left-2 flex gap-1">
          <Skeleton className="h-5 w-12 rounded-sm" />
          <Skeleton className="h-5 w-16 rounded-sm" />
        </div>

        {/* Rating skeleton */}
        <div className="absolute top-2 right-2">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 flex-1 flex flex-col justify-between min-h-0">
        <div className="space-y-2">
          <div>
            {/* Title */}
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-3 w-3/4" />
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>

          {/* Year and episodes */}
          <div className="flex justify-between">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        <div className="space-y-2">
          {/* Progress bar skeleton (sometimes present) */}
          <div className="space-y-1 opacity-50">
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// Skeleton for trending cards (simpler design)
export function TrendingCardSkeleton() {
  return (
    <GlassCard className="overflow-hidden animate-pulse group relative">
      <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
        <Skeleton className="w-full h-full bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />

        {/* Badge skeleton */}
        <div className="absolute top-2 left-2">
          <Skeleton className="h-5 w-8 rounded-sm" />
        </div>

        {/* Rating skeleton */}
        <div className="absolute top-2 right-2">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        {/* Title overlay skeleton */}
        <div className="absolute bottom-2 left-2 right-2">
          <Skeleton className="h-4 w-full bg-white/20" />
        </div>
      </div>
    </GlassCard>
  );
}

export function AnimeCardGridSkeleton({
  count = 24,
  className,
  variant = "default",
}: {
  count?: number;
  className?: string;
  variant?: "default" | "trending";
}) {
  const SkeletonComponent =
    variant === "trending" ? TrendingCardSkeleton : AnimeCardSkeleton;

  return (
    <div
      className={
        className ||
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6"
      }
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <SkeletonComponent />
        </div>
      ))}
    </div>
  );
}
