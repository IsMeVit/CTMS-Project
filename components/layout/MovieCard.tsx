"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import DatePicker from "@/components/ui/DatePicker";
import { Play } from "lucide-react";

interface Showtime {
  id: string;
  time: string;
  date: string;
  available: number;
}

interface SeatRow {
  rowId: string;
  label: string;
  price: number;
  seats: number;
}

interface Movie {
  id: number | string;
  title: string;
  genre: string;
  duration: string | number;
  poster?: string;
  posterUrl?: string;
  description?: string;
  rating?: number;
  showtimes?: string[];
  seatConfig?: SeatRow[];
  releaseDate?: string;
  endDate?: string;
  showtimesData?: Showtime[];
}

interface MovieCardProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieCard({ movie, onClose }: MovieCardProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

  const posterUrl = movie.poster || movie.posterUrl || "";
  const durationStr =
    typeof movie.duration === "number"
      ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`
      : movie.duration;

  const handleBooking = () => {
    if (selectedShowtime) {
      router.push(
        `/booking?movie=${encodeURIComponent(movie.title)}&date=${
          selectedShowtime.date
        }&time=${encodeURIComponent(selectedShowtime.time)}&showtimeId=${
          selectedShowtime.id
        }&movieId=${movie.id}`
      );
    }
  };

  const generateShowtimes = (): Showtime[] => {
    const showtimes: Showtime[] = [];
    const times = movie.showtimes && movie.showtimes.length > 0 
      ? movie.showtimes 
      : ["10:00", "13:00", "16:00", "19:00", "22:00"];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = movie.releaseDate ? new Date(movie.releaseDate) : new Date(today);
    let endDate = movie.endDate ? new Date(movie.endDate) : new Date(today);
    
    // Handle empty or invalid endDate
    if (!movie.endDate || isNaN(endDate.getTime())) {
      endDate = new Date(today);
      endDate.setMonth(endDate.getMonth() + 1);
    }

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      currentDate.setHours(0, 0, 0, 0);
      
      if (currentDate < today) continue;
      
      const dateStr = currentDate.toISOString().split("T")[0];
      
      times.forEach((time) => {
        showtimes.push({
          id: `${movie.id}-${dateStr}-${time}`,
          time,
          date: dateStr,
          available: Math.floor(Math.random() * 50) + 10,
        });
      });
    }
    
    return showtimes;
  };

  const movieShowtimes = movie.showtimesData || generateShowtimes();

  const filteredShowtimes = useMemo(() => {
    return movieShowtimes.filter((s) => s.date === selectedDate);
  }, [movieShowtimes, selectedDate]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedShowtime(null);
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
        className="relative w-full max-w-md max-h-[85vh] rounded-2xl bg-[#181818] overflow-hidden shadow-2xl"
      >
        <div
          className="relative h-60 w-full bg-cover bg-center flex items-end p-6"
          style={{ backgroundImage: posterUrl ? `url(${posterUrl})` : undefined }}
        >
          {!posterUrl && (
            <div className="absolute inset-0 bg-linear-to-br from-red-600/30 to-red-700/20 flex items-center justify-center">
              <span className="text-6xl">🎬</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/50 to-transparent" />
          <h2 className="relative z-10 text-3xl font-black uppercase italic tracking-tighter leading-none text-white">
            {movie.title}
          </h2>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(85vh-240px)]">
          {movie.description && (
            <p className="text-gray-400 text-sm">{movie.description}</p>
          )}

          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            showtimes={movieShowtimes}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Showtimes
              </h3>
              <span className="text-xs text-gray-500">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            
            {filteredShowtimes.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No showtimes available</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredShowtimes.map((showtime) => (
                  <motion.button
                    key={showtime.id}
                    onClick={() => setSelectedShowtime(showtime)}
                    disabled={showtime.available === 0}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: showtime.available > 0 ? 1.05 : 1 }}
                    whileTap={{ scale: showtime.available > 0 ? 0.95 : 1 }}
                    className={`relative px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                      selectedShowtime?.id === showtime.id
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                        : showtime.available === 0
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/5"
                    }`}
                  >
                    <span className="text-lg">{showtime.time}</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span
                        className={`text-[10px] ${
                          selectedShowtime?.id === showtime.id
                            ? "text-white/80"
                            : "text-gray-400"
                        }`}
                      >
                        {showtime.available} seats
                      </span>
                      {showtime.available < 20 && showtime.available > 0 && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            selectedShowtime?.id === showtime.id
                              ? "bg-white"
                              : "bg-yellow-500"
                          }`}
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-[#181818] pt-4 border-t border-white/10">
            <motion.button
              onClick={handleBooking}
              disabled={!selectedShowtime}
              whileHover={{ scale: selectedShowtime ? 1.02 : 1 }}
              whileTap={{ scale: selectedShowtime ? 0.98 : 1 }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedShowtime
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedShowtime 
                ? `BOOK TICKETS - $${selectedShowtime.available === 0 ? 0 : selectedShowtime.available * 12}`
                : "SELECT SHOWTIME"}
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.genre.split(" • ").map((g) => (
              <span 
                key={g} 
                className="px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-wider"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-xs font-bold tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{durationStr}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
