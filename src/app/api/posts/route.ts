import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { generateSlug } from '@/lib/utils';

// Zod schema for post creation
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  language: z.enum(['en', 'ar'], { required_error: "Language must be 'en' or 'ar'" }),
  published: z.boolean().optional().default(false),
  authorId: z.number(),
  categoryIds: z.array(z.number()).optional(),
  tagIds: z.array(z.number()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Distinguish between creating a new post and fetching posts
    if (body.action === 'fetch') {
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
    } else {
      const validation = createPostSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
      }

      const { title, content, language, published, authorId, categoryIds, tagIds } = validation.data;
      const slug = generateSlug(title);

      const post = await prisma.post.create({
        data: {
          title,
          slug,
          content,
          language,
          published,
          authorId,
          categories: {
            connect: categoryIds?.map(id => ({ id })),
          },
          tags: {
            connect: tagIds?.map(id => ({ id })),
          },
        },
      });
      return NextResponse.json(post, { status: 201 });
    }
  } catch (error) {
    console.error("Error in POST /api/posts:", error);
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}
