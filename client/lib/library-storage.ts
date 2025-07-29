import { AnimeMedia, UserStatus } from '@shared/anime';

export interface UserLibraryItem extends AnimeMedia {
  userStatus: UserStatus;
  userProgress?: number;
  userRating?: number;
  dateAdded: string;
  dateUpdated: string;
}

const LIBRARY_STORAGE_KEY = 'anishelf-library';

export class LibraryStorage {
  static getLibrary(): UserLibraryItem[] {
    try {
      const data = localStorage.getItem(LIBRARY_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load library from localStorage:', error);
      return [];
    }
  }

  static saveLibrary(library: UserLibraryItem[]): void {
    try {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
    } catch (error) {
      console.error('Failed to save library to localStorage:', error);
    }
  }

  static addToLibrary(anime: AnimeMedia, status: UserStatus): UserLibraryItem {
    const library = this.getLibrary();
    const now = new Date().toISOString();
    
    const existingIndex = library.findIndex(item => item.id === anime.id);
    
    const libraryItem: UserLibraryItem = {
      ...anime,
      userStatus: status,
      userProgress: 0,
      dateAdded: existingIndex >= 0 ? library[existingIndex].dateAdded : now,
      dateUpdated: now
    };

    if (existingIndex >= 0) {
      library[existingIndex] = libraryItem;
    } else {
      library.push(libraryItem);
    }

    this.saveLibrary(library);
    return libraryItem;
  }

  static updateStatus(animeId: string, status: UserStatus): void {
    const library = this.getLibrary();
    const itemIndex = library.findIndex(item => item.id === animeId);
    
    if (itemIndex >= 0) {
      library[itemIndex].userStatus = status;
      library[itemIndex].dateUpdated = new Date().toISOString();
      
      // Reset progress if moving to planning
      if (status === 'planning') {
        library[itemIndex].userProgress = 0;
      }
      
      // Set progress to max if marking as completed
      if (status === 'completed') {
        library[itemIndex].userProgress = library[itemIndex].episodes || library[itemIndex].chapters || 0;
      }
      
      this.saveLibrary(library);
    }
  }

  static updateProgress(animeId: string, progress: number): void {
    const library = this.getLibrary();
    const itemIndex = library.findIndex(item => item.id === animeId);
    
    if (itemIndex >= 0) {
      library[itemIndex].userProgress = progress;
      library[itemIndex].dateUpdated = new Date().toISOString();
      
      // Auto-update status based on progress
      const maxProgress = library[itemIndex].episodes || library[itemIndex].chapters || 0;
      if (progress >= maxProgress && progress > 0) {
        library[itemIndex].userStatus = 'completed';
      } else if (progress > 0 && library[itemIndex].userStatus === 'planning') {
        library[itemIndex].userStatus = 'watching';
      }
      
      this.saveLibrary(library);
    }
  }

  static updateRating(animeId: string, rating: number): void {
    const library = this.getLibrary();
    const itemIndex = library.findIndex(item => item.id === animeId);
    
    if (itemIndex >= 0) {
      library[itemIndex].userRating = rating;
      library[itemIndex].dateUpdated = new Date().toISOString();
      this.saveLibrary(library);
    }
  }

  static removeFromLibrary(animeId: string): void {
    const library = this.getLibrary();
    const filteredLibrary = library.filter(item => item.id !== animeId);
    this.saveLibrary(filteredLibrary);
  }

  static isInLibrary(animeId: string): boolean {
    const library = this.getLibrary();
    return library.some(item => item.id === animeId);
  }

  static getLibraryItem(animeId: string): UserLibraryItem | null {
    const library = this.getLibrary();
    return library.find(item => item.id === animeId) || null;
  }

  static getLibraryStats() {
    const library = this.getLibrary();
    
    return {
      total: library.length,
      watching: library.filter(item => item.userStatus === 'watching').length,
      completed: library.filter(item => item.userStatus === 'completed').length,
      paused: library.filter(item => item.userStatus === 'paused').length,
      planning: library.filter(item => item.userStatus === 'planning').length,
      totalEpisodes: library.reduce((sum, item) => sum + (item.userProgress || 0), 0),
      averageRating: library.filter(item => item.userRating).reduce((sum, item) => sum + (item.userRating || 0), 0) / library.filter(item => item.userRating).length || 0
    };
  }
}
