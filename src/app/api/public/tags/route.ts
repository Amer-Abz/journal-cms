import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching public tags:', error);
    return NextResponse.json({ message: 'Error fetching tags' }, { status: 500 });
  }
}
