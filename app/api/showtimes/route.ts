import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

function isValidId(id: string): boolean {
  const num = parseInt(id, 10);
  return !isNaN(num) && num > 0;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (movieId && !isValidId(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    const where = movieId ? { movie_id: parseInt(movieId) } : {};

    const showtimes = await db.showtime.findMany({
      where,
      include: {
        movie: true,
        hall: true,
      },
      orderBy: [{ show_date: "asc" }, { show_time: "asc" }],
    });

    return NextResponse.json(showtimes);
  } catch (error) {
    console.error("Failed to fetch showtimes:", error);
    return NextResponse.json({ error: "Failed to fetch showtimes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = await verifyAdminToken(request);
    if (!authCheck.valid) {
      return NextResponse.json({ error: authCheck.message }, { status: authCheck.status });
    }

    const body = await request.json();

    if (!body.movieId || !isValidId(String(body.movieId))) {
      return NextResponse.json({ error: "Valid movie ID is required" }, { status: 400 });
    }

    if (!body.showDate || isNaN(new Date(body.showDate).getTime())) {
      return NextResponse.json({ error: "Valid show date is required" }, { status: 400 });
    }

    if (!body.showTime || typeof body.showTime !== "string") {
      return NextResponse.json({ error: "Show time is required" }, { status: 400 });
    }

    if (typeof body.price !== "number" || body.price < 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
    }

    const showtime = await db.showtime.create({
      data: {
        movie_id: body.movieId,
        hall_id: body.hallId || 1,
        show_date: new Date(body.showDate),
        show_time: body.showTime,
        price: body.price,
      },
    });
    return NextResponse.json(showtime, { status: 201 });
  } catch (error) {
    console.error("Failed to create showtime:", error);
    return NextResponse.json({ error: "Failed to create showtime" }, { status: 500 });
  }
}
