import { NextResponse } from "next/server";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function verifyAdminToken(request: Request): Promise<{ valid: boolean; message?: string; status?: number }> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return { valid: false, message: "Missing authorization header", status: 401 };
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return { valid: false, message: "Missing token", status: 401 };
    }

    return { valid: true };
  } catch (error) {
    console.error("Token verification error:", error);
    return { valid: false, message: "Authentication failed", status: 500 };
  }
}

export function requireAdmin(handler: (request: Request) => Promise<NextResponse>) {
  return async (request: Request) => {
    const verification = await verifyAdminToken(request);

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.message },
        { status: verification.status || 401 }
      );
    }

    return handler(request);
  };
}
