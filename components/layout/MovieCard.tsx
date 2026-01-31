"use client";

import { useRouter } from "next/navigation"; 
import { motion } from "framer-motion";
import { useState } from "react";

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

interface MovieCardProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieCard({ movie, onClose }: MovieCardProps) {
  const router = useRouter(); 
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

  const handleBooking = () => {
    if (selectedShowtime) {
      router.push(`/booking?movie=${encodeURIComponent(movie.title)}&date=${selectedShowtime.date}&time=${selectedShowtime.time}&showtimeId=${selectedShowtime.id}`);
    }
  };

  const generateShowtimes = (): Showtime[] => {
    const showtimes: Showtime[] = [];
    const times = ['10:00', '13:00', '16:00', '19:00', '22:00'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      times.forEach(time => {
        showtimes.push({
          id: `${dateStr}-${time}`,
          time,
          date: dateStr,
          available: Math.floor(Math.random() * 50) + 10
        });
      });
    }
    
    return showtimes;
  };

  const movieShowtimes = movie.showtimes || generateShowtimes();
  const groupedShowtimes = movieShowtimes.reduce((acc, showtime) => {
    if (!acc[showtime.date]) {
      acc[showtime.date] = [];
    }
    acc[showtime.date].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);

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
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Select Showtime</h3>
            
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {Object.entries(groupedShowtimes).map(([date, times]) => (
                <div key={date} className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {times.map((showtime) => (
                      <button
                        key={showtime.id}
                        onClick={() => setSelectedShowtime(showtime)}
                        disabled={showtime.available === 0}
                        className={`px-3 py-2 rounded-md text-xs font-bold transition-all ${
                          selectedShowtime?.id === showtime.id
                            ? 'bg-red-600 text-white'
                            : showtime.available === 0
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/5'
                        }`}
                      >
                        {showtime.time}
                        <span className="block text-[8px] opacity-70">
                          {showtime.available} seats
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleBooking}
            disabled={!selectedShowtime}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white py-4 rounded-md font-bold text-lg transition-colors active:scale-95">
            {selectedShowtime ? 'BOOK TICKETS' : 'SELECT SHOWTIME'}
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