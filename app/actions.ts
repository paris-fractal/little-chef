'use server';

import { generateRecipe } from './api/openai'
import { v4 as uuidv4 } from 'uuid'
import type { ParsedRecipe } from './api/openai'
import type { Recipe } from './schema'
import { createRecipe, deleteRecipe } from './lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from './auth';
import { headers } from 'next/headers';

export async function handleRecipeRequest(text: string): Promise<{ success: boolean; recipe?: Recipe; error?: string }> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' };
        }

        const parsedRecipe = await generateRecipe(text)
        const id = uuidv4()

        const recipe: Recipe = {
            id,
            name: parsedRecipe.name,
            data: {
                ingredients: parsedRecipe.ingredients,
                instructions: parsedRecipe.instructions
            }
        }

        // Save to database with user ID
        await createRecipe(recipe, session.user.id)

        revalidatePath("/")

        return { success: true, recipe }
    } catch (error) {
        console.error('Error generating recipe:', error)
        return { success: false, error: 'Failed to generate recipe' }
    }
}

export async function handleDeleteRecipe(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' };
        }

        await deleteRecipe(id, session.user.id);

        revalidatePath("/")
        return { success: true };
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return { success: false, error: 'Failed to delete recipe' };
    }
} 