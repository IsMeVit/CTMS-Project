"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
  User,
  Calendar,
  Clock,
  DollarSign,
  Camera,
  X,
  Ticket,
  Film,
  Settings,
  LogOut,
  ChevronRight,
  Star,
} from "lucide-react";

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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getCurrentDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ProfileContent() {
  const { user, logout, isAuthenticated, isInitialized, isLoading, updateAvatar } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [showFullAvatar, setShowFullAvatar] = useState(false);
  const { showToast } = useToast();
  const [greeting, setGreeting] = useState(getGreeting());
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    const updateTime = () => {
      setGreeting(getGreeting());
      setCurrentDate(getCurrentDate());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      updateAvatar(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveAvatar = () => {
    updateAvatar("");
  };

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }

    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const loadBookings = () => {
      try {
        const allBookings: Booking[] = JSON.parse(localStorage.getItem("bookings") || "[]");
        if (Array.isArray(allBookings)) {
          const userBookings = allBookings.filter((b) => b.userId === user?.id);
          setBookings(userBookings);
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);
        setBookings([]);
      } finally {
        setBookingsLoading(false);
      }
    };

    const timer = setTimeout(loadBookings, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isInitialized, router, searchParams, user?.id]);

  const handleLogout = () => {
    logout();
    router.push("/home");
  };

  const upcomingBookings = bookings
    .filter((b) => new Date(b.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  const totalSpent = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">👋</span>
            <h1 className="text-2xl md:text-3xl font-bold">
              {greeting}, {user?.name?.split(" ")[0]}!
            </h1>
          </div>
          <p className="text-gray-400 ml-1">{currentDate}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-linear-to-br from-red-600/20 to-red-700/10 border border-red-600/30 rounded-2xl p-6 hover:border-red-500/50 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <Film className="text-red-500 group-hover:scale-110 transition-transform" size={28} />
              <span className="text-xs text-red-400 bg-red-600/20 px-2 py-1 rounded-full">Total</span>
            </div>
            <p className="text-4xl font-bold">{bookings.length}</p>
            <p className="text-gray-400 text-sm mt-1">Bookings</p>
          </div>

          <div className="bg-linear-to-br from-green-600/20 to-green-700/10 border border-green-600/30 rounded-2xl p-6 hover:border-green-500/50 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-green-500 group-hover:scale-110 transition-transform" size={28} />
              <span className="text-xs text-green-400 bg-green-600/20 px-2 py-1 rounded-full">Spent</span>
            </div>
            <p className="text-4xl font-bold">${totalSpent}</p>
            <p className="text-gray-400 text-sm mt-1">Total Spent</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div
                    className="w-28 h-28 rounded-full overflow-hidden border-3 border-red-600 cursor-pointer transition-transform hover:scale-105 ring-4 ring-red-600/20"
                    onClick={() => user?.avatar && setShowFullAvatar(true)}
                  >
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="Profile"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-red-600 to-red-700 flex items-center justify-center">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-gray-800 hover:bg-gray-700 p-2.5 rounded-full border-2 border-gray-700 cursor-pointer transition-all hover:scale-110"
                  >
                    <Camera size={16} />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
              </div>

              {user?.avatar && (
                <button
                  onClick={handleRemoveAvatar}
                  className="w-full text-xs text-red-400 hover:text-red-300 transition-colors py-2 mb-3"
                >
                  Remove Photo
                </button>
              )}

              <div className="border-t border-white/10 pt-4 space-y-2">
                <button
                  onClick={() => router.push("/settings")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} />
                    <span>Edit Profile</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => router.push("/contact")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <User size={18} />
                    <span>Contact Support</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-600/10 transition-colors text-red-400 hover:text-red-300"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </div>
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            {upcomingBookings.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-red-500" size={20} />
                  <h3 className="text-lg font-bold">Upcoming</h3>
                </div>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.reference} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="font-bold text-white mb-2 line-clamp-1">{booking.movie}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar size={14} />
                        <span>
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <Clock size={14} className="ml-2" />
                        <span>{booking.time}</span>
                      </div>
                      <a
                        href={`/ticket?ref=${encodeURIComponent(booking.reference)}`}
                        className="text-red-500 text-sm hover:text-red-400 font-medium flex items-center gap-1"
                      >
                        View Ticket <ChevronRight size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Ticket className="text-red-500" size={20} />
                  <h3 className="text-xl font-bold">Booking History</h3>
                </div>
                <span className="text-sm text-gray-400">{bookings.length} bookings</span>
              </div>

              {bookingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-16 h-24 bg-gray-700 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-6 w-32 bg-gray-700 rounded"></div>
                          <div className="h-4 w-24 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Film size={40} className="text-gray-600" />
                  </div>
                  <p className="text-gray-400 mb-4">No bookings yet</p>
                  <button
                    onClick={() => router.push("/movies")}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
                  >
                    Book Your First Movie
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((booking) => (
                      <div
                        key={booking.reference}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all group"
                      >
                        <div className="flex gap-4">
                          <div className="w-12 h-18 sm:w-16 sm:h-24 bg-linear-to-br from-red-600/30 to-red-700/20 rounded-lg flex items-center justify-center shrink-0">
                            <Film size={28} className="text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-lg truncate group-hover:text-red-400 transition-colors">
                                  {booking.movie}
                                </h4>
                                <p className="text-sm text-gray-400">{booking.reference}</p>
                              </div>
                              <span className="text-lg font-bold text-green-400 ml-2 sm:ml-4 shrink-0">${booking.totalPrice}</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-400 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} className="text-red-500" />
                                <span>
                                  {new Date(booking.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} className="text-red-500" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User size={14} className="text-red-500" />
                                <span>{booking.seats.length} seats</span>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <a
                                href={`/ticket?ref=${encodeURIComponent(booking.reference)}`}
                                className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-400 font-medium transition-colors"
                              >
                                <Ticket size={14} />
                                View Ticket
                              </a>
                              <button
                                onClick={() => router.push("/movies")}
                                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                              >
                                <Film size={14} />
                                Book Again
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-yellow-500" size={20} />
                <h3 className="text-lg font-bold">Account Summary</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                  <p className="text-2xl font-bold">${totalSpent}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Favorite Genre</p>
                  <p className="text-2xl font-bold">Action</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Movies Watched</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFullAvatar && user?.avatar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200"
          onClick={() => setShowFullAvatar(false)}
        >
          <button
            onClick={() => setShowFullAvatar(false)}
            className="absolute top-4 right-4 p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X size={28} />
          </button>
          <Image
            src={user.avatar}
            alt="Profile"
            width={800}
            height={600}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl shadow-red-600/20 animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
