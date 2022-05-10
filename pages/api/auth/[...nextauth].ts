import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "Custom Login",
      credentials: {
        email: {
          label: "Correo",
          type: "email",
          placeholder: "correo@xxx.com",
        },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "Contraseña",
        },
      },
      async authorize(credentials) {
        console.log(credentials);
        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        );
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],

  //Callbacks
  jwt: {},
  session: {
    maxAge: 2592000, //30 días
    strategy: "jwt",
    updateAge: 86400, //cada día
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case "oauth":
            // comprobar si existe en la bd o crearlo
            token.user = await dbUsers.oAuthToDbUser(
              user?.email || "",
              user?.name || ""
            );

            break;
          case "credentials":
            token.user = user;
            break;

          default:
            break;
        }
      }
      return token;
    },
    async session({ session, user, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  },
  // custom pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
});
