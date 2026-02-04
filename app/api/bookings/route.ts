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
    const userId = searchParams.get("userId");

    if (userId && typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

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
    const authCheck = await verifyAdminToken(request);
    if (!authCheck.valid) {
      return NextResponse.json({ error: authCheck.message }, { status: authCheck.status });
    }

    const body = await request.json();

    if (!body.showtimeId || !isValidId(String(body.showtimeId))) {
      return NextResponse.json({ error: "Valid showtime ID is required" }, { status: 400 });
    }

    if (!body.seatId || !isValidId(String(body.seatId))) {
      return NextResponse.json({ error: "Valid seat ID is required" }, { status: 400 });
    }

    if (typeof body.totalPrice !== "number" || body.totalPrice < 0) {
      return NextResponse.json({ error: "Valid total price is required" }, { status: 400 });
    }

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
