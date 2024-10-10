import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email Link',
      credentials: {
        token: { label: "Token", type: "text" }
      },
      async authorize(credentials) {
        if (credentials.token) {
          try {
            const email = await verifyToken(credentials.token);
            if (email) {
              return { email };
            }
          } catch (error) {
            console.error('Token verification failed:', error);
          }
        }
        return null;
      }
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, token }) {
      session.user = { email: token.email };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    }
  },
  pages: {
    signIn: '/client/auth/signin',
    verifyRequest: '/client/auth/verify-request',
    error: '/client/auth/error',
    newUser: '/client/auth/success',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };