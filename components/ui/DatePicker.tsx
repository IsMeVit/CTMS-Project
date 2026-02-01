"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Showtime {
  id: string;
  time: string;
  date: string;
  available: number;
}

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  showtimes: Showtime[];
}

interface DayInfo {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday?: boolean;
  available: number;
}

export default function DatePicker({ selectedDate, onDateSelect, showtimes }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo<DayInfo[]>(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    const daysArray: DayInfo[] = [];
    
    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      const dateStr = date.toISOString().split('T')[0];
      daysArray.push({
        date: dateStr,
        day,
        isCurrentMonth: false,
        isPast: date < today,
        available: showtimes.filter(s => s.date === dateStr).length
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      daysArray.push({
        date: dateStr,
        day: i,
        isCurrentMonth: true,
        isPast: date < today,
        isToday: dateStr === todayStr,
        available: showtimes.filter(s => s.date === dateStr).length
      });
    }
    
    // Next month days (filled to complete 6 weeks)
    const totalCells = Math.ceil((startingDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - daysArray.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = date.toISOString().split('T')[0];
      daysArray.push({
        date: dateStr,
        day: i,
        isCurrentMonth: false,
        isPast: false,
        available: showtimes.filter(s => s.date === dateStr).length
      });
    }
    
    return daysArray;
  }, [currentMonth, showtimes]);

  const getAvailableCount = (date: string): number => {
    return showtimes.filter(s => s.date === date).reduce((sum, s) => sum + s.available, 0);
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const goToPrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onDateSelect(today.toISOString().split('T')[0]);
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="space-y-3">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-400" />
        </button>
        
        <button onClick={goToToday} className="px-4 py-2">
          <span className="text-lg font-bold text-white">
            {formatMonthYear(currentMonth)}
          </span>
        </button>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map(day => (
          <div key={day} className="text-xs font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        <AnimatePresence mode="wait">
          {days.map((dayInfo, index) => (
            <motion.div
              key={dayInfo.date}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.01 }}
              className="relative"
            >
              <button
                onClick={() => !dayInfo.isPast && dayInfo.available > 0 && onDateSelect(dayInfo.date)}
                disabled={dayInfo.isPast || dayInfo.available === 0}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all relative
                  ${!dayInfo.isCurrentMonth ? 'text-gray-600' : ''}
                  ${dayInfo.isPast ? 'text-gray-600 cursor-not-allowed bg-gray-800/50' : ''}
                  ${dayInfo.isToday && dayInfo.isCurrentMonth ? 'border-2 border-green-500' : ''}
                  ${selectedDate === dayInfo.date && dayInfo.isCurrentMonth && !dayInfo.isPast ? 'bg-red-600 text-white' : ''}
                  ${!dayInfo.isPast && dayInfo.available > 0 && selectedDate !== dayInfo.date ? 'bg-white/10 text-white hover:bg-white/20' : ''}
                  ${dayInfo.available === 0 ? 'opacity-25 cursor-not-allowed' : ''}
                `}
              >
                {dayInfo.day}
                
                {/* Available indicator */}
                {dayInfo.isCurrentMonth && !dayInfo.isPast && dayInfo.available > 0 && (
                  <span className={`
                    absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full
                    ${selectedDate === dayInfo.date ? 'bg-white' : dayInfo.available < 20 ? 'bg-yellow-500' : 'bg-green-500'}
                  `} />
                )}
                
                {/* No showtimes indicator */}
                {dayInfo.isCurrentMonth && !dayInfo.isPast && dayInfo.available === 0 && (
                  <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-gray-500" />
                )}
              </button>
              
              {/* Seat count tooltip on hover */}
              {dayInfo.isCurrentMonth && dayInfo.available > 0 && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {getAvailableCount(dayInfo.date)} seats
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>Limited</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-white/30" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}
