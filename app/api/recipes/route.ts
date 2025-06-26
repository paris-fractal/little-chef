import { NextResponse } from 'next/server';
import { listRecipes, createRecipe } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../../auth';
import { headers } from 'next/headers';

// Keep track of active SSE connections
const clients = new Set<ReadableStreamDefaultController>();

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const recipes = await listRecipes(session.user.id);
        return NextResponse.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recipes' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const recipe = await request.json();
        const id = uuidv4();

        await createRecipe({
            id,
            name: recipe.name,
            data: recipe
        }, session.user.id);

        // Notify all connected clients about the new recipe
        clients.forEach(client => {
            client.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(recipe)}\n\n`));
        });

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Error creating recipe:', error);
        return NextResponse.json(
            { error: 'Failed to create recipe' },
            { status: 500 }
        );
    }
}

// Function to add a new client
export function addClient(controller: ReadableStreamDefaultController) {
    clients.add(controller);
}

// Function to remove a client
export function removeClient(controller: ReadableStreamDefaultController) {
    clients.delete(controller);
} 