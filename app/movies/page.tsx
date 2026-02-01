"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import MovieCard from "@/components/layout/MovieCard";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, ArrowRight, Search, Filter, X } from "lucide-react";
import { getMoviesAPI } from "@/lib/api";

interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  duration: number;
  genre: string;
  rating: number;
  createdAt: string;
}

interface Showtime {
  id: string;
  time: string;
  date: string;
  available: number;
}

const generateMovieShowtimes = (movieId: string): Showtime[] => {
  const showtimes: Showtime[] = [];
  const times = ["10:00", "13:00", "16:00", "19:00", "22:00"];

  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    times.forEach((time) => {
      showtimes.push({
        id: `${movieId}-${dateStr}-${time}`,
        time,
        date: dateStr,
        available: Math.floor(Math.random() * 50) + 10,
      });
    });
  }

  return showtimes;
};

const genres = [
  "All",
  "Action",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "Drama",
  "Adventure",
  "Comedy",
  "Crime",
  "Mystery",
  "Documentary",
  "Nature",
  "Fantasy",
];

function MoviesContent() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMoviesAPI();
        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const displayedMovies = movies;

  const filteredMovies = displayedMovies.filter((movie) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" || movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("All");
  };

  if (loading) {
    return (
      <div className="relative md:min-h-screen text-white font-sans overflow-x-hidden">
        <main className="relative z-10 px-6 md:px-16 py-14 flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="relative md:min-h-screen text-white font-sans overflow-x-hidden">
      <main className="relative z-10 px-6 md:px-16 py-14">
        <header className="mb-14">
          <h2 className="text-xl md:text-4xl uppercase font-bold tracking-tight">
            {isAuthenticated ? "All Movies" : "Trending Now"}
          </h2>
          <div className="h-1 w-24 bg-red-600 mt-4" />
        </header>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
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

          <div className="relative">
            <Filter
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="pl-12 pr-8 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none cursor-pointer"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre} className="bg-gray-800">
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedGenre !== "All") && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-4">
          {filteredMovies.length} {filteredMovies.length === 1 ? "movie" : "movies"} found
          {searchQuery && ` for "${searchQuery}"`}
          {selectedGenre !== "All" && ` in ${selectedGenre}`}
        </p>

        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={40} className="text-gray-600" />
            </div>
            <p className="text-gray-400 mb-4">No movies found</p>
            <button onClick={clearFilters} className="text-red-500 hover:text-red-400 font-medium">
              Clear all filters
            </button>
          </div>
        )}

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
                  {movie.posterUrl && !movie.posterUrl.includes("duckduckgo.com") ? (
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      width={400}
                      height={600}
                      priority
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-red-600/30 to-red-700/20 flex items-center justify-center">
                      <span className="text-4xl">🎬</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-gray-300 truncate">{movie.genre}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!isAuthenticated && movies.length > 0 && (
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
                <p className="text-gray-400 text-sm">Get access to {movies.length} movies, exclusive deals, and more</p>
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

      <AnimatePresence>{selectedMovie && <MovieCard movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}</AnimatePresence>

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

export default function MoviesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}
