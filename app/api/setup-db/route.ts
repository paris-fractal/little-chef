import { NextResponse } from 'next/server';
import { setupDatabase } from '@/app/lib/db';

export async function POST() {
    try {
        await setupDatabase();
        return NextResponse.json({ success: true, message: 'Database setup completed successfully' });
    } catch (error) {
        console.error('Database setup failed:', error);
        return NextResponse.json(
            { success: false, message: 'Database setup failed', error: String(error) },
            { status: 500 }
        );
    }
} 