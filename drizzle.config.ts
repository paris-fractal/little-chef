import type { Config } from 'drizzle-kit';

export default {
    schema: './app/lib/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL!,
    },
} satisfies Config; 