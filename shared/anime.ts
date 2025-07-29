export type MediaType = 'anime' | 'manga';

export type Status = 'airing' | 'completed' | 'upcoming' | 'hiatus';

export type UserStatus = 'watching' | 'reading' | 'completed' | 'paused' | 'planning';

export type Genre = 
  | 'Action' | 'Adventure' | 'Comedy' | 'Drama' | 'Fantasy' 
  | 'Horror' | 'Romance' | 'Sci-Fi' | 'Slice of Life' | 'Sports'
  | 'Supernatural' | 'Thriller' | 'Mystery' | 'Historical'
  | 'Psychological' | 'Mecha' | 'Music' | 'School';

export interface AnimeMedia {
  id: string;
  title: string;
  titleEnglish?: string;
  titleJapanese?: string;
  description: string;
  synopsis: string; // Full detailed synopsis
  type: MediaType;
  status: Status;
  genres: Genre[];
  releaseYear: number;
  endYear?: number;
  episodes?: number; // For anime
  chapters?: number; // For manga
  seasons?: number; // For anime
  duration?: number; // Episode duration in minutes
  rating: number; // 0-10
  popularity: number; // Popularity rank
  coverImage: string;
  bannerImage: string;
  trailer?: string; // YouTube trailer ID
  studio?: string; // For anime
  author?: string; // For manga
  director?: string; // For anime
  source?: string; // Original source (Manga, Light Novel, etc.)
  platforms: string[]; // Where to watch/read
  userStatus?: UserStatus;
  userRating?: number;
  userProgress?: number; // Episodes watched or chapters read
  tags: string[]; // Additional tags
  ageRating: string; // PG-13, R, etc.
  malScore?: number; // MyAnimeList score
}

