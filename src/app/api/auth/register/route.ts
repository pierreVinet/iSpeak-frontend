import { REGISTER_OPEN } from "@/lib/config";
import { createUser } from "@/server/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!REGISTER_OPEN) {
      return NextResponse.json(
        {
          error: "Registration is closed",
        },
        { status: 400 }
      );
    }

    const user = await createUser(email, password, name);

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 400 }
    );
  }
}
