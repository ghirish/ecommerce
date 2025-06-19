import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "./db"
import { userLoginSchema } from "./validations"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env["NEXTAUTH_SECRET"],
  providers: [
    Google({
      clientId: process.env["GOOGLE_CLIENT_ID"]!,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"]!,
    }),
    GitHub({
      clientId: process.env["GITHUB_CLIENT_ID"]!,
      clientSecret: process.env["GITHUB_CLIENT_SECRET"]!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const { email, password } = userLoginSchema.parse(credentials)

          const user = await db.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await compare(password, user.password)
          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.avatar || undefined,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google" || account?.provider === "github") {
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            await db.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                avatar: user.image,
                role: "CUSTOMER",
              },
            })
          }
        }
        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.user.findUnique({
          where: { email: user.email! },
        })

        if (dbUser) {
          token["id"] = dbUser.id
          token["role"] = dbUser.role
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token["id"] as string
        session.user.role = token["role"] as string
      }
      return session
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})

// Custom types
export interface ExtendedUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

// Helper functions
export async function getUserFromEmail(email: string) {
  return await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
    },
  })
}

export async function createUser(userData: {
  email: string
  name: string
  password: string
}) {
  return await db.user.create({
    data: {
      ...userData,
      role: "CUSTOMER",
    },
  })
}

// Type augmentation for next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      avatar?: string
    }
  }

  interface User {
    role: string
    avatar?: string
  }
}

 