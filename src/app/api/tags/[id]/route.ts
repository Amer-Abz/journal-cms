import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateTagSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid tag ID" }, { status: 400 });
    }

    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }
    return NextResponse.json(tag);
  } catch (error) {
    console.error(`Error fetching tag with ID ${params.id}:`, error);
    return NextResponse.json({ message: "Error fetching tag" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid tag ID" }, { status: 400 });
    }

    const body = await request.json();
    const validation = updateTagSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    if (Object.keys(validation.data).length === 0) {
        return NextResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: validation.data,
    });
    return NextResponse.json(updatedTag);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }
    console.error(`Error updating tag with ID ${params.id}:`, error);
    return NextResponse.json({ message: "Error updating tag" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid tag ID" }, { status: 400 });
    }

    await prisma.tag.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Tag deleted successfully" }, { status: 200 });
  } catch (error) {
     if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }
    console.error(`Error deleting tag with ID ${params.id}:`, error);
    return NextResponse.json({ message: "Error deleting tag" }, { status: 500 });
  }
}
