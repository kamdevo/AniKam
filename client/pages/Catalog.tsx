import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, SlidersHorizontal, Loader2 } from 'lucide-react';
import { AnimeCard } from '@/components/ui/anime-card';
import { AnimeCardGridSkeleton } from '@/components/ui/anime-card-skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Genre, MediaType, Status } from '@shared/anime';
import { useAnimeSearch } from '@/hooks/use-anime-data';
import { cn } from '@/lib/utils';

const genres: Genre[] = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports',
  'Supernatural', 'Thriller', 'Mystery', 'Historical',
  'Psychological', 'Mecha', 'Music', 'School'
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [contentType, setContentType] = useState<'anime' | 'manga' | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'tv' | 'movie' | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'airing' | 'complete' | 'upcoming' | 'all'>('all');
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'title' | 'start_date'>('score');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get('q') || '');

  // Debounce search query and update URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);

      // Update URL params
      const newSearchParams = new URLSearchParams(searchParams);
      if (searchQuery.trim()) {
        newSearchParams.set('q', searchQuery.trim());
      } else {
        newSearchParams.delete('q');
      }
      setSearchParams(newSearchParams, { replace: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchParams, setSearchParams]);

  const { data: animeData, loading, error, loadMore, hasNextPage } = useAnimeSearch({
    query: debouncedQuery || undefined,
    contentType: contentType,
    type: selectedType === 'all' ? undefined : selectedType,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    orderBy: sortBy,
    sort: 'desc',
    limit: 24,
    autoFetch: true
  });

  const handleStatusChange = (id: string, status: string) => {
    // No need for refresh key with real API data
  };

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setContentType('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedGenres([]);
    setSortBy('score');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          <span className="gradient-text">Anime & Manga</span> Catalog
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
          Discover your next favorite anime or manga from our extensive collection
        </p>
      </div>

      {/* Search and Controls */}
      <GlassCard className="p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              type="text"
              placeholder="Search for anime, manga, characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-12 text-sm sm:text-base md:text-lg h-10 sm:h-12 bg-background/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(selectedGenres.length > 0 || contentType !== 'all' || selectedType !== 'all' || selectedStatus !== 'all') && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedGenres.length + (contentType !== 'all' ? 1 : 0) + (selectedType !== 'all' ? 1 : 0) + (selectedStatus !== 'all' ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              
              {(selectedGenres.length > 0 || contentType !== 'all' || selectedType !== 'all' || selectedStatus !== 'all') && (
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  Clear All
                </Button>
              )}
            </div>

            {/* Sort and View Controls */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Highest Rated</SelectItem>
                  <SelectItem value="title">A-Z</SelectItem>
                  <SelectItem value="start_date">Latest</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Select value={contentType} onValueChange={(value) => setContentType(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Anime & Manga</SelectItem>
                      <SelectItem value="anime">Anime Only</SelectItem>
                      <SelectItem value="manga">Manga Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Format</label>
                  <Select value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Formats</SelectItem>
                      {contentType !== 'manga' && (
                        <>
                          <SelectItem value="tv">TV Series</SelectItem>
                          <SelectItem value="movie">Movies</SelectItem>
                        </>
                      )}
                      {contentType !== 'anime' && (
                        <>
                          <SelectItem value="manga">Manga</SelectItem>
                          <SelectItem value="manhwa">Manhwa</SelectItem>
                          <SelectItem value="manhua">Manhua</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="airing">Currently Airing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="hiatus">On Hiatus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleGenre(genre)}
                      className="text-xs"
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">
            Showing {animeData.length} results
            {loading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
          </p>
          {error && (
            <Badge variant="destructive" className="text-xs">
              API Error
            </Badge>
          )}
        </div>
        
        {/* Active Filters */}
        {(selectedGenres.length > 0 || contentType !== 'all' || selectedType !== 'all' || selectedStatus !== 'all') && (
          <div className="flex flex-wrap gap-2">
            {contentType !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {contentType}
                <button onClick={() => setContentType('all')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {selectedType !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {selectedType}
                <button onClick={() => setSelectedType('all')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {selectedStatus !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {selectedStatus}
                <button onClick={() => setSelectedStatus('all')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {selectedGenres.map((genre) => (
              <Badge key={genre} variant="secondary" className="gap-1">
                {genre}
                <button onClick={() => toggleGenre(genre)} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {error ? (
        <GlassCard className="p-12 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold mb-2">Failed to Load Anime</h3>
          <p className="text-muted-foreground mb-4">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </GlassCard>
      ) : loading && animeData.length === 0 ? (
        <AnimeCardGridSkeleton count={24} />
      ) : animeData.length === 0 && !loading ? (
        <GlassCard className="p-12 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </GlassCard>
      ) : (
        <>
          <div className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6'
              : 'space-y-4'
          )}>
            {animeData
              .filter((anime, index, arr) =>
                // Filter out duplicates by ID
                arr.findIndex(item => item.id === anime.id) === index
              )
              .map((anime, index) => (
                <div
                  key={`anime-${anime.id}-${index}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AnimeCard
                    anime={anime}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={loadMore}
                disabled={loading}
                className="bg-anime-gradient hover:opacity-90 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading More...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}

          {/* Show skeleton for loading more */}
          {loading && hasNextPage && animeData.length > 0 && (
            <div className="mt-8">
              <AnimeCardGridSkeleton count={8} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
