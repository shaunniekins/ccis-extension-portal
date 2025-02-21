import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all users
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// POST: Create a new user
export async function POST(request: NextRequest) {
  const data = await request.json();
  const user = await prisma.user.create({
    data,
  });
  return NextResponse.json(user);
}
