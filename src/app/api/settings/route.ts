import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const settingSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export async function GET() {
  const settings = await prisma.setting.findMany();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validation = settingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { key, value } = validation.data;

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating setting:', error);
    return NextResponse.json({ message: 'Error creating/updating setting' }, { status: 500 });
  }
}
