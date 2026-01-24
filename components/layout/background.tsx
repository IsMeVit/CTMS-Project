"use client";
import React from 'react';

const CinematicBackground: React.FC = () => {
  const bgImage = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000";

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
        <div 
          className="absolute inset-0 scale-110 opacity-40 blur-[100px] animate-ambient-pulse"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-[#050505]/40 via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-linear-to-r from-[#050505] via-transparent to-transparent" />
        
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent" />
      </div>

      <style jsx global>{`
        @keyframes ambient-pulse {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1.05) translate(0, 0); 
          }
          50% { 
            opacity: 0.5; 
            transform: scale(1.15) translate(10px, -5px); 
          }
        }
        .animate-ambient-pulse {
          animation: ambient-pulse 15s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default CinematicBackground;