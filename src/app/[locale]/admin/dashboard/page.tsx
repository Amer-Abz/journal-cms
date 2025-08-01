'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Card from '@/components/Card';
import Link from 'next/link';

export default function DashboardPage() {
  const t = useTranslations('DashboardPage');
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const userRole = session?.user?.role;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="User Information" className="lg:col-span-1">
          <p className="text-gray-600">Welcome, <span className="font-semibold">{session?.user?.name || session?.user?.email}</span>!</p>
          <p className="text-gray-600">Your role is: <span className="font-semibold text-indigo-600">{userRole}</span></p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Logout
          </button>
        </Card>

        <Card title="Role-Specific Information" className="lg:col-span-2">
          {userRole === 'ADMIN' && (
            <p>As an <span className="font-semibold">Admin</span>, you have full access to manage users, posts, categories, and site settings.</p>
          )}
          {userRole === 'EDITOR' && (
            <p>As an <span className="font-semibold">Editor</span>, you can create, edit, and publish posts from any author.</p>
          )}
          {userRole === 'AUTHOR' && (
            <p>As an <span className="font-semibold">Author</span>, you can create, edit, and manage your own posts.</p>
          )}
        </Card>

        <Card title="Quick Actions" className="md:col-span-2 lg:col-span-3">
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/posts/new" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
              New Post
            </Link>
            {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
              <Link href="/admin/categories/new" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors">
                New Category
              </Link>
            )}
            {userRole === 'ADMIN' && (
              <Link href="/admin/users" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors">
                Manage Users
              </Link>
            )}
            <Link href="/admin/media" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors">
              Media Library
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
