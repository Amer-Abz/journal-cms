'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/i18n/navigation'; // Updated imports
import { useLocale, useTranslations } from 'next-intl';

interface PostFormState {
  title: string;
  content: string;
  language: string; // Should default to current locale
  published: boolean;
  categoryIds: number[];
  tagIds: number[];
}

interface ApiError {
  message?: string;
  errors?: { [key: string]: string[] | undefined };
}

export default function NewPostPage() {
  const t = useTranslations('NewPostPage');
  const locale = useLocale();
  const router = useRouter();

  const [formState, setFormState] = useState<PostFormState>({
    title: '',
    content: '',
    language: locale, // Default to current viewing language
    published: false,
    categoryIds: [],
    tagIds: [],
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tags'),
        ]);
        const [catData, tagData] = await Promise.all([
          catRes.json(),
          tagRes.json(),
        ]);
        setCategories(catData);
        setTags(tagData);
      } catch (error) {
        console.error("Failed to fetch categories or tags", error);
      }
    };
    fetchCategoriesAndTags();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      // Ensure 'checked' property is accessed for checkboxes
      const { checked } = e.target as HTMLInputElement;
      setFormState(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formState, authorId: 1 }), // Hardcoded authorId
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw errorData;
      }
      // On success, redirect to the posts list page
      router.push('/admin/posts');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Error creating post:", apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link href="/admin/posts" className="text-blue-500 hover:underline">
          {t('backLink')}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t('fieldTitle')}</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formState.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {error?.errors?.title && <p className="text-red-500 text-xs mt-1">{error.errors.title.join(', ')}</p>}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">{t('fieldContent')}</label>
          <textarea
            name="content"
            id="content"
            value={formState.content}
            onChange={handleChange}
            rows={6}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {error?.errors?.content && <p className="text-red-500 text-xs mt-1">{error.errors.content.join(', ')}</p>}
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">{t('fieldLanguage')}</label>
          <select
            name="language"
            id="language"
            value={formState.language}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
          >
            <option value="en">English</option>
            <option value="ar">العربية (Arabic)</option>
          </select>
          {error?.errors?.language && <p className="text-red-500 text-xs mt-1">{error.errors.language.join(', ')}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="published"
            id="published"
            checked={formState.published}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">{t('fieldPublished')}</label>
        </div>
        {error?.errors?.published && <p className="text-red-500 text-xs mt-1">{error.errors.published.join(', ')}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map(category => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={category.id}
                  onChange={e => {
                    const categoryId = parseInt(e.target.value);
                    setFormState(prev => ({
                      ...prev,
                      categoryIds: e.target.checked
                        ? [...prev.categoryIds, categoryId]
                        : prev.categoryIds.filter(id => id !== categoryId)
                    }));
                  }}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {tags.map(tag => (
              <label key={tag.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={tag.id}
                  onChange={e => {
                    const tagId = parseInt(e.target.value);
                    setFormState(prev => ({
                      ...prev,
                      tagIds: e.target.checked
                        ? [...prev.tagIds, tagId]
                        : prev.tagIds.filter(id => id !== tagId)
                    }));
                  }}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>


        {error?.message && !error.errors && <p className="text-red-500 text-sm">{error.message}</p>}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? t('buttonSaving') : t('buttonSave')}
          </button>
        </div>
      </form>
    </div>
  );
}
