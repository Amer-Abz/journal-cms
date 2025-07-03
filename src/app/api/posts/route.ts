import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Zod schema for post creation
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  language: z.enum(['en', 'ar'], { required_error: "Language must be 'en' or 'ar'" }),
  published: z.boolean().optional().default(false),
  slug: z.string().min(1, "Slug is required"),
  authorId: z.number().int().positive("Author ID must be a positive integer"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { title, content, language, published, slug, authorId } = validation.data;

    // TODO: Add server-side slug generation/validation if needed in future.
    // For now, client must provide a unique slug for the given language.

    const post = await prisma.post.create({
      data: {
        title,
        content,
        language,
        published,
        slug,
        authorId,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    // Check for unique constraint violation for slug + language
    if (error.code === 'P2002' && error.meta?.target?.includes('language') && error.meta?.target?.includes('slug')) {
      return NextResponse.json({ message: "A post with this slug already exists in the selected language." }, { status: 409 });
    }
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "Error creating post" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('lang');

    const whereClause = language ? { language } : {};

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
  }
}
