import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST
export async function POST(request: NextRequest) {
  try {
    const { fileUrl, category, fileName, projectId } = await request.json();

    if (!fileUrl || !category || !fileName || !projectId) {
      return NextResponse.json(
        {
          error: "File URL, Category, File Name, and Project ID are required",
        },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        fileUrl,
        category,
        fileName,
        projectId,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
