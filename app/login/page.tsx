'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const result = await signIn('credentials', {
      redirect: false, // Handle redirect manually
      email,
      password,
    });

    if (result?.error) {
      setError(result.error === 'CredentialsSignin' ? 'Invalid email or password.' : result.error);
    } else if (result?.ok) {
      // Redirect to home page or dashboard upon successful login
      router.push('/');
    } else {
      setError('An unknown error occurred. Please try again.');
    }
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px',
    margin: '50px auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  };

   const errorStyle: React.CSSProperties = {
    color: 'red',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  };

  const linkStyle: React.CSSProperties = {
    marginTop: '1rem',
    textAlign: 'center',
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h1>
        {error && <p style={errorStyle}>{error}</p>}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Login</button>
        <div style={linkStyle}>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}
