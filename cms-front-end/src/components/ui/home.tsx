"use client"

import React from "react"
import Background from "../layout/background"
import { useRouter } from "next/navigation"


const HomeContent: React.FC = () => {
    const router = useRouter()
  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden text-white">
      
      {/* Background */}
      <Background />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-0" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
          Unlimited{" "}
          <span className="text-red-600 drop-shadow-[0_0_25px_rgba(220,38,38,0.7)]">
            Movies
          </span>{" "}
          & TV Shows
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
          Watch anywhere. Cancel anytime.  
          Ready for your next adventure?  
          Book your seats now and experience cinema like never before.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <button 
            onClick={() => router.push('/movies')}
            className="bg-red-600 hover:bg-red-700 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/30">
            🎟 Get Started
          </button>

          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20">
            🎬 View Schedule
          </button>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent" />
    </section>
  )
}

export default HomeContent
