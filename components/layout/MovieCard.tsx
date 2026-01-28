"use client";

import { useRouter } from "next/navigation"; 
import { motion } from "framer-motion";

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  poster: string;
}

interface MovieCardProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieCard({ movie, onClose }: MovieCardProps) {
  const router = useRouter(); 

  const handleBooking = () => {
    router.push(`/booking?movie=${encodeURIComponent(movie.title)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(_, info) => info.offset.y > 100 && onClose()}
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="relative w-full max-w-md rounded-2xl bg-[#181818] overflow-hidden shadow-2xl touch-none"
      >
        <div 
          className="relative h-60 w-full bg-cover bg-center flex items-end p-6"
          style={{ backgroundImage: `url(${movie.poster})` }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#181818] to-transparent" />
          <h2 className="relative z-10 text-3xl font-black uppercase italic tracking-tighter leading-none text-white">
            {movie.title}
          </h2>
        </div>

        <div className="p-8 space-y-6">
          <button 
            onClick={handleBooking} // 4. Link to the function
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-md font-bold text-lg transition-colors active:scale-95">
            BOOK TICKETS
          </button>

          <div className="flex flex-wrap gap-2">
            {movie.genre.split(" • ").map((g) => (
              <span key={g} className="px-3 py-1 bg-[#333] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                {g}
              </span>
            ))}
          </div>

          <p className="text-gray-400 text-xs font-bold tracking-widest">{movie.duration}</p>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors">
          ✕
        </button>
      </motion.div>
    </div>
  );
}