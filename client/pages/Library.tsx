import { useState, useEffect } from "react";
import {
  Play,
  Check,
  Pause,
  Clock,
  Star,
  BarChart3,
  LogIn,
} from "lucide-react";
import { AnimeCard } from "@/components/ui/anime-card";
import { AnimeCardGridSkeleton } from "@/components/ui/anime-card-skeleton";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/contexts/auth-context";
import { UserStatus, getUserStatusLabel } from "@shared/anime";
import { LibraryStorage, UserLibraryItem } from "@/lib/library-storage";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const statusIcons = {
  watching: Play,
  completed: Check,
  paused: Pause,
  planning: Clock,
};

const statusColors = {
  watching: "text-success",
  completed: "text-primary",
  paused: "text-warning",
  planning: "text-secondary",
};

export default function Library() {
  const { isAuthenticated } = useAuth();
  const [userLibrary, setUserLibrary] = useState<UserLibraryItem[]>([]);
  const [activeTab, setActiveTab] = useState<UserStatus>("watching");
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load library from localStorage on component mount
  useEffect(() => {
    // Simulate loading delay for better UX
    const loadLibrary = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
      const library = LibraryStorage.getLibrary();
      setUserLibrary(library);
      setIsLoading(false);
    };

    loadLibrary();
  }, []);

  const libraryStats = LibraryStorage.getLibraryStats();
  const filteredLibrary = userLibrary.filter(
    (anime) => anime.userStatus === activeTab
  );

  const handleStatusChange = (id: string, newStatus: string) => {
    LibraryStorage.updateStatus(id, newStatus as UserStatus);
    setUserLibrary(LibraryStorage.getLibrary());
  };

  const refreshLibrary = () => {
    setUserLibrary(LibraryStorage.getLibrary());
  };

  // Si no está autenticado, mostrar mensaje de autenticación requerida
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            My <span className="text-primary">Library</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Track your anime and manga progress, organize your collection
          </p>
        </div>

        <GlassCard className="p-8 sm:p-12 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
              <LogIn className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Sign in to access your library
              </h2>
              <p className="text-muted-foreground">
                Create an account or sign in to start building your personal
                anime and manga collection. Track your progress, organize your
                watchlist, and never lose track of what you're reading or
                watching.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-primary hover:opacity-90 text-white"
                size="lg"
              >
                Sign In to Continue
              </Button>
              <p className="text-xs text-muted-foreground">
                Browse our catalog freely, sign in when you're ready to start
                tracking!
              </p>
            </div>
          </div>
        </GlassCard>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            // Recargar la biblioteca después del login exitoso
            const library = LibraryStorage.getLibrary();
            setUserLibrary(library);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          My <span className="text-primary">Library</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
          Track your anime and manga progress, organize your collection
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <GlassCard className="p-3 sm:p-4 text-center">
          <div className="text-lg sm:text-2xl font-bold text-success">
            {libraryStats.watching}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Watching
          </div>
        </GlassCard>
        <GlassCard className="p-3 sm:p-4 text-center">
          <div className="text-lg sm:text-2xl font-bold text-primary">
            {libraryStats.completed}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Completed
          </div>
        </GlassCard>
        <GlassCard className="p-3 sm:p-4 text-center">
          <div className="text-lg sm:text-2xl font-bold text-warning">
            {libraryStats.paused}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            On Hold
          </div>
        </GlassCard>
        <GlassCard className="p-3 sm:p-4 text-center">
          <div className="text-lg sm:text-2xl font-bold text-secondary">
            {libraryStats.planning}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Planning
          </div>
        </GlassCard>
        <GlassCard className="p-3 sm:p-4 text-center">
          <div className="text-lg sm:text-2xl font-bold text-primary-subtle">
            {libraryStats.totalEpisodes}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Episodes
          </div>
        </GlassCard>
        <GlassCard className="p-3 sm:p-4 text-center">
          <div className="text-lg sm:text-2xl font-bold text-primary-subtle">
            {libraryStats.averageRating.toFixed(1)}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Avg Rating
          </div>
        </GlassCard>
      </div>

      {/* Library Tabs */}
      <GlassCard className="p-4 sm:p-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as UserStatus)}
        >
          <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6">
            {(
              ["watching", "completed", "paused", "planning"] as UserStatus[]
            ).map((status) => {
              const Icon = statusIcons[status];
              const count = libraryStats[status];

              return (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">
                    {getUserStatusLabel(status)}
                  </span>
                  <span className="sm:hidden text-xs">
                    {status === "watching"
                      ? "Watch"
                      : status === "completed"
                        ? "Done"
                        : status === "paused"
                          ? "Hold"
                          : "Plan"}
                  </span>
                  <Badge variant="secondary" className="ml-0.5 sm:ml-1 text-xs">
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(
            ["watching", "completed", "paused", "planning"] as UserStatus[]
          ).map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              {filteredLibrary.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold mb-2">
                    No anime in {getUserStatusLabel(status).toLowerCase()}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {status === "watching" &&
                      "Start watching some anime to see them here!"}
                    {status === "completed" &&
                      "Complete some anime to build your collection!"}
                    {status === "paused" &&
                      "Anime you put on hold will appear here."}
                    {status === "planning" &&
                      "Add anime to your plan to watch list!"}
                  </p>
                  <Button asChild>
                    <Link to="/catalog">Browse Catalog</Link>
                  </Button>
                </div>
              ) : (
                <>
                  {/* Progress Summary for Watching */}
                  {status === "watching" && filteredLibrary.length > 0 && (
                    <GlassCard className="p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-success" />
                        <h3 className="font-semibold">Current Progress</h3>
                      </div>
                      <div className="space-y-2">
                        {filteredLibrary.map((anime) => (
                          <div
                            key={anime.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="truncate flex-1 mr-4">
                              {anime.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div
                                  className="bg-success h-2 rounded-full"
                                  style={{
                                    width: `${((anime.userProgress || 0) / (anime.episodes || 1)) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-muted-foreground min-w-0">
                                {anime.userProgress}/{anime.episodes}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  )}

                  {/* Anime Grid */}
                  {isLoading ? (
                    <AnimeCardGridSkeleton count={12} />
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
                      {filteredLibrary
                        .filter(
                          (anime, index, arr) =>
                            arr.findIndex((item) => item.id === anime.id) ===
                            index
                        )
                        .map((anime, index) => (
                          <div
                            key={`library-${anime.id}-${index}`}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <AnimeCard
                              anime={anime}
                              onStatusChange={(id, status) => {
                                handleStatusChange(id, status);
                                refreshLibrary();
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </GlassCard>
    </div>
  );
}
