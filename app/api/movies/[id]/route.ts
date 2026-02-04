import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

function isValidId(id: string): boolean {
  const num = parseInt(id, 10);
  return !isNaN(num) && num > 0;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    const movie = await db.movie.findFirst({
      where: { movie_id: parseInt(id) },
      include: {
        showtimes: {
          include: {
            hall: true,
          },
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Failed to fetch movie:", error);
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await verifyAdminToken(request);
    if (!authCheck.valid) {
      return NextResponse.json({ error: authCheck.message }, { status: authCheck.status });
    }

    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    const body = await request.json();

    const movie = await db.movie.update({
      where: { movie_id: parseInt(id) },
      data: {
        title: body.title?.trim(),
        genre: body.genre,
        duration: body.duration,
        description: body.description,
        poster_url: body.posterUrl,
        rating: body.rating,
        release_date: body.releaseDate ? new Date(body.releaseDate) : null,
        end_date: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Failed to update movie:", error);
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await verifyAdminToken(request);
    if (!authCheck.valid) {
      return NextResponse.json({ error: authCheck.message }, { status: authCheck.status });
    }

    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    await db.movie.delete({
      where: { movie_id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete movie:", error);
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}
