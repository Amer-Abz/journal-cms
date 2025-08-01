'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface PostType {
  id: number;
  name: string;
  slug: string;
  fields: any;
}

export default function PostTypesPage() {
  const t = useTranslations('PostTypesPage');
  const [postTypes, setPostTypes] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostTypes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/post-types');
        if (!response.ok) {
          throw new Error('Failed to fetch post types');
        }
        const data = await response.json();
        setPostTypes(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostTypes();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const fields = formData.get('fields') as string;

    try {
      const response = await fetch('/api/post-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, fields: JSON.parse(fields) }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save post type');
      }

      const newPostType = await response.json();
      setPostTypes((prevPostTypes) => [...prevPostTypes, newPostType]);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link href="/admin/dashboard" className="text-blue-500 hover:underline">
          {t('backLink')}
        </Link>
      </div>

      {isLoading && <p>{t('loading')}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">{t('currentPostTypes')}</h2>
          <ul>
            {postTypes.map((postType) => (
              <li key={postType.id} className="flex justify-between items-center py-2 border-b">
                <span className="font-semibold">{postType.name}</span>
                <span className="text-sm text-gray-500">{postType.slug}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">{t('newPostType')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('nameLabel')}</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="fields" className="block text-sm font-medium text-gray-700">{t('fieldsLabel')}</label>
              <textarea
                name="fields"
                id="fields"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={5}
                placeholder='{ "fieldName": "fieldType", "anotherFieldName": "anotherFieldType" }'
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('saveButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
