"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Movie {
  id: number;

  title: string;

  genre: string;

  duration: string;

  poster: string;
}

const movies: Movie[] = [
  {
    id: 1,

    title: "Neon Horizon",

    genre: "Action • Sci-Fi",

    duration: "2h 15m",

    poster:
      "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800",
  },

  {
    id: 2,

    title: "Stellar Drift",

    genre: "Sci-Fi • Adventure",

    duration: "2h 45m",

    poster:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
  },

  {
    id: 3,

    title: "Shadow Protocol",

    genre: "Thriller • Crime",

    duration: "1h 58m",

    poster:
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
  },

  {
    id: 4,

    title: "The Last Echo",

    genre: "Drama • Mystery",

    duration: "2h 10m",

    poster:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800",
  },
];

export default function MoviesPage() {
  const router = useRouter();
  const [hoveredMovie, setHoveredMovie] = useState<Movie | null>(null);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden transition-colors duration-700">
      {/* Dynamic Background Glow */}
      <AnimatePresence>
        {hoveredMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0"
          >
            <div
              className="absolute inset-0 blur-[100px] scale-150"
              style={{
                background: `radial-gradient(circle at center, ${hoveredMovie.id % 2 === 0 ? "#dc2626" : "#2563eb"} 0%, transparent 70%)`,
              }}
            />
            <img
              src={hoveredMovie.poster}
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-3xl"
              alt="bg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 px-6 md:px-16 py-14 text-white">
        <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
              Now <span className="text-red-600">Showing</span>
            </h1>
            <p className="text-gray-400 mt-4 font-medium tracking-[0.2em] uppercase text-sm">
              Experience the future of cinema
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Filters
            </button>
          </div>
        </header>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              onMouseEnter={() => setHoveredMovie(movie)}
              onMouseLeave={() => setHoveredMovie(null)}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -10 }}
              className="group relative flex flex-col"
            >
              {/* Card Body */}
              <div className="relative aspect-2/3 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Hover Actions */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <button
                    onClick={() => router.push(`/booking/${movie.id}`)}
                    className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                  >
                    Get Tickets
                  </button>
                  <button className="w-full mt-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all">
                    View Trailer
                  </button>
                </div>
              </div>

              {/* Text Info (Outside card for a cleaner look) */}
              <div className="mt-6 px-2">
                <div className="flex justify-between items-start">
                  <h2 className="font-black text-2xl uppercase tracking-tighter leading-tight group-hover:text-red-500 transition-colors">
                    {movie.title}
                  </h2>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-red-600 font-bold text-[10px] tracking-widest uppercase">
                    {movie.duration}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-600" />
                  <span className="text-gray-400 font-medium text-[10px] tracking-widest uppercase">
                    {movie.genre}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
