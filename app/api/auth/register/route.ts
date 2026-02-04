import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar_url: true,
        created_at: true,
      },
    });

    const token = crypto.randomUUID();
    const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar_url,
      },
      token,
      expiry,
    });
  } catch (error) {
    console.error("Registration error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 }
    );
  }
}
