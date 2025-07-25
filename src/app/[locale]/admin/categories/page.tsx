'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface Category {
  id: number;
  name: string;
}

export default function AdminCategoriesPage() {
  const t = useTranslations('AdminCategoriesPage');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(t('errorFetching'));
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errorFetching'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [t]);

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }
    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(t('errorDeleting'));
      }
      setCategories(categories.filter(category => category.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('errorDeleting'));
    }
  };

  if (isLoading) return <p>{t('loading')}</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link href="/admin/categories/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {t('newCategoryLink')}
        </Link>
      </div>

      {categories.length === 0 ? (
        <p>{t('noCategories')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">{t('tableName')}</th>
                <th className="py-2 px-4 border-b text-left">{t('tableActions')}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{category.name}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/admin/categories/edit/${category.id}`} className="text-blue-500 hover:underline mr-2">
                      {t('actionEdit')}
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-500 hover:underline"
                    >
                      {t('actionDelete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
