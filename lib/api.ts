interface Movie {
  id: string;
  movie_id: number;
  title: string;
  description: string;
  posterUrl: string;
  poster_url: string;
  duration: number;
  genre: string;
  rating: number;
  createdAt: string;
  created_at: string;
  releaseDate: string;
  endDate: string;
  showtimes: any[];
  showtimes_list?: string[];
  seatConfig: SeatRow[];
  seat_config?: SeatRow[];
}

interface SeatRow {
  rowId: string;
  row_id?: string;
  label: string;
  price: number;
  seats: number;
}

const defaultSeatConfig: SeatRow[] = [
  { rowId: "A", label: "VIP", price: 15, seats: 8 },
  { rowId: "B", label: "VIP", price: 15, seats: 8 },
  { rowId: "C", label: "Regular", price: 12, seats: 8 },
  { rowId: "D", label: "Regular", price: 12, seats: 8 },
  { rowId: "E", label: "Regular", price: 12, seats: 8 },
];

const defaultShowtimes = ["10:00", "14:00", "18:00", "22:00"];

function transformMovie(dbMovie: any): Movie {
  return {
    id: `movie-${dbMovie.movie_id}`,
    movie_id: dbMovie.movie_id,
    title: dbMovie.title,
    description: dbMovie.description || "",
    posterUrl: dbMovie.poster_url || "",
    poster_url: dbMovie.poster_url || "",
    duration: dbMovie.duration,
    genre: dbMovie.genre,
    rating: Number(dbMovie.rating) || 0,
    createdAt: dbMovie.created_at,
    created_at: dbMovie.created_at,
    releaseDate: dbMovie.release_date ? new Date(dbMovie.release_date).toISOString().split("T")[0] : "",
    endDate: dbMovie.end_date ? new Date(dbMovie.end_date).toISOString().split("T")[0] : "",
    showtimes: [],
    showtimes_list: defaultShowtimes,
    seatConfig: defaultSeatConfig,
    seat_config: defaultSeatConfig,
  };
}

export async function getMoviesAPI(): Promise<Movie[]> {
  try {
    const res = await fetch("/api/movies", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    const dbMovies = await res.json();
    return dbMovies.map(transformMovie);
  } catch (error) {
    console.error("API failed, falling back to localStorage:", error);
    if (typeof window === "undefined") return [];
    const movies = localStorage.getItem("adminMovies");
    return movies ? JSON.parse(movies) : [];
  }
}

export async function getMovieAPI(id: string): Promise<Movie | null> {
  try {
    const res = await fetch(`/api/movies/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const dbMovie = await res.json();
    return transformMovie(dbMovie);
  } catch (error) {
    console.error("API failed, falling back to localStorage:", error);
    if (typeof window === "undefined") return null;
    const movies = JSON.parse(localStorage.getItem("adminMovies") || "[]");
    return movies.find((m: Movie) => m.id === id) || null;
  }
}

export async function createMovieAPI(data: Partial<Movie>): Promise<Movie> {
  const res = await fetch("/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create movie");
  }

  const dbMovie = await res.json();
  return transformMovie(dbMovie);
}

export async function updateMovieAPI(id: string, data: Partial<Movie>): Promise<Movie | null> {
  const numericId = id.replace("movie-", "");
  const res = await fetch(`/api/movies/${numericId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) return null;

  const dbMovie = await res.json();
  return transformMovie(dbMovie);
}

export async function deleteMovieAPI(id: string): Promise<boolean> {
  const numericId = id.replace("movie-", "");
  const res = await fetch(`/api/movies/${numericId}`, {
    method: "DELETE",
  });

  return res.ok;
}

export async function getBookingsAPI(userId?: string): Promise<any[]> {
  try {
    const url = userId ? `/api/bookings?userId=${userId}` : "/api/bookings";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (error) {
    console.error("API failed, falling back to localStorage:", error);
    if (typeof window === "undefined") return [];
    const bookings = localStorage.getItem("bookings");
    const allBookings = bookings ? JSON.parse(bookings) : [];
    if (userId) {
      return allBookings.filter((b: any) => b.userId === userId);
    }
    return allBookings;
  }
}

export async function createBookingAPI(data: {
  showtimeId: number;
  seatId: number;
  userId?: string;
  customerId?: number;
  totalPrice: number;
}): Promise<any> {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create booking");
  }

  return await res.json();
}

export async function getShowtimesAPI(movieId?: number): Promise<any[]> {
  try {
    const url = movieId ? `/api/showtimes?movieId=${movieId}` : "/api/showtimes";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch showtimes:", error);
    return [];
  }
}

export async function loginAPI(username: string, password: string): Promise<{ token: string } | null> {
  if (username === "admin" && password === "admin123") {
    const token = `admin-token-${Date.now()}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("adminToken", token);
    }
    return { token };
  }
  return null;
}

export async function logoutAPI(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  }
}

export { defaultSeatConfig, defaultShowtimes };
export type { Movie, SeatRow };
