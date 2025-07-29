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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeMedia, UserStatus, getUserStatusLabel } from "@shared/anime";
import { useAnimeDetails } from "@/hooks/use-anime-data";
import { LibraryStorage } from "@/lib/library-storage";
import { cn } from "@/lib/utils";

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
    }
  };

  const handleUpdateStatus = (newStatus: UserStatus) => {
    if (anime) {
      LibraryStorage.updateStatus(anime.id, newStatus);
      setSelectedStatus(newStatus);
      setIsInLibrary(true);
    }
  };

  const handleRemoveFromLibrary = () => {
    if (anime) {
      LibraryStorage.removeFromLibrary(anime.id);
      setIsInLibrary(false);
      setSelectedStatus("planning");
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

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
                {anime.trailer && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Watch Trailer</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title and Basic Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {anime.title}
                  </h1>
                  {anime.titleJapanese && (
                    <h2 className="text-xl text-white/80 mb-2">
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
                      className="border-white/30 text-white"
                    >
                      {anime.ageRating}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-white/30 text-white"
                    >
                      {anime.releaseYear}
                    </Badge>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 text-white">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{anime.rating}</span>
                  </div>
                  {anime.episodes && (
                    <div className="flex items-center gap-2">
                      <Tv className="w-5 h-5" />
                      <span>{anime.episodes} episodes</span>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{anime.duration} min</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {anime.status.charAt(0).toUpperCase() +
                        anime.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Library Actions */}
                <div className="flex flex-wrap gap-4">
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
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="paused">On Hold</SelectItem>
                          <SelectItem value="planning">
                            Plan to Watch
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAddToLibrary}
                        className="bg-anime-gradient hover:opacity-90 text-white"
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
                          <SelectItem value="completed">Completed</SelectItem>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="trailer">Trailer</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Synopsis */}
              <div className="lg:col-span-2 space-y-6">
                <GlassCard className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Synopsis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {anime.synopsis}
                  </p>
                </GlassCard>

                {/* Genres */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="border-primary/20 text-primary"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>

                {/* Tags */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-secondary/10"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Side Info */}
              <div className="space-y-6">
                {/* Statistics */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-semibold">{anime.rating}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Popularity</span>
                      <span className="font-semibold">#{anime.popularity}</span>
                    </div>
                    {anime.malScore && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">MAL Score</span>
                        <span className="font-semibold">{anime.malScore}</span>
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* Production Info */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Production</h3>
                  <div className="space-y-3">
                    {anime.studio && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Studio</span>
                        <span className="font-semibold">{anime.studio}</span>
                      </div>
                    )}
                    {anime.director && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Director</span>
                        <span className="font-semibold">{anime.director}</span>
                      </div>
                    )}
                    {anime.source && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Source</span>
                        <span className="font-semibold">{anime.source}</span>
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* Where to Watch */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Where to Watch</h3>
                  <div className="space-y-2">
                    {anime.platforms.map((platform) => (
                      <Button
                        key={platform}
                        variant="outline"
                        className="w-full justify-between hover:bg-primary/5 transition-colors"
                      >
                        {platform}
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </GlassCard>

                {/* User Score */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Your Rating</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        className="w-6 h-6 text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rate this anime to help others discover great content!
                  </p>
                </GlassCard>
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <GlassCard className="p-6">
              <h3 className="text-2xl font-bold mb-6">Detailed Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Original Title
                    </label>
                    <p className="font-semibold">
                      {anime.titleJapanese || anime.title}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      English Title
                    </label>
                    <p className="font-semibold">
                      {anime.titleEnglish || anime.title}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Type
                    </label>
                    <p className="font-semibold">{anime.type.toUpperCase()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <p className="font-semibold">
                      {anime.status.charAt(0).toUpperCase() +
                        anime.status.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Release Year
                    </label>
                    <p className="font-semibold">{anime.releaseYear}</p>
                  </div>
                  {anime.endYear && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        End Year
                      </label>
                      <p className="font-semibold">{anime.endYear}</p>
                    </div>
                  )}
                  {anime.episodes && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Episodes
                      </label>
                      <p className="font-semibold">{anime.episodes}</p>
                    </div>
                  )}
                  {anime.seasons && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Seasons
                      </label>
                      <p className="font-semibold">{anime.seasons}</p>
                    </div>
                  )}
                  {anime.duration && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Episode Duration
                      </label>
                      <p className="font-semibold">{anime.duration} minutes</p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Episodes Tab */}
          <TabsContent value="episodes">
            <GlassCard className="p-6">
              <h3 className="text-2xl font-bold mb-6">Episodes</h3>
              <p className="text-muted-foreground">
                Episode list functionality coming soon! This will include
                individual episode information, progress tracking, and
                episode-specific ratings.
              </p>
            </GlassCard>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <GlassCard className="p-6">
              <h3 className="text-2xl font-bold mb-6">Reviews & Ratings</h3>
              <p className="text-muted-foreground">
                Community reviews and ratings coming soon! Users will be able to
                write detailed reviews and rate individual aspects of the anime.
              </p>
            </GlassCard>
          </TabsContent>

          {/* Trailer Tab */}
          <TabsContent value="trailer">
            <GlassCard className="p-6">
              <h3 className="text-2xl font-bold mb-6">Official Trailer</h3>
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
                  <div className="text-6xl mb-4">🎬</div>
                  <h4 className="text-xl font-semibold mb-2">
                    No Trailer Available
                  </h4>
                  <p className="text-muted-foreground">
                    The official trailer for this anime is not currently
                    available.
                  </p>
                </div>
              )}
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
