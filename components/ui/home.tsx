"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, Gift, Calendar,
  Play, Star, TrendingUp, ChevronRight,
  Sparkles, Heart, Search, Clock, Ticket
} from "lucide-react";
import { getMoviesAPI } from "@/lib/api";

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

const quickActions = [
  { id: 1, icon: Film, label: "Movies", color: "from-red-500 to-red-700", path: "/movies", description: "Browse all movies" },
  { id: 2, icon: Gift, label: "Rewards", color: "from-purple-500 to-purple-700", path: "/profile", description: "Earn points" },
  { id: 3, icon: Calendar, label: "Schedule", color: "from-blue-500 to-blue-700", path: "/movies", description: "View showtimes" },
  { id: 4, icon: Ticket, label: "My Tickets", color: "from-green-500 to-green-700", path: "/profile", description: "View bookings" },
];

const testimonials = [
  { id: 1, name: "M.Magamind.", text: "Quality cinema ever!", rating: 5 },
  { id: 2, name: "Monkey D. Grap", text: "Best cinema experience ever!", rating: 5 },
  { id: 3, name: "Nikola Tesla", text: "⚡︎⚡︎⚡︎⚡︎⚡︎⚡︎⚡︎⚡︎⚡︎⚡︎", rating: 5 },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [totalMovies, setTotalMovies] = useState(12);

  useEffect(() => {
    setMounted(true);

    const fetchMovies = async () => {
      try {
        const movies = await getMoviesAPI();
        const sorted = [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setFeaturedMovies(sorted.slice(0, 3));
        setTotalMovies(movies.length || 12);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/movies");
    } else {
      router.push("/signup");
    }
  };

  const handleBrowseMovies = () => {
    router.push("/movies");
  };

  const handleQuickAction = (path: string) => {
    router.push(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="relative flex items-center justify-center min-h-screen px-4 py-20">
        <div className="relative z-10 text-center max-w-5xl mx-auto w-full">
          
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-gray-300">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              {isAuthenticated ? `Welcome back, ${user?.name || 'Movie Lover'}!` : 'Welcome to CTMS Cinemas'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight"
          >
            <span className="text-white">UNLIMITED</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-red-600 to-red-500 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse">
              MOVIES
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Experience cinema like never before with premium seats, stunning visuals, and unforgettable moments.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            onSubmit={handleSearch}
            className="max-w-xl mx-auto mb-10"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-white font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(220,38,38,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-4 bg-linear-to-r from-red-600 to-red-500 rounded-2xl font-bold text-lg text-white shadow-2xl shadow-red-600/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-red-500 to-red-400 opacity-0 group-hover:opacity-30 transition-opacity" />
              <span className="relative flex items-center gap-2">
                <Play className="w-5 h-5" />
                {isAuthenticated ? "Browse Movies" : "Get Started Free"}
              </span>
            </motion.button>

            <motion.button
              onClick={handleBrowseMovies}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-2xl font-semibold text-lg text-white border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:border-white/50 transition-all flex items-center gap-2"
            >
              <Film className="w-5 h-5" />
              View Schedule
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 md:gap-12 pt-8 border-t border-white/10"
          >
            {[
              { value: `${totalMovies}+`, label: "Movies", icon: Film, sublabel: "Available" },
              { value: "4", label: "New", icon: TrendingUp, sublabel: "This Week" },
              { value: "100%", label: "Satisfaction", icon: Heart, sublabel: "Guaranteed" },
              { value: "24/7", label: "Support", icon: Clock, sublabel: "Always Here" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative px-4 py-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-red-600 via-red-500 to-purple-600 p-8 md:p-12">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">New Releases This Week!</h3>
                <p className="text-red-100">Don&apos;t miss out on the hottest movies now showing</p>
              </div>
              <motion.button
                onClick={handleBrowseMovies}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Book Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-red-500" />
                Featured Today
              </h2>
              <p className="text-gray-400 mt-1">Handpicked movies just for you</p>
            </div>
            <button 
              onClick={handleBrowseMovies}
              className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
            >
              View All Movies <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {featuredMovies.length > 0 ? (
                featuredMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ y: -10 }}
                    className="group relative cursor-pointer"
                    onClick={handleBrowseMovies}
                  >
                    <div className="relative aspect-2/3 rounded-3xl overflow-hidden">
                      {movie.posterUrl && !movie.posterUrl.includes("duckduckgo.com") ? (
                        <Image
                          src={movie.posterUrl}
                          alt={movie.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-red-600/30 to-red-700/20 flex items-center justify-center">
                          <span className="text-6xl">🎬</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                      
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-white">{movie.rating.toFixed(1)}</span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-xs text-red-400 font-medium mb-2 uppercase tracking-wider">{movie.genre}</p>
                        <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors mb-2">
                          {movie.title}
                        </h3>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <Play className="w-4 h-4" /> Click to book
                        </motion.div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-sm">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl shadow-red-600/50"
                        >
                          <Play className="w-10 h-10 text-white ml-1" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative aspect-2/3 rounded-3xl overflow-hidden bg-white/5 animate-pulse"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="w-16 h-16 text-gray-600" />
                    </div>
                  </div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="relative px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Quick Actions</h2>
            <p className="text-gray-400">Access everything you need in one place</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction(action.path)}
                className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all overflow-hidden text-left"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${action.color} opacity-0 group-hover:opacity-15 transition-opacity`} />
                <div className={`relative w-14 h-14 rounded-2xl bg-linear-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <p className="relative text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                  {action.label}
                </p>
                <p className="relative text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {action.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What Our Customers Say</h2>
            <p className="text-gray-400">Join thousands of happy moviegoers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">&quot;{item.text}&quot;</p>
                <p className="text-white font-semibold">— {item.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30"
        >
          <ChevronRight className="w-6 h-6 text-white rotate-90" />
        </motion.button>
      </motion.div>
    </section>
  );
}
