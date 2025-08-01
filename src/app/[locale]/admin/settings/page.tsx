'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Setting {
  id: number;
  key: string;
  value: string;
}

export default function SettingsPage() {
  const t = useTranslations('SettingsPage');
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const key = formData.get('key') as string;
    const value = formData.get('value') as string;

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save setting');
      }

      const newSetting = await response.json();
      setSettings((prevSettings) => {
        const existingSettingIndex = prevSettings.findIndex((s) => s.key === newSetting.key);
        if (existingSettingIndex > -1) {
          const updatedSettings = [...prevSettings];
          updatedSettings[existingSettingIndex] = newSetting;
          return updatedSettings;
        } else {
          return [...prevSettings, newSetting];
        }
      });
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
          <h2 className="text-xl font-bold mb-4">{t('currentSettings')}</h2>
          <ul>
            {settings.map((setting) => (
              <li key={setting.id} className="flex justify-between items-center py-2 border-b">
                <span className="font-semibold">{setting.key}</span>
                <span>{setting.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">{t('newSetting')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="key" className="block text-sm font-medium text-gray-700">{t('keyLabel')}</label>
              <input
                type="text"
                name="key"
                id="key"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700">{t('valueLabel')}</label>
              <input
                type="text"
                name="value"
                id="value"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
