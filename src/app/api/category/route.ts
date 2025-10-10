import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    // Check if category already exists
    let category = await prisma.category.findUnique({ where: { name } });

    if (!category) {
      category = await prisma.category.create({
        data: { name },
      });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


interface Category {
  name: string; // or you can use id: string if you prefer
}

export async function DELETE(req: Request) {
  try {
    const { name } = (await req.json()) as Category; // category to delete

    // Delete the category by name
    const deletedCategory = await prisma.category.delete({
      where: { name },
    });

    return NextResponse.json(
      { message: "Category deleted successfully", deletedCategory },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);

    // Handle case if category not found
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
