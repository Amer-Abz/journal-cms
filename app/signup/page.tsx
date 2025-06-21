'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import for App Router
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name || !email || !password || !confirmPassword) {
        setError('All fields are required.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Invalid email format.');
        return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to create account.');
      } else {
        setSuccessMessage(data.message || 'Account created successfully! Redirecting to login...');
        // Optionally redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
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
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  };

  const messageStyle: React.CSSProperties = {
    marginTop: '0.5rem',
    textAlign: 'center',
  };

  const errorStyle: React.CSSProperties = {
    ...messageStyle,
    color: 'red',
  };

  const successStyle: React.CSSProperties = {
    ...messageStyle,
    color: 'green',
  };
  
  const linkStyle: React.CSSProperties = {
    marginTop: '1rem',
    textAlign: 'center',
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h1>
        {error && <p style={errorStyle}>{error}</p>}
        {successMessage && <p style={successStyle}>{successMessage}</p>}
        <div>
          <label htmlFor="name">Full Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Create Account</button>
        <div style={linkStyle}>
          Already have an account? <Link href="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
