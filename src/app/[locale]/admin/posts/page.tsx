'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation'; // Updated import
import { useLocale, useTranslations } from 'next-intl';

// Define a type for the Post data
interface Post {
  id: number;
  title: string;
  language: string;
  published: boolean;
  createdAt: string;
}

export default function AdminPostsPage() {
  const t = useTranslations('AdminPostsPage');
  const locale = useLocale();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch posts for the current locale by default
        const response = await fetch(`/api/posts?lang=${locale}`);
        if (!response.ok) {
          throw new Error(t('errorFetching'));
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errorFetching'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [locale, t]); // Re-fetch if locale changes

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }
    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(t('errorDeleting'));
      }
      setPosts(posts.filter(post => post.id !== id));
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
        <Link href="/admin/posts/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {t('newPostLink')}
        </Link>
      </div>

      {posts.length === 0 ? (
        <p>{t('noPosts')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">{t('tableTitle')}</th>
                <th className="py-2 px-4 border-b text-left">{t('tableLanguage')}</th>
                <th className="py-2 px-4 border-b text-left">{t('tablePublished')}</th>
                <th className="py-2 px-4 border-b text-left">{t('tableCreatedAt')}</th>
                <th className="py-2 px-4 border-b text-left">{t('tableActions')}</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{post.title}</td>
                  <td className="py-2 px-4 border-b">{post.language.toUpperCase()}</td>
                  <td className="py-2 px-4 border-b">{post.published ? t('publishedYes') : t('publishedNo')}</td>
                  <td className="py-2 px-4 border-b">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/admin/posts/edit/${post.id}`} className="text-blue-500 hover:underline mr-2">
                      {t('actionEdit')}
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
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
