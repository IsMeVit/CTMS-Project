import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === "admin" && password === "admin123") {
    const token = `admin-token-${Date.now()}`;
    localStorage.setItem("adminToken", token);
    return NextResponse.json({ token, username: "admin" });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
