import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang');

  const where: any = {
    published: true,
  };

  if (lang) {
    where.language = lang;
  }

  try {
    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching public posts:', error);
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}
