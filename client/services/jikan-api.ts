// JIKAN API v4 - Unofficial MyAnimeList API
// Documentation: https://docs.api.jikan.moe/

import {
  networkMonitor,
  isNetworkError,
  getNetworkErrorMessage,
} from "@/lib/network-utils";

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

// Rate limiting: JIKAN has strict rate limits (3 requests per second, 60 per minute)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple request queue to manage rate limiting
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastRequestTime = 0;
  private minDelay = 1000; // 1 second between requests to be safe

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.minDelay) {
        await delay(this.minDelay - timeSinceLastRequest);
      }

      const requestFn = this.queue.shift()!;
      this.lastRequestTime = Date.now();

      try {
        await requestFn();
      } catch (error) {
        console.error("Request failed:", error);
      }
    }

    this.processing = false;
  }
}

const requestQueue = new RequestQueue();

// Simple cache to reduce API calls
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

const apiCache = new SimpleCache();

// JIKAN API Response Types
export interface JikanAnime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
  approved: boolean;
  titles: Array<{
    type: string;
    title: string;
  }>;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
      to: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  licensors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  explicit_genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

// JIKAN Manga Response Types
export interface JikanManga {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  approved: boolean;
  titles: Array<{
    type: string;
    title: string;
  }>;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string;
  chapters: number | null;
  volumes: number | null;
  status: string;
  publishing: boolean;
  published: {
    from: string | null;
    to: string | null;
    prop: {
      from: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
      to: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
    };
    string: string;
  };
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  authors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  serializations: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  explicit_genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface JikanSearchResponse {
  data: JikanAnime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface JikanMangaSearchResponse {
  data: JikanManga[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface JikanMixedSearchResponse {
  data: (JikanAnime | JikanManga)[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface JikanAnimeResponse {
  data: JikanAnime;
}

export interface JikanMangaResponse {
  data: JikanManga;
}

export interface JikanAnimeCharacters {
  data: Array<{
    character: {
      mal_id: number;
      url: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
      name: string;
    };
    role: string;
    voice_actors: Array<{
      person: {
        mal_id: number;
        url: string;
        images: {
          jpg: {
            image_url: string;
          };
        };
        name: string;
      };
      language: string;
    }>;
  }>;
}

export interface JikanAnimeVideos {
  data: {
    promo: Array<{
      title: string;
      trailer: {
        youtube_id: string;
        url: string;
        embed_url: string;
      };
    }>;
    episodes: Array<{
      mal_id: number;
      title: string;
      episode: string;
      url: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
    }>;
    music_videos: Array<{
      title: string;
      video: {
        youtube_id: string;
        url: string;
        embed_url: string;
      };
      meta: {
        title: string;
        author: string;
      };
    }>;
  };
}

class JikanAPI {
  private async request<T>(endpoint: string, retries = 3): Promise<T> {
    // Check cache first
    const cacheKey = endpoint;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit for:", endpoint);
      return cachedData;
    }

    return requestQueue.add(async () => {
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          // Add timeout to fetch request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await fetch(`${JIKAN_BASE_URL}${endpoint}`, {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              "User-Agent": "AniKam/1.0",
            },
          });

          clearTimeout(timeoutId);

          if (response.status === 429) {
            // Rate limited, wait longer and retry
            const waitTime = Math.min(2000 * Math.pow(2, attempt), 15000); // Exponential backoff, max 15s
            console.warn(
              `Rate limited, waiting ${waitTime}ms before retry ${attempt}/${retries}`,
            );
            await delay(waitTime);
            continue;
          }

          if (!response.ok) {
            throw new Error(
              `JIKAN API Error: ${response.status} ${response.statusText}`,
            );
          }

          const data = await response.json();

          // Cache successful responses
          apiCache.set(cacheKey, data);

          return data;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          console.error(
            `JIKAN API Request failed (attempt ${attempt}/${retries}):`,
            {
              endpoint,
              error: lastError.message,
              attempt,
              isOnline: navigator.onLine,
            },
          );

          // Check if it's a network error using our utility
          const isNetError = isNetworkError(lastError);

          if (attempt < retries) {
            // Use longer waits for network errors
            const waitTime = isNetError ? 3000 * attempt : 1000 * attempt;
            console.log(
              `${isNetError ? "Network error" : "API error"} detected. Waiting ${waitTime}ms before retry...`,
            );
            await delay(waitTime);
          }
        }
      }

      // If all retries failed, provide a more helpful error message
      const finalError = lastError || new Error("Unknown error");
      const userFriendlyMessage = getNetworkErrorMessage(finalError);
      throw new Error(userFriendlyMessage);
    });
  }

  // Get anime by ID
  async getAnimeById(id: number): Promise<JikanAnime> {
    const response = await this.request<JikanAnimeResponse>(`/anime/${id}`);
    return response.data;
  }

