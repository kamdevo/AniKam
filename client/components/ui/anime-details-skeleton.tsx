import { Skeleton } from "./skeleton";
import { GlassCard } from "./glass-card";

export function AnimeDetailsSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Skeleton */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <Skeleton className="w-full h-full" />

        {/* Back Button Skeleton */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <Skeleton className="h-8 sm:h-10 w-16 sm:w-24 rounded-lg" />
        </div>

        {/* Main Info Overlay Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-end">
              {/* Cover Image Skeleton */}
              <div className="mx-auto md:mx-0">
                <Skeleton className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 rounded-xl" />
              </div>

              {/* Title and Info Skeleton */}
              <div className="flex-1 space-y-4">
                {/* Main Title */}
                <div className="space-y-2">
                  <Skeleton className="h-8 sm:h-12 md:h-16 w-full max-w-md bg-white/20" />
                  <Skeleton className="h-5 sm:h-6 w-3/4 max-w-xs bg-white/20" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16 rounded-full bg-white/20" />
                  <Skeleton className="h-6 w-12 rounded-full bg-white/20" />
                  <Skeleton className="h-6 w-14 rounded-full bg-white/20" />
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6">
                  <Skeleton className="h-5 w-12 bg-white/20" />
                  <Skeleton className="h-5 w-20 bg-white/20" />
                  <Skeleton className="h-5 w-16 bg-white/20" />
                  <Skeleton className="h-5 w-18 bg-white/20" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-10 w-40 rounded-lg bg-white/20" />
                  <Skeleton className="h-10 w-32 rounded-lg bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Tabs Skeleton */}
          <div className="grid w-full grid-cols-5 max-w-2xl gap-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Tab Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Synopsis Card */}
              <GlassCard className="p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </GlassCard>

              {/* Genres Card */}
              <GlassCard className="p-6">
                <Skeleton className="h-6 w-20 mb-4" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                  <Skeleton className="h-6 w-18 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-22 rounded-full" />
                </div>
              </GlassCard>

              {/* Tags Card */}
              <GlassCard className="p-6">
                <Skeleton className="h-6 w-16 mb-4" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-18 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
              </GlassCard>
            </div>

            {/* Right Side - Statistics and Info */}
            <div className="space-y-6">
              {/* Statistics Card */}
              <GlassCard className="p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-18" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </GlassCard>

              {/* Production Info Card */}
              <GlassCard className="p-6">
                <Skeleton className="h-6 w-28 mb-4" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-18" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </GlassCard>

              {/* Where to Watch Card */}
              <GlassCard className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full rounded-lg" />
                  <Skeleton className="h-8 w-3/4 rounded-lg" />
                  <Skeleton className="h-8 w-4/5 rounded-lg" />
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
