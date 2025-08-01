import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
    return NextResponse.json({ message: 'Error creating upload directory' }, { status: 500 });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    filename: (name, ext) => {
      return `${name.replace(/\s/g, '-')}-${Date.now()}${ext}`;
    },
  });

  try {
    const [fields, files] = await form.parse(request as any);
    const file = files.file;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const uploadedFile = file[0];
    const newFilename = uploadedFile.newFilename;

    return NextResponse.json({ message: 'File uploaded successfully', filePath: `/uploads/${newFilename}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
  }
}
