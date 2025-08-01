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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const validation = postTypeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, fields } = validation.data;
    const slug = generateSlug(name);

    const postType = await prisma.postType.update({
      where: { id },
      data: {
        name,
        slug,
        fields,
      },
    });

    return NextResponse.json(postType);
  } catch (error) {
    console.error('Error updating post type:', error);
    return NextResponse.json({ message: 'Error updating post type' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    await prisma.postType.delete({ where: { id } });
    return NextResponse.json({ message: 'Post type deleted successfully' });
  } catch (error) {
    console.error('Error deleting post type:', error);
    return NextResponse.json({ message: 'Error deleting post type' }, { status: 500 });
  }
}
