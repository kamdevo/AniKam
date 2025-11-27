import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Play,
  BookOpen,
  TrendingUp,
  Star,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimeCard } from "@/components/ui/anime-card";
import { AnimeCardGridSkeleton } from "@/components/ui/anime-card-skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/contexts/auth-context";
import { useTopAnime, useCurrentSeason } from "@/hooks/use-anime-data";

export default function Index() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const { data: currentSeasonAnime, loading: seasonLoading } =
    useCurrentSeason();
  const { data: topAnime, loading: topLoading } = useTopAnime({
    filter: "bypopularity",
    limit: 8,
  });

  // Initialize parallax effect
  useEffect(() => {
    let parallaxInstance: any = null;

    const initParallax = async () => {
      if (parallaxRef.current) {
        try {
          const SimpleParallax = await import("simple-parallax-js");
          const ParallaxConstructor = SimpleParallax.default || SimpleParallax;

          parallaxInstance = new ParallaxConstructor(parallaxRef.current, {
            delay: 0.6,
            transition: "cubic-bezier(0,0,0,1)",
            direction: "up",
            scale: 1.3,
          });
        } catch (error) {
          console.warn("SimpleParallax initialization failed:", error);
        }
      }
    };

    initParallax();

    // Cleanup function
    return () => {
      if (parallaxInstance && typeof parallaxInstance.destroy === "function") {
        parallaxInstance.destroy();
      } else if (parallaxRef.current) {
        parallaxRef.current.style.transform = "";
      }
    };
  }, []);

  const featuredAnime = currentSeasonAnime.slice(0, 6);
  const trendingAnime = topAnime.slice(0, 8);

  const handleExploreClick = () => {
    if (isAuthenticated) {
      navigate("/catalog");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLibraryClick = () => {
    if (isAuthenticated) {
      navigate("/library");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    navigate("/catalog");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Image with Parallax */}
        <img
          ref={parallaxRef}
          src="https://w.wallhaven.cc/full/57/wallhaven-571998.png"
          alt="Anime Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 py-20 z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Main heading */}
            {/* Welcome message for authenticated users */}
            {isAuthenticated && user && (
              <div className="mb-8 animate-fade-in">
                <GlassCard className="inline-block px-6 py-3 backdrop-blur-xl bg-white/50 dark:bg-background/30 border-white/20">
                  <div className="flex items-center gap-2 text-lg text-foreground dark:text-white">
                    <span>Welcome back, </span>
                    <span className="font-semibold text-primary dark:text-primary-light">
                      {user.username}
                    </span>
                    {user.isDemo && (
                      <Badge variant="secondary" className="ml-2">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Demo
                      </Badge>
                    )}
                  </div>
                </GlassCard>
              </div>
            )}

            <div className="space-y-4 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold drop-shadow-lg leading-tight">
                <span className="text-white">Your Ultimate</span>
                <br />
                <span className="text-white drop-shadow-md">
                  Anime Library
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-2xl mx-auto drop-shadow-md px-4 sm:px-0">
                Discover, track, and organize your anime and manga collection
                with style. Join thousands of otaku in building the perfect
                digital library.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8"
                onClick={handleExploreClick}
              >
                <Play className="w-5 h-5 mr-2" />
                {isAuthenticated ? "Explore Catalog" : "Get Started"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-0 hover:bg-primary/5"
                onClick={handleLibraryClick}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                My Library
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 animate-fade-in-up px-4 sm:px-0">
              <GlassCard className="text-center p-4 sm:p-6 backdrop-blur-xl bg-white/50 dark:bg-background/30 border-white/20">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  10K+
                </div>
                <div className="text-sm sm:text-base text-foreground dark:text-white/90">
                  Anime & Manga
                </div>
              </GlassCard>
              <GlassCard className="text-center p-4 sm:p-6 backdrop-blur-xl bg-white/50 dark:bg-background/30 border-white/20">
                <div className="text-2xl sm:text-3xl font-bold text-secondary">
                  500K+
                </div>
                <div className="text-sm sm:text-base text-foreground dark:text-white/90">
                  Happy Users
                </div>
              </GlassCard>
              <GlassCard className="text-center p-4 sm:p-6 backdrop-blur-xl bg-white/50 dark:bg-background/30 border-white/20">
                <div className="text-2xl sm:text-3xl font-bold text-accent">
                  1M+
                </div>
                <div className="text-sm sm:text-base text-foreground dark:text-white/90">
                  Reviews
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Featured This Season
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Hand-picked anime and manga you shouldn't miss
              </p>
            </div>
            <Link to="/catalog">
              <Button variant="ghost" className="group w-full sm:w-auto">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {seasonLoading ? (
            <AnimeCardGridSkeleton
              count={6}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
              {featuredAnime
                .filter(
                  (anime, index, arr) =>
                    arr.findIndex((item) => item.id === anime.id) === index
                )
                .map((anime, index) => (
                  <AnimeCard
                    key={`featured-${anime.id}-${index}`}
                    anime={anime}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-3xl font-bold">Trending Now</h2>
                <p className="text-muted-foreground">
                  Most popular anime and manga this week
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Star className="w-3 h-3 mr-1" />
              Top Rated
            </Badge>
          </div>

          {topLoading ? (
            <AnimeCardGridSkeleton
              count={8}
              variant="trending"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {trendingAnime
                .filter(
                  (anime, index, arr) =>
                    arr.findIndex((item) => item.id === anime.id) === index
                )
                .map((anime, index) => (
                  <Link
                    key={`trending-${anime.id}-${index}`}
                    to={`/anime/${anime.id}`}
                    className="block"
                  >
                    <GlassCard
                      variant="hover"
                      className="relative group cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                        <img
                          src={anime.coverImage}
                          alt={anime.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2">
                            <h3 className="text-white text-sm font-medium line-clamp-2">
                              {anime.title}
                            </h3>
                          </div>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-primary text-white"
                          >
                            #{anime.popularity}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-white">
                              {anime.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Start Your Journey
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link to="/catalog" className="group">
              <GlassCard
                variant="hover"
                className="p-8 text-center space-y-4 h-full"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Discover New Anime</h3>
                <p className="text-muted-foreground">
                  Explore thousands of anime and manga with advanced filters and
                  recommendations
                </p>
              </GlassCard>
            </Link>

            <Link to="/library" className="group">
              <GlassCard
                variant="hover"
                className="p-8 text-center space-y-4 h-full"
              >
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Build Your Library</h3>
                <p className="text-muted-foreground">
                  Organize your collection, track progress, and never lose track
                  of what you're watching
                </p>
              </GlassCard>
            </Link>

            <div className="group">
              <GlassCard
                variant="hover"
                className="p-8 text-center space-y-4 h-full"
              >
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Rate & Review</h3>
                <p className="text-muted-foreground">
                  Share your thoughts and discover what the community thinks
                  about your favorites
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
