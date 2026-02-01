import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const where = userId ? { user_id: userId } : {};

    const bookings = await db.ticket.findMany({
      where,
      include: {
        showtime: {
          include: {
            movie: true,
            hall: true,
          },
        },
        seat: true,
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate reference
    const reference = `BK${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

    const booking = await db.ticket.create({
      data: {
        showtime_id: body.showtimeId,
        seat_id: body.seatId,
        customer_id: body.customerId,
        user_id: body.userId,
        total_price: body.totalPrice,
        reference,
        purchase_time: new Date(),
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
