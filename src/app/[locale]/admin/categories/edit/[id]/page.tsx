'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface CategoryFormState {
  name: string;
}

interface Category extends CategoryFormState {
  id: number;
}

interface ApiError {
  message?: string;
  errors?: { [key: string]: string[] | undefined };
}

export default function EditCategoryPage({ params }: { params: { id: string }}) {
  const t = useTranslations('EditCategoryPage');
  const router = useRouter();
  const categoryId = params.id;

  const [formState, setFormState] = useState<CategoryFormState>({
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (!response.ok) {
          if(response.status === 404) throw new Error(t('errorNotFound'));
          throw new Error(t('errorFetching'));
        }
        const data: Category = await response.json();
        setFormState({
          name: data.name,
        });
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : t('errorFetching'));
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategory();
  }, [categoryId, t]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw errorData;
      }
      router.push('/admin/categories');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Error updating category:", apiError);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <p className="p-4">{t('loadingCategory')}</p>;
  if (fetchError) return <p className="p-4 text-red-500">{fetchError}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('title', { categoryName: formState.name })}</h1>
        <Link href="/admin/categories" className="text-blue-500 hover:underline">
          {t('backLink')}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('fieldName')}</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {error?.errors?.name && <p className="text-red-500 text-xs mt-1">{error.errors.name.join(', ')}</p>}
        </div>

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
