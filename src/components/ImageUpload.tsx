'use client';

import { useState } from 'react';

interface ImageUploadProps {
  onUpload: (filePath: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'File upload failed');
      }

      const data = await response.json();
      onUpload(data.filePath);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
        Featured Image
      </label>
      <input
        id="image-upload"
        name="image-upload"
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
      />
      {isUploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
