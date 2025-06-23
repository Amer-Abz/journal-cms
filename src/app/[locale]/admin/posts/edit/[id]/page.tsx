'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter, Link } from '@/i18n/navigation'; // Updated imports
// import { usePathname } from '@/i18n/navigation'; // If usePathname is needed, it would also come from here
import { useLocale, useTranslations } from 'next-intl';

interface PostFormState {
  title: string;
  content: string;
  // Language is usually not changed on edit, it defines the record itself
  // language: string;
  published: boolean;
}

interface Post extends PostFormState {
  id: number;
  language: string; // Still need this to display, even if not editable
}

interface ApiError {
  message?: string;
  errors?: { [key: string]: string[] | undefined };
}

export default function EditPostPage({ params }: { params: { id: string; locale: string }}) {
  const t = useTranslations('EditPostPage');
  const currentLocale = useLocale(); // This is the page's active locale
  const router = useRouter();
  // const pathname = usePathname(); // /admin/posts/edit/1

  const postId = params.id;

  const [formState, setFormState] = useState<PostFormState>({
    title: '',
    content: '',
    published: false,
  });
  const [originalLanguage, setOriginalLanguage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);


  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) {
          if(response.status === 404) throw new Error(t('errorNotFound'));
          throw new Error(t('errorFetching'));
        }
        const data: Post = await response.json();
        setFormState({
          title: data.title,
          content: data.content || '', // Ensure content is not null
          published: data.published,
        });
        setOriginalLanguage(data.language); // Store original language
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : t('errorFetching'));
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [postId, t]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormState(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw errorData;
      }
      // On success, redirect to the posts list page
      // The redirect should maintain the current locale
      router.push('/admin/posts');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Error updating post:", apiError);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <p className="p-4">{t('loadingPost')}</p>;
  if (fetchError) return <p className="p-4 text-red-500">{fetchError}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('title', { postTitle: formState.title })}</h1>
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
            <p className="block text-sm font-medium text-gray-700">
              {t('fieldLanguage')}: <span className="font-normal text-gray-900">{originalLanguage.toUpperCase()}</span>
            </p>
            <p className="text-xs text-gray-500">{t('languageEditNotice')}</p>
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


        {error?.message && !error.errors && <p className="text-red-500 text-sm">{error.message}</p>}

        <div>
          <button
            type="submit"
            disabled={isLoading || isFetching}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? t('buttonSaving') : t('buttonSave')}
          </button>
        </div>
      </form>
    </div>
  );
}
