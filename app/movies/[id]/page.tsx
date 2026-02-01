"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Calendar, Play, Film } from "lucide-react";
import { getMovieAPI } from "@/lib/api";

interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  duration: number;
  genre: string;
  rating: number;
  createdAt: string;
}

function MovieDetailContent() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieAPI(movieId);
        if (data) {
          setMovie(data);
        } else {
          setError("Movie not found");
        }
      } catch {
        setError("Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <Film size={64} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">{error || "Movie Not Found"}</h2>
          <p className="text-gray-400 mb-6">The movie you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {movie.posterUrl && !movie.posterUrl.includes("duckduckgo.com") ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-red-600/30 to-red-700/20 flex items-center justify-center">
            <Film size={120} className="text-red-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        
        <Link
          href="/movies"
          className="absolute top-6 left-6 inline-flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
                  {movie.genre}
                </span>
                {movie.rating > 0 && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-bold rounded-full border border-yellow-500/30">
                    <Star size={14} className="fill-yellow-400" />
                    {movie.rating.toFixed(1)}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black mb-4">{movie.title}</h1>
              
              {movie.description && (
                <p className="text-gray-300 text-lg max-w-2xl mb-6">{movie.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-red-500" />
                  <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-red-500" />
                  <span>Released {new Date(movie.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Play className="text-red-500" />
            Book This Movie
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Duration</p>
              <p className="text-3xl font-bold">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Rating</p>
              <p className="text-3xl font-bold text-yellow-400">{movie.rating.toFixed(1)}/10</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Genre</p>
              <p className="text-xl font-bold">{movie.genre}</p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/booking?movie=${encodeURIComponent(movie.title)}`)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Calendar size={20} />
            Book Tickets
          </button>
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Browse All Movies
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MovieDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <MovieDetailContent />
    </Suspense>
  );
}
