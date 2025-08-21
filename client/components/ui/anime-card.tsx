import { useNavigate } from "react-router-dom";
import { Star, Play, BookOpen, Heart, Plus, Check } from "lucide-react";
import {
  AnimeMedia,
  getUserStatusColor,
  getUserStatusLabel,
} from "@shared/anime";
import { LibraryStorage } from "@/lib/library-storage";
import { AuthRequiredWrapper } from "../auth-required-wrapper";
import { GlassCard } from "./glass-card";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AnimeCardProps {
  anime: AnimeMedia;
  onStatusChange?: (id: string, status: string) => void;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

export function AnimeCard({
  anime,
  onStatusChange,
  onToggleFavorite,
  className,
}: AnimeCardProps) {
  const navigate = useNavigate();
  const libraryItem = LibraryStorage.getLibraryItem(anime.id);
  const isInLibrary = LibraryStorage.isInLibrary(anime.id);

  const handleCardClick = () => {
    const route =
      anime.type === "manga" ? `/manga/${anime.id}` : `/anime/${anime.id}`;
    navigate(route);
  };

  return (
    <AuthRequiredWrapper
      onSuccess={() => {
        toast.success("Added to library!");
      }}
    >
      {({ executeAction, isAuthenticated }) => {
        const handleStatusChange = (newStatus: string) => {
          const performAction = () => {
            if (isInLibrary) {
              LibraryStorage.updateStatus(anime.id, newStatus as any);
            } else {
              LibraryStorage.addToLibrary(anime, newStatus as any);
            }
            onStatusChange?.(anime.id, newStatus);
          };

          // Si el usuario está autenticado o ya tiene el item en biblioteca, ejecutar directamente
          if (isAuthenticated || isInLibrary) {
            performAction();
          } else {
            // Si no está autenticado, requerir autenticación
            executeAction(performAction);
          }
        };

        return (
          <GlassCard
            variant="hover"
            className={cn(
              "group relative overflow-hidden cursor-pointer h-[420px] flex flex-col",
              className
            )}
            onClick={handleCardClick}
          >
            {/* Cover Image */}
            <div className="relative h-[280px] overflow-hidden flex-shrink-0">
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Format icon */}
              <div className="absolute top-2 left-2">
                <Badge
                  variant={anime.type === "anime" ? "default" : "secondary"}
                  className="text-xs px-2 py-0.5 bg-black/60 text-white border-0 backdrop-blur-sm"
                >
                  {anime.type === "anime" ? (
                    <Play className="w-3 h-3 mr-1" />
                  ) : (
                    <BookOpen className="w-3 h-3 mr-1" />
                  )}
                  {anime.type.toUpperCase()}
                </Badge>
              </div>

              {/* Status badge */}
              {(libraryItem?.userStatus || anime.userStatus) && (
                <div className="absolute top-2 left-2 mt-8">
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 border-0 backdrop-blur-sm"
                    style={{
                      backgroundColor: `${getUserStatusColor(libraryItem?.userStatus || anime.userStatus!)}20`,
                      color: getUserStatusColor(
                        libraryItem?.userStatus || anime.userStatus!
                      ),
                      borderColor: getUserStatusColor(
                        libraryItem?.userStatus || anime.userStatus!
                      ),
                    }}
                  >
                    {getUserStatusLabel(
                      libraryItem?.userStatus || anime.userStatus!
                    )}
                  </Badge>
                </div>
              )}

              {/* Rating */}
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-white font-medium">
                    {anime.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 flex-1 flex flex-col justify-between min-h-0">
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {anime.title}
                  </h3>
                  {anime.titleEnglish && anime.titleEnglish !== anime.title && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {anime.titleEnglish}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {anime.genres.slice(0, 2).map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="text-xs px-2 py-0.5 border-primary/20 text-primary/80"
                    >
                      {genre}
                    </Badge>
                  ))}
                  {anime.genres.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0.5 border-muted text-muted-foreground"
                    >
                      +{anime.genres.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{anime.releaseYear}</span>
                  <span>
                    {anime.episodes
                      ? `${anime.episodes} eps`
                      : `${anime.chapters} ch`}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {/* Progress bar for user's current status */}
                {(libraryItem?.userStatus === "watching" ||
                  libraryItem?.userStatus === "reading" ||
                  anime.userStatus === "watching" ||
                  anime.userStatus === "reading") &&
                  (libraryItem?.userProgress || anime.userProgress) && (
                    <div className="space-y-1">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${((libraryItem?.userProgress || anime.userProgress || 0) / (anime.episodes || anime.chapters || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {libraryItem?.userProgress || anime.userProgress} /{" "}
                        {anime.episodes || anime.chapters}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </GlassCard>
        );
      }}
    </AuthRequiredWrapper>
  );
}
