'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User avatar'}
            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
          />
        )}
        <span>{session.user?.name || session.user?.email}</span>
        <button
          onClick={() => signOut()}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={() => signIn()}
        style={{
          padding: '8px 12px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Login
      </button>
      <Link href="/signup" passHref>
        <button
          style={{
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
      </Link>
    </div>
  );
}
