import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only return non-sensitive configuration
  return NextResponse.json({
    region: process.env.SUPABASE_S3_REGION,
    endpoint: process.env.SUPABASE_S3_ENDPOINT,
  });
}
