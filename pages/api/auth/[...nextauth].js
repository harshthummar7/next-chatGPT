import NextAuth from "next-auth";
import axios from "axios";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret";

async function getToken({ refreshToken }) {
  const url = `https://oauth2.googleapis.com/token`;

  const response = await axios.post(url, {
    client_id: process.env.GOOGLE_ID,
    client_secret: process.env.GOOGLE_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  console.log("NEW REFRESH TOKEN", response.data);

  const { access_token, expires_in } = response.data;
  const expires_at = Math.floor(Date.now() / 1000) + expires_in;
  console.log("NEW EXPIRE", expires_at);
  return { access_token, expires_at };
}

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials, req) {
        const user = {
          name: "harshthummar",
          email: "harsh@gmail.com",
          pass: "12345",
        };
        const { username, password } = credentials;

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      console.log({ account }, { token }, { profile });
      // console.log("RT", account?.refresh_token);

      if (account) {
        token.accessToken = jwt.sign(
          {
            id: token.sub,
            email: token.email,
          },
          JWT_SECRET,
          { expiresIn: "1d" }
        );

        token.id = profile?.sub;
        token.refreshToken = account?.refresh_token;
      }
      if (Date.now() >= account?.expires_at * 1000) {
        // Access token expired, use refresh token to generate new access token
        const { access_token, expires_at } = await getToken({
          refreshToken: account?.refresh_token,
        });

        token.accessToken = access_token;
        token.expiresAt = expires_at;
      }

      return token;
    },

    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token?.accessToken;
      session.refreshToken = token?.refreshToken;
      session.user.id = token?.id;

      return session;
    },
  },
});
