import { betterAuth } from "better-auth"
import { db } from "./lib/db"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { users, sessions, accounts } from "./lib/schema"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true,
        schema: {
            users,
            sessions,
            accounts,
        }
    }),
    pages: {
        signIn: '/login',
    },
    emailAndPassword: {
        enabled: true,
    }
})  