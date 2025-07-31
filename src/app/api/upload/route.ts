import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

async function mkdir(path: string) {
    try {
        await fs.access(path);
    } catch (error) {
        await fs.mkdir(path, { recursive: true });
    }
}


export async function POST(request: NextRequest) {
    await mkdir(uploadDir);
  const form = formidable({ uploadDir: uploadDir, keepExtensions: true });

  const [fields, files] = await form.parse(request as any);

    const file = files.file;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const filepath = (file as any).newFilename;


  return NextResponse.json({ filepath: `/uploads/${filepath}` });
}
