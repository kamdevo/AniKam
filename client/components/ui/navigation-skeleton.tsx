import { Skeleton } from './skeleton';

export function NavigationSkeleton() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo skeleton */}
        <div className="mr-8">
          <Skeleton className="h-8 w-32" />
        </div>

        {/* Navigation links skeleton */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-18" />
        </div>

        {/* Search and user actions skeleton */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <Skeleton className="h-9 w-48" />
          </div>
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </nav>
  );
}
