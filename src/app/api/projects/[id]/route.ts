import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      include: {
        partner: true,
      },
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      projectLeader,
      proponents,
      dateStarted,
      partnerId,
    } = await request.json();

    if (
      !title ||
      !description ||
      !projectLeader ||
      !proponents ||
      !dateStarted ||
      !partnerId
    ) {
      return NextResponse.json(
        {
          error:
            "Title, Description, Project Leader, Proponents, Date Started, and Partner ID are required",
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        projectLeader,
        proponents,
        dateStarted: new Date(dateStarted),
        partnerId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
