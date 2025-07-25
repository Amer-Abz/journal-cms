import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateCategorySchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error fetching category with ID ${params.id}:`, error);
    return NextResponse.json({ message: "Error fetching category" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
    }

    const body = await request.json();
    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    if (Object.keys(validation.data).length === 0) {
        return NextResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validation.data,
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    console.error(`Error updating category with ID ${params.id}:`, error);
    return NextResponse.json({ message: "Error updating category" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
     if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    console.error(`Error deleting category with ID ${params.id}:`, error);
    return NextResponse.json({ message: "Error deleting category" }, { status: 500 });
  }
}
