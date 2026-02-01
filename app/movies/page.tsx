"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MovieCard from "@/components/layout/MovieCard";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, ArrowRight, Search, Filter, X } from "lucide-react";

interface Showtime {
  id: string;
  time: string;
  date: string;
  available: number;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  poster: string;
  showtimes?: Showtime[];
}

const generateMovieShowtimes = (movieId: number): Showtime[] => {
  const showtimes: Showtime[] = [];
  const times = ['10:00', '13:00', '16:00', '19:00', '22:00'];
  
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    times.forEach(time => {
      showtimes.push({
        id: `${movieId}-${dateStr}-${time}`,
        time,
        date: dateStr,
        available: Math.floor(Math.random() * 50) + 10
      });
    });
  }
  
  return showtimes;
};

const allMovies: Movie[] = [
  { id: 1, title: "Neon Horizon", genre: "Action • Sci-Fi", duration: "2h 15m", poster: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(1) },
  { id: 2, title: "Stellar Drift", genre: "Sci-Fi • Adventure", duration: "2h 45m", poster: "https://images.unsplash.com/photo-1534447677768-be436bb0949c?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(2) },
  { id: 3, title: "Shadow Protocol", genre: "Thriller • Crime", duration: "1h 58m", poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(3) },
  { id: 4, title: "The Last Echo", genre: "Drama • Mystery", duration: "2h 10m", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(4) },
  { id: 5, title: "Cosmic Journey", genre: "Sci-Fi • Drama", duration: "2h 30m", poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(5) },
  { id: 6, title: "Midnight Chase", genre: "Action • Thriller", duration: "1h 55m", poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(6) },
  { id: 7, title: "Love in Paris", genre: "Romance • Drama", duration: "2h 5m", poster: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(7) },
  { id: 8, title: "The Great Escape", genre: "Adventure • Comedy", duration: "2h 20m", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(8) },
  { id: 9, title: "Ocean's Depth", genre: "Documentary • Nature", duration: "1h 45m", poster: "https://images.unsplash.com/photo-1582967788606-a171f1080ca8?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(9) },
  { id: 10, title: "Digital Dreams", genre: "Sci-Fi • Fantasy", duration: "2h 20m", poster: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(10) },
  { id: 11, title: "Mountain King", genre: "Adventure • Drama", duration: "2h 15m", poster: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(11) },
  { id: 12, title: "City Lights", genre: "Romance • Comedy", duration: "1h 55m", poster: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=800", showtimes: generateMovieShowtimes(12) },
];

const teaserMovies = allMovies.slice(0, 2);

const genres = ["All", "Action", "Sci-Fi", "Thriller", "Romance", "Drama", "Adventure", "Comedy", "Crime", "Mystery", "Documentary", "Nature", "Fantasy"];

export default function MoviesPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const displayedMovies = isAuthenticated ? allMovies : teaserMovies;

  const filteredMovies = useMemo(() => {
    let filtered = displayedMovies;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query)
      );
    }

    // Filter by genre
    if (selectedGenre !== "All") {
      filtered = filtered.filter(movie => 
        movie.genre.includes(selectedGenre)
      );
    }

    return filtered;
  }, [displayedMovies, searchQuery, selectedGenre]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("All");
  };

  return (
    <div className="relative md:min-h-screen text-white font-sans overflow-x-hidden">
      <main className="relative z-10 px-6 md:px-16 py-14">
        <header className="mb-14">
          <h2 className="text-xl md:text-4xl uppercase font-bold tracking-tight">
            {isAuthenticated ? 'All Movies' : 'Trending Now'}
          </h2>
          <div className="h-1 w-24 bg-red-600 mt-4" />
        </header>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Genre Filter */}
          <div className="relative">
            <Filter size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="pl-12 pr-8 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none cursor-pointer"
            >
              {genres.map(genre => (
                <option key={genre} value={genre} className="bg-gray-800">
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedGenre !== "All") && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <p className="text-gray-400 text-sm mb-4">
          {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
          {searchQuery && ` for "${searchQuery}"`}
          {selectedGenre !== "All" && ` in ${selectedGenre}`}
        </p>

        {/* No Results */}
        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={40} className="text-gray-600" />
            </div>
            <p className="text-gray-400 mb-4">No movies found</p>
            <button
              onClick={clearFilters}
              className="text-red-500 hover:text-red-400 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Movies Grid */}
        <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          <AnimatePresence>
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleMovieClick(movie)}
                className="relative flex-none group cursor-pointer"
              >
                <div className="relative md:w-xs w-40 aspect-2/3 overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105 group-hover:z-30">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    width={400}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-gray-300 truncate">{movie.genre}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Login CTA for guests */}
          {!isAuthenticated && displayedMovies.length === teaserMovies.length && filteredMovies.length === teaserMovies.length && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: displayedMovies.length * 0.1 }}
              className="relative flex-none"
            >
              <button
                onClick={handleLoginClick}
                className="w-40 aspect-2/3 rounded-md bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 hover:bg-white/10 hover:border-white/40 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock size={32} className="text-red-500" />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-bold text-white mb-1">Unlock All</p>
                  <p className="text-xs text-gray-400">{allMovies.length - teaserMovies.length} more movies</p>
                </div>
                <div className="flex items-center gap-1 text-red-500 text-sm font-medium">
                  Login <ArrowRight size={14} />
                </div>
              </button>
            </motion.div>
          )}
        </div>

        {/* Login banner for guests */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-gradient-to-r from-red-600/20 to-red-700/10 border border-red-600/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                <Lock size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Sign in to access all movies</h3>
                <p className="text-gray-400 text-sm">Get access to {allMovies.length} movies, exclusive deals, and more</p>
              </div>
            </div>
            <button
              onClick={handleLoginClick}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              Sign In
            </button>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {selectedMovie && (
          <MovieCard 
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)} 
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .outline-text {
          color: transparent;
          -webkit-text-stroke: 4px #555;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
