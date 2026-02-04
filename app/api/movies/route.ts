import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

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
    const authCheck = await verifyAdminToken(request);
    if (!authCheck.valid) {
      return NextResponse.json({ error: authCheck.message }, { status: authCheck.status });
    }

    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Movie title is required" }, { status: 400 });
    }

    if (body.duration !== undefined && (typeof body.duration !== "number" || body.duration <= 0)) {
      return NextResponse.json({ error: "Valid duration is required" }, { status: 400 });
    }

    const movie = await db.movie.create({
      data: {
        title: body.title.trim(),
        genre: body.genre || "Unknown",
        duration: body.duration || 90,
        description: body.description || "",
        poster_url: body.posterUrl || "",
        rating: typeof body.rating === "number" ? body.rating : 0,
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
