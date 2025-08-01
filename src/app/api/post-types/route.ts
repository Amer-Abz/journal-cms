import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

const postTypeSchema = z.object({
  name: z.string(),
  slug: z.string(),
  fields: z.any(),
});

export async function GET() {
  const postTypes = await prisma.postType.findMany();
  return NextResponse.json(postTypes);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validation = postTypeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, fields } = validation.data;
    const slug = generateSlug(name);

    const postType = await prisma.postType.create({
      data: {
        name,
        slug,
        fields,
      },
    });

    return NextResponse.json(postType, { status: 201 });
  } catch (error) {
    console.error('Error creating post type:', error);
    return NextResponse.json({ message: 'Error creating post type' }, { status: 500 });
  }
}
