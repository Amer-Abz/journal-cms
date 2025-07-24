import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // In a real application, you would return a JWT or session token here.
    // For now, we'll just return a success message.
    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  }
}
