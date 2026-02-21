import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 },
  );

  // Clear the user cookie
  response.cookies.set("user", "", {
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}
