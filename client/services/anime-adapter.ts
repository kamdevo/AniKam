import { JikanAnime, JikanManga } from './jikan-api';
import { AnimeMedia, Status, Genre } from '@shared/anime';

// Map JIKAN status to our internal status
const mapStatus = (jikanStatus: string, airing: boolean): Status => {
  switch (jikanStatus.toLowerCase()) {
    case 'finished airing':
    case 'complete':
    case 'finished':
      return 'completed';
    case 'currently airing':
    case 'publishing':
      return airing ? 'airing' : 'completed';
    case 'not yet aired':
    case 'upcoming':
      return 'upcoming';
    case 'hiatus':
    case 'discontinued':
      return 'completed'; // Treat as completed for now
    default:
      return airing ? 'airing' : 'completed';
  }
};

// Map JIKAN genres to our internal genres
const mapGenres = (jikanGenres: Array<{ name: string }>): Genre[] => {
  const genreMap: Record<string, Genre> = {
    'Action': 'Action',
    'Adventure': 'Adventure',
    'Comedy': 'Comedy',
    'Drama': 'Drama',
    'Fantasy': 'Fantasy',
    'Horror': 'Horror',
    'Romance': 'Romance',
    'Sci-Fi': 'Sci-Fi',
    'Science Fiction': 'Sci-Fi',
    'Slice of Life': 'Slice of Life',
    'Sports': 'Sports',
    'Supernatural': 'Supernatural',
    'Thriller': 'Thriller',
    'Mystery': 'Mystery',
    'Historical': 'Historical',
    'Psychological': 'Psychological',
    'Mecha': 'Mecha',
    'Music': 'Music',
    'School': 'School'
  };

  return jikanGenres
    .map(genre => genreMap[genre.name])
    .filter((genre): genre is Genre => genre !== undefined)
    .slice(0, 6); // Limit to 6 genres for UI consistency
};

// Extract duration in minutes from JIKAN duration string
const parseDuration = (durationString: string | null): number | undefined => {
  if (!durationString) return undefined;
  
  // Examples: "24 min per ep", "2 hr 5 min", "1 hr 30 min per ep"
  const minMatch = durationString.match(/(\d+)\s*min/);
  const hrMatch = durationString.match(/(\d+)\s*hr/);
  
  let minutes = 0;
  if (hrMatch) minutes += parseInt(hrMatch[1]) * 60;
  if (minMatch) minutes += parseInt(minMatch[1]);
  
  return minutes > 0 ? minutes : undefined;
};

// Extract platforms from licensors (simplified mapping)
const mapPlatforms = (licensors: Array<{ name: string }>): string[] => {
  const platformMap: Record<string, string> = {
    'Funimation': 'Funimation',
    'Crunchyroll': 'Crunchyroll',
    'Netflix': 'Netflix',
    'Hulu': 'Hulu',
    'Adult Swim': 'Adult Swim',
    'Disney+': 'Disney+',
    'Amazon Prime Video': 'Prime Video',
    'VIZ Media': 'VIZ',
    'Sentai Filmworks': 'Sentai'
  };

  const platforms = licensors
    .map(licensor => platformMap[licensor.name] || licensor.name)
    .filter(platform => platform !== 'Unknown')
    .slice(0, 5); // Limit to 5 platforms

  // Add default platforms if none found
  if (platforms.length === 0) {
    return ['Crunchyroll', 'MyAnimeList'];
  }

  return platforms;
};

// Get age rating from JIKAN rating
const mapAgeRating = (rating: string | null): string => {
  if (!rating) return 'Not Rated';
  
  const ratingMap: Record<string, string> = {
    'G - All Ages': 'G',
    'PG - Children': 'PG',
    'PG-13 - Teens 13 or older': 'PG-13',
    'R - 17+ (violence & profanity)': 'R',
    'R+ - Mild Nudity': 'R+',
    'Rx - Hentai': 'X'
  };

  return ratingMap[rating] || rating.split(' ')[0] || 'Not Rated';
};

// Extract tags from themes and demographics
const extractTags = (
  themes: Array<{ name: string }>, 
  demographics: Array<{ name: string }>,
  source: string
): string[] => {
  const tags: string[] = [];
  
  // Add themes
  themes.forEach(theme => {
    tags.push(theme.name);
  });
  
  // Add demographics
  demographics.forEach(demo => {
    tags.push(demo.name);
  });
  
  // Add source as tag if relevant
  if (source && source !== 'Unknown') {
    tags.push(`Based on ${source}`);
  }
  
  return tags.slice(0, 8); // Limit to 8 tags
};

