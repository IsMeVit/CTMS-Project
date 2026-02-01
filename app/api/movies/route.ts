import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const movies = await db.movie.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(movies);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const movie = await db.movie.create({
      data: {
        title: body.title,
        genre: body.genre,
        duration: body.duration,
        description: body.description || "",
        poster_url: body.posterUrl || "",
        rating: body.rating || 0,
        release_date: body.releaseDate ? new Date(body.releaseDate) : null,
        end_date: body.endDate ? new Date(body.endDate) : null,
      },
    });
    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error("Failed to create movie:", error);
    return NextResponse.json({ error: "Failed to create movie" }, { status: 500 });
  }
}
