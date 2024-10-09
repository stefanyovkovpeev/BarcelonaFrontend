import CredentialsProvider from 'next-auth/providers/credentials';
import { NuxtAuthHandler } from '#auth';


export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true, 
        sameSite: 'Lax',
        path: '/',
      }
    }
  },
  providers: [
    //@ts-expect-error
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Fill in Username" },
        password: { label: "Password", type: "password", placeholder: "Fill in Password" }
      },
      async authorize(credentials: any) {
        const res = await fetch("http://localhost:8000/api/token/", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        const user = await res.json();

        console.log('id:', user);

        if (res.ok && user) {
          return user;
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.access= user.access;
        token.username = user.username;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.access = token.access as string;
        session.user.username = token.username as string;
        session.user.first_name = token.first_name as string;
        session.user.last_name = token.last_name as string;
      }
      return session;
    },
  },
});