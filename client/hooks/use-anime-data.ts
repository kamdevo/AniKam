import { useState, useEffect } from "react";
import { jikanAPI } from "@/services/jikan-api";
import {
  adaptJikanToAnimeMedia,
  adaptJikanArrayToAnimeMedia,
  adaptJikanMangaToAnimeMedia,
  adaptJikanMangaArrayToAnimeMedia,
  adaptJikanMixedToAnimeMedia,
} from "@/services/anime-adapter";
import { fallbackAnimeData } from "@/services/fallback-data";
import {
  isNetworkError,
  getNetworkErrorMessage,
  shouldUseFallbackData,
} from "@/lib/network-utils";
import { AnimeMedia } from "@shared/anime";

export interface UseAnimeDataState {
  data: AnimeMedia[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  currentPage: number;
}

export interface UseAnimeDataOptions {
  query?: string;
  contentType?: "anime" | "manga" | "all"; // New option for content type
  type?:
    | "tv"
    | "movie"
    | "ova"
    | "special"
    | "ona"
    | "music"
    | "manga"
    | "novel"
    | "lightnovel"
    | "oneshot"
    | "doujin"
    | "manhwa"
    | "manhua";
  status?:
    | "airing"
    | "complete"
    | "upcoming"
    | "publishing"
    | "hiatus"
    | "discontinued";
  genres?: string;
  orderBy?:
    | "mal_id"
    | "title"
    | "start_date"
    | "end_date"
    | "episodes"
    | "chapters"
    | "volumes"
    | "score"
    | "scored_by"
    | "rank"
    | "popularity"
    | "members"
    | "favorites";
  sort?: "desc" | "asc";
  limit?: number;
  autoFetch?: boolean;
}

export function useAnimeSearch(options: UseAnimeDataOptions = {}) {
  const [state, setState] = useState<UseAnimeDataState>({
    data: [],
    loading: false,
    error: null,
    hasNextPage: false,
    currentPage: 1,
  });

  const fetchAnime = async (page: number = 1, append: boolean = false) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      let adaptedData: AnimeMedia[] = [];

      // Determine which content to fetch based on contentType
      const contentType = options.contentType || "all";

      if (contentType === "all" && options.query) {
        // For mixed search, fetch both anime and manga
        const [animeResponse, mangaResponse] = await Promise.allSettled([
          jikanAPI.searchAnime({
            q: options.query,
            type: options.type as any,
            status: options.status as any,
            order_by: options.orderBy as any,
            sort: options.sort,
            page,
            limit: Math.floor((options.limit || 24) / 2), // Split limit between anime and manga
          }),
          jikanAPI.searchManga({
            q: options.query,
            type: options.type as any,
            status: options.status as any,
            order_by: options.orderBy as any,
            sort: options.sort,
            page,
            limit: Math.floor((options.limit || 24) / 2),
          }),
        ]);

        const animeData =
          animeResponse.status === "fulfilled"
            ? adaptJikanArrayToAnimeMedia(animeResponse.value.data)
            : [];
        const mangaData =
          mangaResponse.status === "fulfilled"
            ? adaptJikanMangaArrayToAnimeMedia(mangaResponse.value.data)
            : [];

        adaptedData = [...animeData, ...mangaData];
      } else if (contentType === "manga") {
        // Fetch only manga
        const response = await jikanAPI.searchManga({
          q: options.query,
          type: options.type as any,
          status: options.status as any,
          order_by: options.orderBy as any,
          sort: options.sort,
          page,
          limit: options.limit || 24,
        });

        adaptedData = adaptJikanMangaArrayToAnimeMedia(response.data);
      } else {
        // Fetch only anime (default)
        const response = await jikanAPI.searchAnime({
          q: options.query,
          type: options.type as any,
          status: options.status as any,
          order_by: options.orderBy as any,
          sort: options.sort,
          page,
          limit: options.limit || 24,
        });

        adaptedData = adaptJikanArrayToAnimeMedia(response.data);
      }

      // Filter out duplicates when appending data
      const newData = append
        ? [...state.data, ...adaptedData].filter(
            (item, index, arr) =>
              arr.findIndex((existingItem) => existingItem.id === item.id) ===
              index,
          )
        : adaptedData;

      setState((prev) => ({
        ...prev,
        data: newData,
        loading: false,
        hasNextPage: newData.length >= (options.limit || 24), // Simplified pagination logic
        currentPage: page,
        error: null,
      }));
    } catch (error) {
      console.warn("JIKAN API failed:", error);

      const apiError =
        error instanceof Error ? error : new Error("Failed to fetch data");
      const shouldUseFallback = shouldUseFallbackData(
        apiError,
        state.data.length > 0,
      );

      // Use fallback data for network errors or when no data exists
      if (
        !append &&
        state.data.length === 0 &&
        (shouldUseFallback || !options.query)
      ) {
        console.log("Using fallback data due to connectivity issues");
        setState((prev) => ({
          ...prev,
          data: fallbackAnimeData,
          loading: false,
          hasNextPage: false,
          currentPage: page,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: getNetworkErrorMessage(apiError),
        }));
      }
    }
  };

  const loadMore = () => {
    if (state.hasNextPage && !state.loading) {
      fetchAnime(state.currentPage + 1, true);
    }
  };

  const refresh = () => {
    fetchAnime(1, false);
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchAnime(1, false);
    }
  }, [
    options.query,
    options.contentType,
    options.type,
    options.status,
    options.genres,
    options.orderBy,
    options.sort,
  ]);

  return {
    ...state,
    fetchAnime,
    loadMore,
    refresh,
  };
}