// Mock data for popular anime and manga
export const mockAnimeData: AnimeMedia[] = [
  {
    id: '1',
    title: 'Attack on Titan',
    titleEnglish: 'Attack on Titan',
    titleJapanese: '進撃の巨人',
    description: 'Humanity fights for survival against giant humanoid Titans that have breached their last safe haven.',
    synopsis: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal Titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.',
    type: 'anime',
    status: 'completed',
    genres: ['Action', 'Drama', 'Fantasy', 'Horror'],
    releaseYear: 2013,
    endYear: 2023,
    episodes: 87,
    seasons: 4,
    duration: 24,
    rating: 9.0,
    popularity: 1,
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=faces',
    bannerImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
    trailer: 'MGRm4IzK1SQ',
    studio: 'Studio Pierrot',
    director: 'Tetsuro Araki',
    source: 'Manga',
    platforms: ['Crunchyroll', 'Funimation', 'Hulu', 'Netflix'],
    tags: ['Military', 'Post-Apocalyptic', 'Survival', 'Tragedy'],
    ageRating: 'TV-MA',
    malScore: 9.0
  },
  {
    id: '2',
    title: 'One Piece',
    titleEnglish: 'One Piece',
    titleJapanese: 'ワンピース',
    description: 'Follow Monkey D. Luffy and his pirate crew in search of the ultimate treasure known as One Piece.',
    synopsis: 'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.',
    type: 'anime',
    status: 'airing',
    genres: ['Action', 'Adventure', 'Comedy', 'Drama'],
    releaseYear: 1999,
    episodes: 1000,
    seasons: 21,
    duration: 24,
    rating: 9.2,
    popularity: 2,
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop&crop=faces',
    bannerImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&h=400&fit=crop',
    trailer: 'Ades3pQbeh8',
    studio: 'Toei Animation',
    director: 'Eiichiro Oda',
    source: 'Manga',
    platforms: ['Crunchyroll', 'Funimation', 'Netflix'],
    tags: ['Pirates', 'Friendship', 'Adventure', 'Shounen'],
    ageRating: 'TV-14',
    malScore: 9.2
  },
  {
    id: '3',
    title: 'Demon Slayer',
    titleEnglish: 'Demon Slayer: Kimetsu no Yaiba',
    titleJapanese: '鬼滅の刃',
    description: 'A young boy becomes a demon slayer to avenge his family and cure his sister.',
    synopsis: 'Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado\'s shoulders. Though living impoverished on a remote mountain, the Kamado family are able to enjoy a relatively peaceful and happy life. One day, Tanjirou decides to go down to the local village to make a little money selling charcoal. On his way back, night falls, forcing Tanjirou to take shelter in the house of a strange man, who warns him of the existence of flesh-eating demons that lurk in the woods at night.',
    type: 'anime',
    status: 'airing',
    genres: ['Action', 'Supernatural', 'Historical'],
    releaseYear: 2019,
    episodes: 44,
    seasons: 3,
    duration: 24,
    rating: 8.7,
    popularity: 3,
    coverImage: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=600&fit=crop&crop=faces',
    bannerImage: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=1200&h=400&fit=crop',
    trailer: 'VQGCKyvzIM4',
    studio: 'Ufotable',
    director: 'Haruo Sotozaki',
    source: 'Manga',
    platforms: ['Crunchyroll', 'Funimation', 'Netflix', 'Hulu'],
    tags: ['Demons', 'Family', 'Sword Fighting', 'Shounen'],
    ageRating: 'TV-14',
    malScore: 8.7
  },
  {
    id: '4',
    title: 'My Hero Academia',
    titleEnglish: 'My Hero Academia',
    titleJapanese: '僕のヒーローアカデミア',
    description: 'In a world where most people have superpowers, a powerless boy enrolls in a hero academy.',
    synopsis: 'The appearance of "quirks," newly discovered super powers, has been steadily increasing over the years, with 80 percent of humanity possessing various abilities from manipulation of elements to shapeshifting. This leaves the remainder of the world completely powerless, and Izuku Midoriya is one such individual. Since he was a child, the ambitious middle schooler has wanted nothing more than to be a hero. Izuku\'s unfair fate leaves him admiring heroes and taking notes on them whenever he gets the chance. But it seems that his persistence has borne some fruit: Izuku meets the number one hero and his personal idol, All Might.',
    type: 'anime',
    status: 'airing',
    genres: ['Action', 'Adventure', 'School', 'Supernatural'],
    releaseYear: 2016,
    episodes: 138,
    seasons: 6,
    duration: 24,
    rating: 8.5,
    popularity: 4,
    coverImage: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=600&fit=crop&crop=faces',
    bannerImage: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1200&h=400&fit=crop',
    trailer: 'D5fYOnwYkj4',
    studio: 'Studio Bones',
    director: 'Kenji Nagasaki',
    source: 'Manga',
    platforms: ['Crunchyroll', 'Funimation', 'Hulu'],
    tags: ['Heroes', 'School', 'Superpowers', 'Shounen'],
    ageRating: 'TV-14',
    malScore: 8.5
  },
  {
    id: '5',
    title: 'Jujutsu Kaisen',
    titleEnglish: 'Jujutsu Kaisen',
    titleJapanese: '呪術廻戦',
    description: 'A student joins a secret organization of sorcerers to eliminate cursed spirits.',
    synopsis: 'Although Yuji Itadori looks like your average teenager, his immense physical strength is something to behold! Every sports club wants him to join, but Itadori would rather hang out with the school outcasts in the Occult Research Club. One day, the club manages to get their hands on a sealed cursed object. Little do they know the terror they\'ll unleash when they break the seal...',
    type: 'anime',
    status: 'airing',
    genres: ['Action', 'Supernatural', 'School'],
    releaseYear: 2020,
    episodes: 24,
    seasons: 2,
    duration: 24,
    rating: 8.8,
    popularity: 5,
    coverImage: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=600&fit=crop&crop=faces',
    bannerImage: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1200&h=400&fit=crop',
    trailer: '4A_X-Dvl0ws',
    studio: 'MAPPA',
    director: 'Sunghoo Park',
    source: 'Manga',
    platforms: ['Crunchyroll', 'Funimation'],
    tags: ['Curses', 'School', 'Dark Fantasy', 'Shounen'],
    ageRating: 'TV-14',
    malScore: 8.8
  },
  {
    id: '6',
    title: 'One Punch Man',
    description: 'A superhero who can defeat any enemy with a single punch searches for a worthy opponent.',
    type: 'anime',
    status: 'airing',
    genres: ['Action', 'Comedy', 'Supernatural'],
    releaseYear: 2015,
    episodes: 24,
    rating: 8.9,
    coverImage: 'https://images.unsplash.com/photo-1611207543305-a79ad7c94229?w=400&h=600&fit=crop&crop=faces',
    bannerImage: 'https://images.unsplash.com/photo-1611207543305-a79ad7c94229?w=1200&h=400&fit=crop',
    studio: 'Madhouse'
  },
  {
    id: '7',
    title: 'Death Note',
    description: 'A high school student finds a supernatural notebook that grants the power to kill.',
    type: 'anime',
    status: 'completed',
    genres: ['Psychological', 'Supernatural', 'Thriller'],
    releaseYear: 2006,
    episodes: 37,
    rating: 9.0,
    coverImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=600&fit=crop&crop=faces',
    bannerImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=400&fit=crop',
    studio: 'Madhouse'
  },
  {
    id: '8',
    title: 'Naruto',
    description: 'A young ninja seeks recognition from his peers and dreams of becoming the village leader.',
    type: 'anime',
    status: 'completed',
    genres: ['Action', 'Adventure', 'Drama'],
    releaseYear: 2002,
    episodes: 720,
    rating: 8.4,
    coverImage: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=600&fit=crop&crop=top',
    bannerImage: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1200&h=400&fit=crop',
    studio: 'Studio Pierrot'
  },
  {
    id: '9',
    title: 'Tokyo Ghoul',
    description: 'A college student becomes half-ghoul after a chance encounter with one of these flesh-eating creatures.',
    type: 'manga',
    status: 'completed',
    genres: ['Action', 'Horror', 'Supernatural'],
    releaseYear: 2011,
    chapters: 143,
    rating: 8.6,
    coverImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=600&fit=crop&crop=faces',
    bannerImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=400&fit=crop',
    author: 'Sui Ishida'
  },
  {
    id: '10',
    title: 'Chainsaw Man',
    description: 'A young man fuses with his pet devil to become a chainsaw-wielding hero.',
    type: 'manga',
    status: 'airing',
    genres: ['Action', 'Horror', 'Supernatural'],
    releaseYear: 2018,
    chapters: 97,
    rating: 8.8,
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=center',
    bannerImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
    author: 'Tatsuki Fujimoto'
  }
];

// Helper functions
export const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'airing':
      return 'text-success';
    case 'completed':
      return 'text-primary';
    case 'upcoming':
      return 'text-warning';
    case 'hiatus':
      return 'text-muted-foreground';
    default:
      return 'text-muted-foreground';
  }
};

export const getUserStatusColor = (status: UserStatus): string => {
  switch (status) {
    case 'watching':
      return 'text-success';
    case 'reading':
      return 'text-success';
    case 'completed':
      return 'text-primary';
    case 'paused':
      return 'text-warning';
    case 'planning':
      return 'text-secondary';
    default:
      return 'text-muted-foreground';
  }
};

export const getUserStatusLabel = (status: UserStatus): string => {
  switch (status) {
    case 'watching':
      return 'Watching';
    case 'reading':
      return 'Reading';
    case 'completed':
      return 'Completed';
    case 'paused':
      return 'On Hold';
    case 'planning':
      return 'Plan to Watch';
    default:
      return 'Unknown';
  }
};
