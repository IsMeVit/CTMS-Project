import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

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
    const body = await request.json();
    const showtime = await db.showtime.create({
      data: {
        movie_id: body.movieId,
        hall_id: body.hallId,
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
