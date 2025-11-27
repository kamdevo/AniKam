import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Star,
  Calendar,
  Clock,
  Tv,
  BookOpen,
  ExternalLink,
  Plus,
  Check,
  Heart,
  Pause,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimeDetailsSkeleton } from "@/components/ui/anime-details-skeleton";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimeMedia, UserStatus, getUserStatusLabel } from "@shared/anime";
import { useAnimeDetails } from "@/hooks/use-anime-data";
import { LibraryStorage } from "@/lib/library-storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AnimeDetailsProps {
  type?: "anime" | "manga";
}

export default function AnimeDetails({ type }: AnimeDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { anime, loading, error } = useAnimeDetails(id!, type);
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>("planning");
  const [isInLibrary, setIsInLibrary] = useState(false);

  useEffect(() => {
    if (anime && id) {
      const libraryItem = LibraryStorage.getLibraryItem(id);
      setIsInLibrary(LibraryStorage.isInLibrary(id));
      if (libraryItem) {
        setSelectedStatus(libraryItem.userStatus);
      }
    }
  }, [anime, id]);

  const handleAddToLibrary = () => {
    if (anime) {
      LibraryStorage.addToLibrary(anime, selectedStatus);
      setIsInLibrary(true);
      toast.success(
        `Added to library as ${getUserStatusLabel(selectedStatus)}`
      );
    }
  };

  const handleUpdateStatus = (newStatus: UserStatus) => {
    if (anime) {
      LibraryStorage.updateStatus(anime.id, newStatus);
      setSelectedStatus(newStatus);
      setIsInLibrary(true);
      toast.success(`Status updated to ${getUserStatusLabel(newStatus)}`);
    }
  };

  const handleRemoveFromLibrary = () => {
    if (anime) {
      LibraryStorage.removeFromLibrary(anime.id);
      setIsInLibrary(false);
      setSelectedStatus("planning");
      toast.success("Removed from library");
    }
  };

  // Loading state
  if (loading) {
    return <AnimeDetailsSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GlassCard className="p-12 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Failed to Load Anime</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            <Button variant="outline" onClick={() => navigate("/catalog")}>
              Back to Catalog
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Not found state
  if (!anime) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GlassCard className="p-12 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-4">Anime Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The anime you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/catalog")}>Back to Catalog</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src={anime.bannerImage}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Back Button */}
        <Button
          variant="ghost"
          className="absolute top-2 sm:top-4 left-2 sm:left-4 glass hover:bg-white/20 text-xs sm:text-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        {/* Main Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-end">
              {/* Cover Image */}
              <div className="relative group mx-auto md:mx-0">
                <img
                  src={anime.coverImage}
                  alt={anime.title}
                  className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 object-cover rounded-xl shadow-2xl transition-transform group-hover:scale-105"
                />
              </div>

              {/* Title and Basic Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                    {anime.title}
                  </h1>
                  {anime.titleJapanese && (
                    <h2 className="text-lg sm:text-xl text-white/80 mb-2">
                      {anime.titleJapanese}
                    </h2>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-primary text-white"
                    >
                      {anime.type.toUpperCase()}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-white/30 text-white bg-white/10"
                    >
                      {anime.ageRating}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-white/30 text-white bg-white/10"
                    >
                      {anime.releaseYear}
                    </Badge>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 sm:gap-6 text-white text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{anime.rating}</span>
                  </div>
                  {anime.episodes && (
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{anime.episodes} episodes</span>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{anime.duration} min</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>
                      {anime.status.charAt(0).toUpperCase() +
                        anime.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Library Actions */}
                <AuthRequiredWrapper onSuccess={() => {}}>
                  {({ executeAction, isAuthenticated }) => (
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {!isInLibrary ? (
                        <>
                          <Select
                            value={selectedStatus}
                            onValueChange={(value) =>
                              setSelectedStatus(value as UserStatus)
                            }
                          >
                            <SelectTrigger className="w-40 bg-glass/50 border-white/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="watching">Watching</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="paused">On Hold</SelectItem>
                              <SelectItem value="planning">
                                Plan to Watch
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => {
                              if (isAuthenticated) {
                                handleAddToLibrary();
                              } else {
                                executeAction(handleAddToLibrary);
                              }
                            }}
                            className="bg-primary hover:bg-primary/90 text-white"
                            title={
                              !isAuthenticated
                                ? "Sign in to add to library"
                                : "Add to library"
                            }
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Library
                          </Button>
                        </>
                      ) : (
                        <>
                          <Select
                            value={selectedStatus}
                            onValueChange={(value) =>
                              handleUpdateStatus(value as UserStatus)
                            }
                          >
                            <SelectTrigger className="w-40 bg-glass/50 border-white/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="watching">Watching</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="paused">On Hold</SelectItem>
                              <SelectItem value="planning">
                                Plan to Watch
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            onClick={handleRemoveFromLibrary}
                            className="border-white/30 text-white hover:bg-white/10"
                          >
                            Remove from Library
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </AuthRequiredWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Content Layout */}
      <div className="container mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Synopsis */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Synopsis</h2>
          <GlassCard className="p-6">
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              {anime.synopsis}
            </p>
          </GlassCard>
        </section>

        {/* Information Grid */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Basic Information */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-right">
                      {anime.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-right">
                      {anime.status.charAt(0).toUpperCase() +
                        anime.status.slice(1)}
                    </span>
                  </div>
                  {anime.episodes && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Episodes</span>
                      <span className="font-medium text-right">
                        {anime.episodes}
                      </span>
                    </div>
                  )}
                  {anime.seasons && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Seasons</span>
                      <span className="font-medium text-right">
                        {anime.seasons}
                      </span>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-right">
                        {anime.duration} min
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Release Year</span>
                    <span className="font-medium text-right">
                      {anime.releaseYear}
                    </span>
                  </div>
                  {anime.endYear && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">End Year</span>
                      <span className="font-medium text-right">
                        {anime.endYear}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Age Rating</span>
                    <span className="font-medium text-right">
                      {anime.ageRating}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Production Info */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-secondary">
                  Production
                </h3>
                <div className="space-y-3 text-sm">
                  {anime.studio && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Studio</span>
                      <span className="font-medium text-right">
                        {anime.studio}
                      </span>
                    </div>
                  )}
                  {anime.director && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Director</span>
                      <span className="font-medium text-right">
                        {anime.director}
                      </span>
                    </div>
                  )}
                  {anime.source && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Source</span>
                      <span className="font-medium text-right">
                        {anime.source}
                      </span>
                    </div>
                  )}
                  {anime.titleEnglish && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">
                        English Title
                      </span>
                      <span className="font-medium text-right">
                        {anime.titleEnglish}
                      </span>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Statistics Sidebar */}
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-accent">
                  Statistics
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{anime.rating}/10</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Popularity</span>
                    <span className="font-semibold">#{anime.popularity}</span>
                  </div>
                  {anime.malScore && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">MAL Score</span>
                      <span className="font-semibold">{anime.malScore}</span>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* User Rating */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Rating</h3>
                <div className="flex flex-wrap gap-1 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      className="w-6 h-6 text-yellow-400 hover:text-yellow-300 transition-colors"
                      title={`Rate ${star}/10`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Rate this anime to help others discover great content!
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Genres and Tags */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <Badge
                  key={genre}
                  className="bg-primary/10 text-primary border border-0"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {anime.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-secondary/10 text-secondary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Where to Watch */}
        {anime.platforms && anime.platforms.length > 0 && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Where to Watch
            </h2>
            <GlassCard className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {anime.platforms.map((platform) => (
                  <Button
                    key={platform}
                    variant="outline"
                    className="w-full justify-between hover:bg-primary/5 hover:border-primary/30 transition-colors"
                  >
                    <span>{platform}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </GlassCard>
          </section>
        )}

        {/* Episodes Section (Placeholder) */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Episodes</h2>
          <GlassCard className="p-8 text-center">
            <div className="text-4xl mb-3">📺</div>
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground text-sm">
              Episode list functionality is in development. This will include
              individual episode information, progress tracking, and
              episode-specific ratings.
            </p>
          </GlassCard>
        </section>

        {/* Reviews Section (Placeholder) */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Community Reviews
          </h2>
          <GlassCard className="p-8 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground text-sm">
              Community reviews and ratings are in development. Users will be
              able to write detailed reviews and rate individual aspects of the
              anime.
            </p>
          </GlassCard>
        </section>

        {/* Official Trailer - Last Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Official Trailer
          </h2>
          <GlassCard className="p-6">
            {anime.trailer ? (
              <div className="relative bg-black rounded-lg overflow-hidden w-full aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${anime.trailer}`}
                  title="Anime Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-5xl mb-3">🎬</div>
                <h3 className="text-lg font-semibold mb-2">
                  No Trailer Available
                </h3>
                <p className="text-muted-foreground text-sm">
                  The official trailer for this anime is not currently
                  available.
                </p>
              </div>
            )}
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