export function adaptJikanToAnimeMedia(jikanAnime: JikanAnime): AnimeMedia {
  const releaseYear = jikanAnime.aired?.prop?.from?.year || jikanAnime.year || new Date().getFullYear();
  const endYear = jikanAnime.aired?.prop?.to?.year || undefined;

  return {
    id: jikanAnime.mal_id.toString(),
    title: jikanAnime.title,
    titleEnglish: jikanAnime.title_english || jikanAnime.title,
    titleJapanese: jikanAnime.title_japanese || undefined,
    description: jikanAnime.synopsis?.substring(0, 200) + '...' || 'No description available.',
    synopsis: jikanAnime.synopsis || 'No synopsis available.',
    type: jikanAnime.type?.toLowerCase() === 'tv' ? 'anime' : 'anime', // For now, everything is anime
    status: mapStatus(jikanAnime.status, jikanAnime.airing),
    genres: mapGenres([...jikanAnime.genres, ...jikanAnime.explicit_genres]),
    releaseYear,
    endYear,
    episodes: jikanAnime.episodes || undefined,
    seasons: undefined, // JIKAN doesn't provide season count directly
    duration: parseDuration(jikanAnime.duration),
    rating: jikanAnime.score || 0,
    popularity: jikanAnime.popularity || 0,
    coverImage: jikanAnime.images.jpg.large_image_url || jikanAnime.images.jpg.image_url,
    bannerImage: jikanAnime.images.jpg.large_image_url || jikanAnime.images.jpg.image_url,
    trailer: jikanAnime.trailer?.youtube_id || undefined,
    studio: jikanAnime.studios[0]?.name || undefined,
    author: jikanAnime.producers[0]?.name || undefined,
    director: undefined, // JIKAN doesn't provide director info directly
    source: jikanAnime.source || undefined,
    platforms: mapPlatforms(jikanAnime.licensors),
    tags: extractTags(jikanAnime.themes, jikanAnime.demographics, jikanAnime.source),
    ageRating: mapAgeRating(jikanAnime.rating),
    malScore: jikanAnime.score || undefined
  };
}

// Adapter for manga
export function adaptJikanMangaToAnimeMedia(jikanManga: JikanManga): AnimeMedia {
  const releaseYear = jikanManga.published?.prop?.from?.year || new Date().getFullYear();
  const endYear = jikanManga.published?.prop?.to?.year || undefined;

  return {
    id: jikanManga.mal_id.toString(),
    title: jikanManga.title,
    titleEnglish: jikanManga.title_english || jikanManga.title,
    titleJapanese: jikanManga.title_japanese || undefined,
    description: jikanManga.synopsis?.substring(0, 200) + '...' || 'No description available.',
    synopsis: jikanManga.synopsis || 'No synopsis available.',
    type: 'manga',
    status: mapStatus(jikanManga.status, jikanManga.publishing),
    genres: mapGenres([...jikanManga.genres, ...jikanManga.explicit_genres]),
    releaseYear,
    endYear,
    episodes: jikanManga.chapters || undefined,
    seasons: jikanManga.volumes || undefined,
    duration: undefined, // Manga doesn't have duration
    rating: jikanManga.score || 0,
    popularity: jikanManga.popularity || 0,
    coverImage: jikanManga.images.jpg.large_image_url || jikanManga.images.jpg.image_url,
    bannerImage: jikanManga.images.jpg.large_image_url || jikanManga.images.jpg.image_url,
    trailer: undefined, // Manga doesn't have trailers
    studio: jikanManga.serializations[0]?.name || undefined, // Publisher as studio
    author: jikanManga.authors[0]?.name || undefined,
    director: undefined, // Manga doesn't have directors
    source: undefined, // Manga is the source
    platforms: ['MyAnimeList', 'MangaPlus', 'Viz Media'], // Default manga platforms
    tags: extractTags(jikanManga.themes, jikanManga.demographics, 'Manga'),
    ageRating: 'Not Rated', // Manga doesn't have age ratings in JIKAN
    malScore: jikanManga.score || undefined
  };
}

export function adaptJikanArrayToAnimeMedia(jikanAnimes: JikanAnime[]): AnimeMedia[] {
  return jikanAnimes.map(adaptJikanToAnimeMedia);
}

export function adaptJikanMangaArrayToAnimeMedia(jikanMangas: JikanManga[]): AnimeMedia[] {
  return jikanMangas.map(adaptJikanMangaToAnimeMedia);
}

// Universal adapter for mixed results
export function adaptJikanMixedToAnimeMedia(items: (JikanAnime | JikanManga)[]): AnimeMedia[] {
  return items.map(item => {
    // Check if it's manga by looking for manga-specific properties
    if ('chapters' in item || 'volumes' in item || 'publishing' in item) {
      return adaptJikanMangaToAnimeMedia(item as JikanManga);
    } else {
      return adaptJikanToAnimeMedia(item as JikanAnime);
    }
  });
}
