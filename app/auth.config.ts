import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            return !!auth
        },
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                console.log(parsedCredentials)
                if (!parsedCredentials.success) return null

                const { email, password } = parsedCredentials.data

                // TODO: Add your own logic here to validate credentials
                // This is where you would typically:
                // 1. Check if the user exists in your database
                // 2. Verify the password
                // 3. Return the user object if valid

                // For now, we'll just return a mock user
                if (password === "password123") {
                    return {
                        id: email,
                        email: email,
                        name: email,
                    }
                }

                return null
            },
        }),
    ],
} satisfies NextAuthConfig 