"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X, Plus, Trash2, Clock, Calendar, Armchair } from "lucide-react";
import { createMovieAPI, defaultSeatConfig, defaultShowtimes, type SeatRow } from "@/lib/api";
import { sanitizeString, validateURL } from "@/lib/sanitize";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function validateFileType(file: File): Promise<boolean> {
  const signatures: Record<string, number[]> = {
    "image/jpeg": [0xff, 0xd8, 0xff],
    "image/png": [0x89, 0x50, 0x4e, 0x47],
    "image/gif": [0x47, 0x49, 0x46, 0x38],
    "image/webp": [0x52, 0x49, 0x46, 0x46],
  };

  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const headerHex = Array.from(bytes.slice(0, 4)).map(b => b.toString(16).padStart(2, "0")).join("");

  for (const [type, sig] of Object.entries(signatures)) {
    const sigHex = sig.map(b => b.toString(16).padStart(2, "0")).join("");
    if (headerHex.startsWith(sigHex)) {
      return true;
    }
  }

  return false;
}

export default function NewMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    posterUrl: "",
    duration: 120,
    genre: "Action",
    rating: 7.0,
    releaseDate: new Date().toISOString().split("T")[0],
    endDate: "",
    showtimes: [...defaultShowtimes] as string[],
    seatConfig: [...defaultSeatConfig] as SeatRow[],
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const expiry = localStorage.getItem("adminTokenExpiry");
    if (!token || !expiry || Date.now() > parseInt(expiry, 10)) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, poster: "Image must be less than 5MB" }));
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, poster: "File must be a valid image (JPEG, PNG, GIF, WebP)" }));
      return;
    }

    const isValid = await validateFileType(file);
    if (!isValid) {
      setErrors(prev => ({ ...prev, poster: "File type validation failed" }));
      return;
    }

    setErrors(prev => ({ ...prev, poster: "" }));

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setForm({ ...form, posterUrl: base64 });
        setPreviewUrl(base64);
      };
      reader.onerror = () => {
        setErrors(prev => ({ ...prev, poster: "Failed to read file" }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to read file:", error);
      setErrors(prev => ({ ...prev, poster: "Failed to upload image" }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm({ ...form, posterUrl: "" });
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addShowtime = () => {
    setForm({ ...form, showtimes: [...form.showtimes, "12:00"] });
  };

  const removeShowtime = (index: number) => {
    const newShowtimes = form.showtimes.filter((_, i) => i !== index);
    setForm({ ...form, showtimes: newShowtimes });
  };

  const updateShowtime = (index: number, value: string) => {
    const newShowtimes = form.showtimes.map((t, i) => (i === index ? value : t));
    setForm({ ...form, showtimes: newShowtimes });
  };

  const addSeatRow = () => {
    const newRowId = String.fromCharCode(65 + form.seatConfig.length);
    setForm({
      ...form,
      seatConfig: [
        ...form.seatConfig,
        { rowId: newRowId, label: "Regular", price: 12, seats: 8 },
      ],
    });
  };

  const removeSeatRow = (index: number) => {
    const newConfig = form.seatConfig.filter((_, i) => i !== index);
    setForm({ ...form, seatConfig: newConfig });
  };

  const updateSeatRow = (index: number, field: keyof SeatRow, value: string | number) => {
    const newConfig = form.seatConfig.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setForm({ ...form, seatConfig: newConfig });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    const sanitizedTitle = sanitizeString(form.title);
    if (!sanitizedTitle || sanitizedTitle.trim().length === 0) {
      newErrors.title = "Movie title is required";
    } else if (sanitizedTitle.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (form.duration < 1 || form.duration > 600) {
      newErrors.duration = "Duration must be between 1 and 600 minutes";
    }

    if (form.rating < 0 || form.rating > 10) {
      newErrors.rating = "Rating must be between 0 and 10";
    }

    if (form.releaseDate && form.endDate && new Date(form.endDate) < new Date(form.releaseDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (form.posterUrl && !form.posterUrl.startsWith("data:")) {
      if (!validateURL(form.posterUrl)) {
        newErrors.posterUrl = "Invalid poster URL format";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await createMovieAPI({
        ...form,
        title: sanitizedTitle,
        description: sanitizeString(form.description),
      });
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Failed to create movie:", error);
      setErrors({ submit: "Failed to create movie. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Animation",
    "Documentary",
    "Fantasy",
  ];

  return (
    <div className="min-h-screen text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">Add New Movie</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`w-full bg-white/5 border ${errors.title ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors`}
                placeholder="Movie title"
                maxLength={200}
                required
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Duration (min) *</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
                  className={`w-full bg-white/5 border ${errors.duration ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors`}
                  min="1"
                  max="600"
                  required
                />
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Movie Poster</label>
              {errors.poster && <p className="text-red-500 text-sm mb-2">{errors.poster}</p>}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-white/5">
                    <img
                      src={previewUrl}
                      alt="Poster preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-64 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-red-600 hover:bg-white/5 transition-all"
                >
                  {uploading ? (
                    <>
                      <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-400">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={32} className="text-gray-500" />
                      <span className="text-gray-400">Click to upload poster</span>
                      <span className="text-xs text-gray-600">PNG, JPG up to 5MB</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Or enter Poster URL</label>
              <input
                type="url"
                value={form.posterUrl}
                onChange={(e) => {
                  setForm({ ...form, posterUrl: e.target.value });
                  setPreviewUrl(e.target.value);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Genre *</label>
                <select
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                >
                  {genres.map((g) => (
                    <option className="bg-gray-900" key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Duration (min) *</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
                  className={`w-full bg-white/5 border ${errors.duration ? "border-red-500" : "border-white/10"} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors`}
                  min="1"
                  max="600"
                  required
                />
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Rating (0-10)</label>
              <input
                type="number"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                min="0"
                max="10"
                step="0.1"
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={20} className="text-red-500" />
                <h3 className="text-lg font-bold">Show Schedule</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={form.releaseDate}
                    onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-400">Showtimes</label>
                  {form.showtimes.map((time, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Clock size={18} className="text-gray-500" />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateShowtime(idx, e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                      />
                      {form.showtimes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeShowtime(idx)}
                          className="p-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={addShowtime}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium"
                >
                  <Plus size={18} />
                  Add Showtime
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Armchair size={20} className="text-red-500" />
                <h3 className="text-lg font-bold">Seat Configuration</h3>
              </div>

              <div className="space-y-4">
                {form.seatConfig.map((row, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-4">
                    <input
                      type="text"
                      value={row.rowId}
                      onChange={(e) => updateSeatRow(index, "rowId", e.target.value)}
                      className="w-16 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-center font-bold"
                      placeholder="A"
                    />
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => updateSeatRow(index, "label", e.target.value)}
                      className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="VIP / Regular"
                    />
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => updateSeatRow(index, "price", parseInt(e.target.value) || 0)}
                      className="w-24 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="$"
                      min="0"
                    />
                    <span className="text-gray-400 text-sm">per seat</span>
                    <input
                      type="number"
                      value={row.seats}
                      onChange={(e) => updateSeatRow(index, "seats", parseInt(e.target.value) || 0)}
                      className="w-20 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="Seats"
                      min="1"
                    />
                    {form.seatConfig.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSeatRow(index)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSeatRow}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium"
                >
                  <Plus size={18} />
                  Add Row
                </button>
              </div>

              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Total Seats: {form.seatConfig.reduce((sum, row) => sum + row.seats, 0)}</p>
                <div className="flex gap-2 flex-wrap">
                  {form.seatConfig.map((row) => (
                    <span key={row.rowId} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                      Row {row.rowId}: {row.seats} seats × ${row.price}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/10">
              {errors.submit && <p className="text-red-500 text-sm w-full text-center mb-2">{errors.submit}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
              >
                <Save size={18} />
                {loading ? "Creating..." : "Create Movie"}
              </button>
              <Link
                href="/admin/dashboard"
                className="flex-1 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
