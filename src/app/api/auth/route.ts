import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const VALID_USERNAME = "salah";
const VALID_PASSWORD = "773354060";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "authenticated", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.json({ success: true });
}