  // Search anime
  async searchAnime(
    params: {
      q?: string;
      type?: "tv" | "movie" | "ova" | "special" | "ona" | "music";
      score?: number;
      min_score?: number;
      max_score?: number;
      status?: "airing" | "complete" | "upcoming";
      rating?: "g" | "pg" | "pg13" | "r17" | "r" | "rx";
      genres?: string; // comma-separated genre IDs
      order_by?:
        | "mal_id"
        | "title"
        | "start_date"
        | "end_date"
        | "episodes"
        | "score"
        | "scored_by"
        | "rank"
        | "popularity"
        | "members"
        | "favorites";
      sort?: "desc" | "asc";
      page?: number;
      limit?: number;
    } = {},
  ): Promise<JikanSearchResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/anime${queryString ? `?${queryString}` : ""}`;

    return await this.request<JikanSearchResponse>(endpoint);
  }

  // Get top anime
  async getTopAnime(
    params: {
      type?: "tv" | "movie" | "ova" | "special" | "ona" | "music";
      filter?: "airing" | "upcoming" | "bypopularity" | "favorite";
      page?: number;
      limit?: number;
    } = {},
  ): Promise<JikanSearchResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/top/anime${queryString ? `?${queryString}` : ""}`;

    return await this.request<JikanSearchResponse>(endpoint);
  }

  // Get seasonal anime
  async getSeasonalAnime(
    year: number,
    season: "winter" | "spring" | "summer" | "fall",
    params: {
      page?: number;
      limit?: number;
    } = {},
  ): Promise<JikanSearchResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/seasons/${year}/${season}${queryString ? `?${queryString}` : ""}`;

    return await this.request<JikanSearchResponse>(endpoint);
  }

  // Get anime characters
  async getAnimeCharacters(id: number): Promise<JikanAnimeCharacters> {
    return await this.request<JikanAnimeCharacters>(`/anime/${id}/characters`);
  }

  // Get anime videos (trailers, episodes, etc.)
  async getAnimeVideos(id: number): Promise<JikanAnimeVideos> {
    return await this.request<JikanAnimeVideos>(`/anime/${id}/videos`);
  }

  // Get current season
  async getCurrentSeason(
    params: {
      page?: number;
      limit?: number;
    } = {},
  ): Promise<JikanSearchResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/seasons/now${queryString ? `?${queryString}` : ""}`;

    return await this.request<JikanSearchResponse>(endpoint);
  }

  // Get random anime
  async getRandomAnime(): Promise<JikanAnime> {
    const response = await this.request<JikanAnimeResponse>("/random/anime");
    return response.data;
  }

  // MANGA METHODS

  // Get manga by ID
  async getMangaById(id: number): Promise<JikanManga> {
    const response = await this.request<JikanMangaResponse>(`/manga/${id}`);
    return response.data;
  }

  // Search manga
  async searchManga(
    params: {
      q?: string;
      type?:
        | "manga"
        | "novel"
        | "lightnovel"
        | "oneshot"
        | "doujin"
        | "manhwa"
        | "manhua";
      score?: number;
      min_score?: number;
      max_score?: number;
      status?:
        | "publishing"
        | "complete"
        | "hiatus"
        | "discontinued"
        | "upcoming";
      genres?: string; // comma-separated genre IDs
      order_by?:
        | "mal_id"
        | "title"
        | "start_date"
        | "end_date"
        | "chapters"
        | "volumes"
        | "score"
        | "scored_by"
        | "rank"
        | "popularity"
        | "members"
        | "favorites";
      sort?: "desc" | "asc";
      page?: number;
      limit?: number;
    } = {},
  ): Promise<JikanMangaSearchResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/manga${queryString ? `?${queryString}` : ""}`;

    return await this.request<JikanMangaSearchResponse>(endpoint);
  }

  // Get top manga
  async getTopManga(
    params: {
      type?:
        | "manga"
        | "novel"
        | "lightnovel"
        | "oneshot"
        | "doujin"
        | "manhwa"
        | "manhua";
      filter?: "publishing" | "upcoming" | "bypopularity" | "favorite";
      page?: number;
      limit?: number;
    } = {},
  ): Promise<JikanMangaSearchResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/top/manga${queryString ? `?${queryString}` : ""}`;

    return await this.request<JikanMangaSearchResponse>(endpoint);
  }

  // Search both anime and manga
  async searchMixed(
    params: {
      q?: string;
      type?: "anime" | "manga";
      page?: number;
      limit?: number;
    } = {},
  ): Promise<JikanMixedSearchResponse> {
    const { type, ...searchParams } = params;

    if (!type || type === "anime") {
      const animeResults = await this.searchAnime(searchParams);
      return {
        data: animeResults.data,
        pagination: animeResults.pagination,
      };
    } else {
      const mangaResults = await this.searchManga(searchParams);
      return {
        data: mangaResults.data,
        pagination: mangaResults.pagination,
      };
    }
  }

  // Get random manga
  async getRandomManga(): Promise<JikanManga> {
    const response = await this.request<JikanMangaResponse>("/random/manga");
    return response.data;
  }
}

export const jikanAPI = new JikanAPI();
