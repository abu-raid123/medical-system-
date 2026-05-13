"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const VALID_USERNAME = "salah";
const VALID_PASSWORD = "773354060";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "authenticated", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect("/");
  }

  redirect("/login?error=1");
}
