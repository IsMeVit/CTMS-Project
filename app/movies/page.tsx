"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from "@/components/layout/MovieCard";

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  poster: string;
}

const movies: Movie[] = [
  { id: 1, title: "Neon Horizon", genre: "Action • Sci-Fi", duration: "2h 15m", poster: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Stellar Drift", genre: "Sci-Fi • Adventure", duration: "2h 45m", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Shadow Protocol", genre: "Thriller • Crime", duration: "1h 58m", poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800" },
  { id: 4, title: "The Last Echo", genre: "Drama • Mystery", duration: "2h 10m", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800" },
];

export default function MoviesPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <div className="relative md:min-h-screen text-white font-sans overflow-x-hidden">
      <main className="relative z-10 px-6 md:px-16 py-14">
        <header className="mb-14">
          <h2 className="text-xl md:text-4xl uppercase font-bold tracking-tight">Trending Now</h2>
          <div className="h-1 w-24 bg-red-600 mt-4" />
        </header>

        <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedMovie(movie)}
              className="relative flex-none group cursor-pointer"
            >
              <div className="absolute -left-4 bottom-0 z-10 select-none pointer-events-none">
              </div>
              <div className="relative md:w-xs w-40 aspect-2/3 ml-8 overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105 group-hover:z-30">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
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