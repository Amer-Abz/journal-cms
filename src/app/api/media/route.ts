import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  try {
    const files = await fs.readdir(uploadDir);
    const filePaths = files.map((file) => `/uploads/${file}`);
    return NextResponse.json({ files: filePaths });
  } catch (error) {
    console.error('Error reading upload directory:', error);
    return NextResponse.json({ message: 'Error reading upload directory' }, { status: 500 });
  }
}
