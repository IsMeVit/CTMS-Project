"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Background from "@/src/components/layout/background";
import { motion } from "framer-motion";
import Navbar from "@/src/components/layout/navbar";

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

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Background />

      <main className="relative z-10 px-6 md:px-16 py-14 text-white">
        <header className="mb-14">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
            Now Showing
          </h1>
          <div className="h-1 w-24 bg-red-600 mt-4" />
        </header>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              className="group relative rounded-2xl overflow-hidden border border-white/5 bg-zinc-900/40 backdrop-blur-md hover:border-white/20 transition-all duration-500"
            >
              <div className="relative h-110 w-full overflow-hidden">
                <Image
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                {/* Hover CTA */}
                <div className="absolute inset-0 flex items-end p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <button
                    onClick={() => router.push(`/booking/${movie.id}`)}
                    className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest"
                  >
                    Book Tickets
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h2 className="font-black text-xl uppercase tracking-tight group-hover:text-red-500 transition-colors">
                  {movie.title}
                </h2>

                {/* Genre Pills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {movie.genre.split(" • ").map((g) => (
                    <span
                      key={g}
                      className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/10 text-gray-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <div className="mt-4 text-[11px] tracking-widest uppercase text-gray-400 font-bold">
                  {movie.duration}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
