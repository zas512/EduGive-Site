import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

// NextAuth configuration
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token; // Save accessToken in JWT token
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Add accessToken to session object
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Force redirect to home page ('/')
      return "/";  // Redirects the user to the homepage
    }
  },
});

export { handler as GET, handler as POST };
