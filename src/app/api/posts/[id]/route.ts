import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Zod schema for post update (all fields optional)
const updatePostSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  content: z.string().optional(),
  // Language change is not typically part of an update for a specific post record;
  // one would create a new post for a different language.
  // language: z.enum(['en', 'ar']).optional(),
  published: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error fetching post with ID ${params.id}:`, error);
    return NextResponse.json({ message: "Error fetching post" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    const body = await request.json();
    const validation = updatePostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    // Ensure there's at least one field to update
    if (Object.keys(validation.data).length === 0) {
        return NextResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: validation.data,
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    // Check for Prisma's record not found error
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    console.error(`Error updating post with ID ${params.id}:`, error);
    return NextResponse.json({ message: "Error updating post" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
     // Check for Prisma's record not found error
     if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    console.error(`Error deleting post with ID ${params.id}:`, error);
    return NextResponse.json({ message: "Error deleting post" }, { status: 500 });
  }
}
