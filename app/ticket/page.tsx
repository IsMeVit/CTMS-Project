"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Download, Calendar, Clock, MapPin, User, CreditCard, Share2 } from "lucide-react";

interface TicketData {
  reference: string;
  movie: string;
  date: string;
  time: string;
  showtimeId: string;
  seats: string[];
  totalPrice: number;
  timestamp: string;
  cinemaName: string;
  screen: string;
}

function TicketContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const validateReference = (ref: string | null): boolean => {
    if (!ref) return false;
    const pattern = /^BK\d{6,12}$/;
    const decoded = decodeURIComponent(ref);
    return pattern.test(decoded) && decoded.length >= 8 && decoded.length <= 15;
  };

  const handleRedirect = useCallback((type: 'login' | 'profile' | 'error', message?: string) => {
    if (type === 'login') {
      router.push('/login');
    } else if (type === 'profile') {
      router.push('/profile?error=' + encodeURIComponent(message || 'ticket_not_found'));
    }
  }, [router]);

  const handleDownload = () => {
    if (!ticketData) return;
    
    const ticketContent = `
CINEMA TICKET - ${ticketData.reference || 'N/A'}
=========================================
${ticketData.cinemaName || 'CTMS Cinemas'}
${ticketData.screen || 'Screen 1'}

Movie: ${ticketData.movie || 'N/A'}
Date: ${ticketData.date ? new Date(ticketData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
Time: ${ticketData.time || 'N/A'}
Seats: ${ticketData.seats?.join(', ') || 'N/A'}

Price: $${ticketData.totalPrice || 0}
Customer: ${user?.name || 'N/A'}

Booked on: ${ticketData.timestamp ? new Date(ticketData.timestamp).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}

Please arrive 15 minutes before showtime.
=========================================
    `.trim();

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${ticketData.reference || 'unknown'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!ticketData) return;
    
    const shareText = `I just booked tickets for ${ticketData.movie || 'Unknown Movie'} on ${ticketData.date ? new Date(ticketData.date).toLocaleDateString() : 'Unknown Date'} at ${ticketData.time || 'Unknown Time'}! 🎬🍿 Booking Reference: ${ticketData.reference || 'N/A'}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cinema Ticket',
          text: shareText
        });
      } catch {
        // User cancelled or share failed silently
      }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast('success', 'Ticket details copied to clipboard!');
      } catch {
        fallbackCopyToClipboard(shareText);
      }
    } else {
      fallbackCopyToClipboard(shareText);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('success', 'Ticket details copied to clipboard!');
    } catch {
      showToast('error', 'Failed to copy. Please copy manually.');
    }
    document.body.removeChild(textArea);
  };

  const handleEmail = () => {
    if (!ticketData) return;
    
    const subject = `Your Cinema Ticket - ${ticketData.reference || 'N/A'}`;
    const body = `
Hi ${user?.name || 'Customer'},

Thank you for booking with CTMS Cinemas!

Booking Details:
- Reference: ${ticketData.reference || 'N/A'}
- Movie: ${ticketData.movie || 'N/A'}
- Date: ${ticketData.date ? new Date(ticketData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
- Time: ${ticketData.time || 'N/A'}
- Screen: ${ticketData.screen || 'Screen 1'}
- Seats: ${ticketData.seats?.join(', ') || 'N/A'}
- Total: $${ticketData.totalPrice || 0}

Please arrive 15 minutes before showtime.

See you at the movies!
CTMS Cinemas Team
    `.trim();

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    let mounted = true;
    
    if (!isAuthenticated) {
      handleRedirect('login');
      return;
    }

    const referenceParam = searchParams.get('ref');
    
    if (!validateReference(referenceParam)) {
      if (mounted) {
        setError(referenceParam ? 'Invalid ticket reference format' : 'No ticket reference provided');
        setRedirecting(true);
        setTimeout(() => handleRedirect('profile', 'invalid_reference'), 3000);
      }
      return;
    }

    const reference = decodeURIComponent(referenceParam!);

    const loadTicketData = () => {
      if (!mounted) return;
      
      try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const booking = bookings.find((b: TicketData) => b.reference === reference);
        
        if (mounted) {
          if (booking) {
            setTicketData({
              ...booking,
              cinemaName: "CTMS Cinemas Main Branch",
              screen: "Screen 1"
            });
            setError(null);
          } else {
            setError('Ticket not found');
            setRedirecting(true);
            setTimeout(() => handleRedirect('profile', 'ticket_not_found'), 3000);
          }
        }
      } catch (err) {
        console.error('Failed to load ticket:', err);
        if (mounted) {
          setError('Failed to load ticket data');
          setRedirecting(true);
          setTimeout(() => handleRedirect('profile', 'load_error'), 3000);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(loadTicketData, 100);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [isAuthenticated, router, searchParams, handleRedirect]);

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (error || redirecting) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {error || 'Ticket Access Error'}
          </h2>
          <p className="text-gray-400 mb-6">
            {redirecting 
              ? 'Redirecting you to profile page...' 
              : 'Please check your ticket reference and try again.'
            }
          </p>
          <button 
            onClick={() => router.push('/profile')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            {redirecting ? 'Go to Profile →' : 'Back to Profile'}
          </button>
        </div>
      </div>
    );
  }

  if (!ticketData && !loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🎫</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Ticket Not Found</h2>
          <p className="text-gray-400 mb-6">
            The ticket reference you&apos;re looking for doesn&apos;t exist or may have expired.
          </p>
          <button 
            onClick={() => router.push('/profile')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => router.push('/profile')}
            className="text-gray-500 hover:text-white mb-4 transition-colors"
          >
            ← Back to Profile
          </button>
        </div>

        <div className="bg-linear-to-br from-red-900/20 to-black/40 backdrop-blur-xl border border-red-600/30 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-linear-to-r from-red-600 to-red-800 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black mb-2">CINEMA TICKET</h1>
                <p className="text-red-100 font-mono">{ticketData?.reference}</p>
              </div>
              <div className="text-right">
                <p className="text-red-100 text-sm">CTMS Cinemas</p>
                <p className="text-xs text-red-200">Official Ticket</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{ticketData?.movie}</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} />
                <span>{ticketData?.cinemaName} - {ticketData?.screen}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="text-red-500" size={20} />
                  <span className="text-sm font-medium text-gray-400">DATE</span>
                </div>
                <p className="text-xl font-bold">
                  {ticketData?.date ? new Date(ticketData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'N/A'}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="text-red-500" size={20} />
                  <span className="text-sm font-medium text-gray-400">TIME</span>
                </div>
                <p className="text-xl font-bold">{ticketData?.time || 'N/A'}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <User className="text-red-500" size={20} />
                <span className="text-sm font-medium text-gray-400">SEATS</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ticketData?.seats?.map((seat) => (
                  <span key={seat} className="bg-red-600/20 text-red-400 px-3 py-1 rounded-lg font-mono font-bold">
                    {seat}
                  </span>
                )) || []}
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-gray-400">Customer</p>
                  <p className="font-semibold">{user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Total Paid</p>
                  <p className="text-2xl font-black text-green-400">${ticketData?.totalPrice || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-300 font-medium">
                ⚠️ Please arrive 15 minutes before showtime. Latecomers may not be admitted.
              </p>
            </div>
          </div>

          <div className="bg-black/30 p-6 flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={handleEmail}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              Email
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This is an official CTMS Cinemas ticket. Please keep it safe and present it at the entrance.</p>
          <p className="mt-2">For support, contact us at support@ctms.com or call +1-800-CINEMA</p>
        </div>
      </div>
    </div>
  );
}

export default function TicketPage() {
  return (
    <Suspense fallback={<div className="min-h-screen text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading ticket...</p>
      </div>
    </div>}>
      <TicketContent />
    </Suspense>
  );
}