export function useTopAnime(
  options: {
    type?: "tv" | "movie" | "ova" | "special" | "ona" | "music";
    filter?: "airing" | "upcoming" | "bypopularity" | "favorite";
    limit?: number;
  } = {},
) {
  const [state, setState] = useState<UseAnimeDataState>({
    data: [],
    loading: true,
    error: null,
    hasNextPage: false,
    currentPage: 1,
  });

  const fetchTopAnime = async (page: number = 1, append: boolean = false) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await jikanAPI.getTopAnime({
        ...options,
        page,
        limit: options.limit || 24,
      });

      const adaptedData = adaptJikanArrayToAnimeMedia(response.data);

      setState((prev) => ({
        ...prev,
        data: append ? [...prev.data, ...adaptedData] : adaptedData,
        loading: false,
        hasNextPage: response.pagination.has_next_page,
        currentPage: page,
        error: null,
      }));
    } catch (error) {
      console.warn("JIKAN API failed, using fallback data:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch data";
      const isNetworkError =
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("JIKAN API request failed");

      // Always use fallback data for top anime since it's critical for the homepage
      setState((prev) => ({
        ...prev,
        data: append ? [...prev.data, ...fallbackAnimeData] : fallbackAnimeData,
        loading: false,
        hasNextPage: false,
        currentPage: page,
        error: null, // Don't show error to user, just use fallback
      }));

      // Log network issues for debugging
      if (isNetworkError) {
        console.log(
          "Network connectivity issues detected for top anime, using cached/fallback data",
        );
      }
    }
  };

  const loadMore = () => {
    if (state.hasNextPage && !state.loading) {
      fetchTopAnime(state.currentPage + 1, true);
    }
  };

  useEffect(() => {
    fetchTopAnime(1, false);
  }, [options.type, options.filter]);

  return {
    ...state,
    fetchTopAnime,
    loadMore,
  };
}

export function useAnimeDetails(id: string | number, type?: "anime" | "manga") {
  const [anime, setAnime] = useState<AnimeMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        if (type === "manga") {
          const jikanManga = await jikanAPI.getMangaById(Number(id));
          const adaptedManga = adaptJikanMangaToAnimeMedia(jikanManga);
          setAnime(adaptedManga);
        } else {
          const jikanAnime = await jikanAPI.getAnimeById(Number(id));
          const adaptedAnime = adaptJikanToAnimeMedia(jikanAnime);
          setAnime(adaptedAnime);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch details";
        const isNetworkError =
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("NetworkError") ||
          errorMessage.includes("JIKAN API request failed");

        if (isNetworkError) {
          setError(
            "Unable to connect to anime database. Please check your internet connection and try again.",
          );
        } else {
          setError(errorMessage);
        }

        console.error("Failed to fetch anime details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  return { anime, loading, error };
}

export function useMangaDetails(id: string | number) {
  return useAnimeDetails(id, "manga");
}

export function useCurrentSeason() {
  const [state, setState] = useState<UseAnimeDataState>({
    data: [],
    loading: true,
    error: null,
    hasNextPage: false,
    currentPage: 1,
  });

  const fetchCurrentSeason = async (
    page: number = 1,
    append: boolean = false,
  ) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await jikanAPI.getCurrentSeason({
        page,
        limit: 24,
      });

      const adaptedData = adaptJikanArrayToAnimeMedia(response.data);

      setState((prev) => ({
        ...prev,
        data: append ? [...prev.data, ...adaptedData] : adaptedData,
        loading: false,
        hasNextPage: response.pagination.has_next_page,
        currentPage: page,
        error: null,
      }));
    } catch (error) {
      console.warn("JIKAN API failed, using fallback data:", error);

      // Use fallback data when API fails
      setState((prev) => ({
        ...prev,
        data: append ? [...prev.data, ...fallbackAnimeData] : fallbackAnimeData,
        loading: false,
        hasNextPage: false,
        currentPage: page,
        error: null, // Don't show error to user, just use fallback
      }));
    }
  };

  const loadMore = () => {
    if (state.hasNextPage && !state.loading) {
      fetchCurrentSeason(state.currentPage + 1, true);
    }
  };

  useEffect(() => {
    fetchCurrentSeason(1, false);
  }, []);

  return {
    ...state,
    fetchCurrentSeason,
    loadMore,
  };
}
