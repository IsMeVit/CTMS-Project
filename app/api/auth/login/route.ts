import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (username === adminUsername && password === adminPassword) {
    const token = `admin-token-${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).substring(2)}`;
    const expiry = Date.now() + 3600000;
    if (typeof window !== "undefined") {
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminTokenExpiry", String(expiry));
    }
    return NextResponse.json({ token, username: "admin", expiry });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
