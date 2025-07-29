import { Skeleton } from "./skeleton";
import { GlassCard } from "./glass-card";

export function AnimeCardSkeleton() {
  return (
    <GlassCard className="overflow-hidden animate-pulse group relative">
      {/* Cover Image Skeleton */}
      <div className="relative aspect-[3/4] overflow-hidden">
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
      <div className="p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-2">
        {/* Title */}
        <div className="space-y-1">
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-3 w-3/4 hidden sm:block" />
        </div>

        {/* Genres (hidden on mobile) */}
        <div className="flex gap-1 hidden sm:flex">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-8 rounded-full" />
        </div>

        {/* Year and episodes */}
        <div className="flex justify-between">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>

        {/* Progress bar skeleton (sometimes present) */}
        <div className="space-y-1 opacity-50">
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Quick actions (hidden on mobile, shown on hover) */}
        <div className="flex gap-0.5 sm:gap-1 pt-1 hidden sm:flex">
          <Skeleton className="h-6 sm:h-7 flex-1 rounded-sm" />
          <Skeleton className="h-6 sm:h-7 flex-1 rounded-sm" />
          <Skeleton className="h-6 sm:h-7 flex-1 rounded-sm" />
          <Skeleton className="h-6 sm:h-7 flex-1 rounded-sm" />
        </div>
      </div>
    </GlassCard>
  );
}

export function AnimeCardGridSkeleton({ count = 24 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <AnimeCardSkeleton />
        </div>
      ))}
    </div>
  );
}
