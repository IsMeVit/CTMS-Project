"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieTitle = searchParams.get('movie') || "Movie";

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const SEAT_PRICE = 12;
  const ROWS = ["A", "B", "C", "D", "E"];
  const SEATS_PER_ROW = 8;

  const toggleSeat = (id: string) => {
    setSelectedSeats(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <section className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 flex flex-col items-center">
      <div className="mb-12 text-center">
        <button 
          onClick={() => router.back()}
          className="text-gray-500 hover:text-white mb-4 transition-colors"
        >
          ← Back to Movies
        </button>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          Booking: <span className="text-red-600">{movieTitle}</span>
        </h1>
      </div>

      <div className="w-full max-w-2xl mb-16 relative">
        <div className="h-1 w-full bg-linear-to-r from-transparent via-red-600 to-transparent shadow-[0_-10px_20px_rgba(220,38,38,0.8)]" />
        <p className="text-center text-[10px] text-gray-500 uppercase tracking-[0.5em] mt-4">Screen</p>
      </div>

      <div className="grid gap-4 mb-12 bg-white/5 p-8 rounded-3xl border border-white/10">
        {ROWS.map((row) => (
          <div key={row} className="flex gap-3 items-center">
            <span className="w-6 text-gray-600 font-bold text-xs">{row}</span>
            <div className="flex gap-2 md:gap-4">
              {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                const seatId = `${row}${i + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                
                return (
                  <button
                    key={seatId}
                    onClick={() => toggleSeat(seatId)}
                    className={`w-7 h-7 md:w-9 md:h-9 rounded-md transition-all duration-300 
                      ${isSelected 
                        ? "bg-red-600 scale-110 shadow-[0_0_15px_rgba(220,38,38,0.6)]" 
                        : "bg-zinc-800 hover:bg-zinc-700 border border-white/5"}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-zinc-800 rounded-sm" /> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-sm" /> Selected
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Price</p>
            <p className="text-3xl font-black">${selectedSeats.length * SEAT_PRICE}</p>
          </div>
          <button 
            disabled={selectedSeats.length === 0}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:grayscale px-8 py-4 rounded-xl font-bold uppercase tracking-tighter transition-all active:scale-95 shadow-lg shadow-red-600/20"
          >
            Confirm {selectedSeats.length} Seats
          </button>
        </div>
      </div>
    </section>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}