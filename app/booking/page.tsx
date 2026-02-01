"use client";

import { useState, Suspense, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getMoviesAPI, type SeatRow, type Movie } from "@/lib/api";

interface SelectedSeat {
  rowId: string;
  seatNumber: number;
  price: number;
  label: string;
}

interface Booking {
  reference: string;
  userId: string;
  movie: string;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  timestamp: string;
}

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isInitialized } = useAuth();

  const movieTitle = searchParams.get("movie") || "Movie";
  const selectedDate = searchParams.get("date") || "";
  const selectedTime = searchParams.get("time") || "";

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchMovie = async () => {
      try {
        const movies = await getMoviesAPI();
        const allMovies = Array.isArray(movies) ? movies : [];
        const found = allMovies.find((m) => m.title === movieTitle);
        if (found) {
          setMovie(found);

          const allBookings: Booking[] = JSON.parse(localStorage.getItem("bookings") || "[]");
          const existingBookedSeats = allBookings
            .filter(
              (b) =>
                b.movie === movieTitle &&
                b.date === selectedDate &&
                b.time === selectedTime &&
                b.userId !== user?.id
            )
            .flatMap((b) => b.seats);
          setBookedSeats(existingBookedSeats);
        }
      } catch (error) {
        console.error("Failed to load movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [isAuthenticated, isInitialized, router, movieTitle, selectedDate, selectedTime, user?.id]);

  const toggleSeat = (rowId: string, seatNumber: number, price: number, label: string) => {
    const seatId = `${rowId}${seatNumber}`;
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.rowId === rowId && s.seatNumber === seatNumber);
      if (exists) {
        return prev.filter((s) => !(s.rowId === rowId && s.seatNumber === seatNumber));
      } else {
        return [...prev, { rowId, seatNumber, price, label }];
      }
    });
  };

  const generateBookingReference = useCallback(() => {
    return `BK${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
  }, []);

  const confirmBooking = useCallback(() => {
    if (selectedSeats.length === 0) return;

    const ref = generateBookingReference();
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    const booking = {
      reference: ref,
      userId: user?.id || "guest",
      movie: movieTitle,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats.map((s) => `${s.rowId}${s.seatNumber}`),
      totalPrice,
      timestamp: new Date().toISOString(),
    };

    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify([...existingBookings, booking]));

    router.push(`/ticket?ref=${ref}`);
  }, [selectedSeats, movieTitle, selectedDate, selectedTime, generateBookingReference, router, user?.id]);

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const rows = movie?.seatConfig || [
    { rowId: "A", label: "VIP", price: 15, seats: 8 },
    { rowId: "B", label: "VIP", price: 15, seats: 8 },
    { rowId: "C", label: "Regular", price: 12, seats: 8 },
    { rowId: "D", label: "Regular", price: 12, seats: 8 },
    { rowId: "E", label: "Regular", price: 12, seats: 8 },
  ];

  return (
    <section className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 flex flex-col items-center">
      <div className="mb-12 text-center">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-white mb-4 transition-colors">
          ← Back to Movies
        </button>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          Booking: <span className="text-red-600">{movieTitle}</span>
        </h1>
        {selectedDate && selectedTime && (
          <p className="text-gray-400 mt-2 text-sm">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            at {selectedTime}
          </p>
        )}
      </div>

      <div className="w-full max-w-2xl mb-16 relative">
        <div className="h-1 w-full bg-linear-to-r from-transparent via-red-600 to-transparent shadow-[0_-10px_20px_rgba(220,38,38,0.8)]" />
        <p className="text-center text-[10px] text-gray-500 uppercase tracking-[0.5em] mt-4">Screen</p>
      </div>

      <div className="grid gap-4 mb-12 bg-white/5 p-8 rounded-3xl border border-white/10 w-full max-w-2xl">
        {rows.map((row: SeatRow) => (
          <div key={row.rowId} className="flex gap-3 items-center">
            <span className="w-6 text-gray-600 font-bold text-xs">{row.rowId}</span>
            <div className="flex gap-2 md:gap-4 flex-wrap">
              {Array.from({ length: row.seats }).map((_, i) => {
                const seatId = `${row.rowId}${i + 1}`;
                const isSelected = selectedSeats.some((s) => s.rowId === row.rowId && s.seatNumber === i + 1);
                const isBooked = bookedSeats.includes(seatId);

                return (
                  <button
                    key={seatId}
                    onClick={() => toggleSeat(row.rowId, i + 1, row.price, row.label)}
                    disabled={isBooked}
                    className={`w-7 h-7 md:w-9 md:h-9 rounded-md transition-all duration-300 ${
                      isBooked
                        ? "bg-gray-800/50 border border-gray-700 cursor-not-allowed opacity-40"
                        : isSelected
                        ? "bg-red-600 scale-110 shadow-[0_0_15px_rgba(220,38,38,0.6)]"
                        : "bg-zinc-800 hover:bg-zinc-700 border border-white/5"
                    }`}
                    title={`Row ${row.rowId} Seat ${i + 1} - $${isBooked ? "Booked" : row.price}`}
                  />
                );
              })}
            </div>
            <span className="text-xs text-gray-500 ml-2">${row.price}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-zinc-800 rounded-sm" /> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-800/50 rounded-sm" /> Booked
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-sm" /> Selected
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <h4 className="text-sm font-bold text-gray-400 mb-2">Selected Seats:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <span
                  key={`${seat.rowId}${seat.seatNumber}`}
                  className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm"
                >
                  {seat.rowId}{seat.seatNumber} (${seat.price})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Price</p>
            <p className="text-3xl font-black">${totalPrice}</p>
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
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
