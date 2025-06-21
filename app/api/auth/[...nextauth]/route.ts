import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Pool } from 'pg';
// import { DrizzleAdapter } from "@auth/drizzle-adapter"; // Removed
import bcrypt from 'bcryptjs';

// Define your database schema (users, accounts, sessions, verificationTokens)
// This assumes you have a drizzle-orm setup. For a direct pg connection,
// you would typically use a different adapter or write custom database calls.
// For simplicity with pg directly, we'll use a simplified adapter approach.
// However, the official @auth/pg-adapter is recommended for full features.
// Since we are using pg directly, we will implement the adapter functions manually.

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // We'll set this environment variable later
  ssl: process.env.POSTGRES_URL ? { rejectUnauthorized: false } : false, // Required for some cloud providers
});

export const authOptions: NextAuthOptions = {
  // adapter: DrizzleAdapter(pool), // Removed
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const client = await pool.connect();
        try {
          // Find user by email
          const result = await client.query('SELECT * FROM users WHERE email = $1', [credentials.email]);
          const user = result.rows[0];

          if (user && user.password) {
            // Compare password with the hashed password in the database
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (isValid) {
              // Return user object without the password
              return { id: user.id, name: user.name, email: user.email, image: user.image };
            }
          }
        } catch (err) {
          console.error('Authorize error:', err);
          return null; // Or throw an error
        } finally {
          client.release();
        }
        return null; // Login failed
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Using JWT for session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user id to the token right after signin
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id to the session object
      if (session.user && token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Redirect users to /login if they need to sign in
    // error: '/auth/error', // Error code passed in query string as ?error=
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  secret: process.env.NEXTAUTH_SECRET, // We'll set this environment variable later
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
