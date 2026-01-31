"use client"

import { useState, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieTitle = searchParams.get('movie') || "Movie";
  const selectedDate = searchParams.get('date') || "";
  const selectedTime = searchParams.get('time') || "";
  const showtimeId = searchParams.get('showtimeId') || "";

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const SEAT_PRICE = 12;
  const ROWS = ["A", "B", "C", "D", "E"];
  const SEATS_PER_ROW = 8;

  const toggleSeat = (id: string) => {
    setSelectedSeats(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const generateBookingReference = useCallback(() => {
    return `BK${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
  }, []);

  const confirmBooking = useCallback(() => {
    if (selectedSeats.length === 0) return;
    
    // Generate booking reference
    const ref = generateBookingReference();
    setBookingReference(ref);
    
    // Store booking data (using localStorage for now)
    const booking = {
      reference: ref,
      movie: movieTitle,
      date: selectedDate,
      time: selectedTime,
      showtimeId,
      seats: selectedSeats,
      totalPrice: selectedSeats.length * SEAT_PRICE,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage (this will be moved to a proper backend later)
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));
    
    // Redirect to ticket page
    router.push(`/ticket?ref=${ref}`);
  }, [selectedSeats, movieTitle, selectedDate, selectedTime, showtimeId, generateBookingReference, router]);

  const newBooking = () => {
    setSelectedSeats([]);
    setBookingConfirmed(false);
    setBookingReference("");
    router.push('/movies');
  };

  if (bookingConfirmed) {
    return (
      <section className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-red-600 font-bold text-xl mb-4">{bookingReference}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-8">
            <h2 className="text-lg font-bold mb-4">Booking Details</h2>
            <div className="space-y-2 text-left">
              <p className="text-gray-400"><span className="text-white">Movie:</span> {movieTitle}</p>
              <p className="text-gray-400"><span className="text-white">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              <p className="text-gray-400"><span className="text-white">Time:</span> {selectedTime}</p>
              <p className="text-gray-400"><span className="text-white">Seats:</span> {selectedSeats.join(', ')}</p>
              <p className="text-gray-400"><span className="text-white">Total:</span> ${selectedSeats.length * SEAT_PRICE}</p>
            </div>
          </div>

          <button 
            onClick={newBooking}
            className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold uppercase tracking-tighter transition-all active:scale-95"
          >
            Make Another Booking
          </button>
        </div>
      </section>
    );
  }

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
        {selectedDate && selectedTime && (
          <p className="text-gray-400 mt-2 text-sm">
            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
          </p>
        )}
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
            onClick={confirmBooking}
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