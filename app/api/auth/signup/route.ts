import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // For generating user IDs

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_URL ? { rejectUnauthorized: false } : false,
});

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Basic password validation (e.g., minimum length)
    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // Check if user already exists
      const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return NextResponse.json({ message: 'User already exists' }, { status: 409 });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4(); // Generate a unique ID for the user

      // Insert new user
      await client.query(
        'INSERT INTO users (id, email, password, name) VALUES ($1, $2, $3, $4)',
        [userId, email, hashedPassword, name || null]
      );

      return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
      console.error('Signup API error:', error);
      return NextResponse.json({ message: 'Error creating user', error: (error as Error).message }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Signup API request processing error:', error);
    return NextResponse.json({ message: 'Error processing request', error: (error as Error).message }, { status: 500 });
  }
}
