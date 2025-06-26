import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const client = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const db = drizzle(client);

export async function runMigrations() {
    try {
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('Migrations completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await client.end();
    }
} 