'use server';

import { generateRecipe } from './api/openai'
import { v4 as uuidv4 } from 'uuid'
import type { ParsedRecipe } from './api/openai'
import { createRecipe } from './lib/db';

export async function handleRecipeRequest(text: string): Promise<{ success: boolean; recipe?: ParsedRecipe; error?: string }> {
    try {
        const recipe = await generateRecipe(text)
        const id = uuidv4()

        // Save to database
        await createRecipe({
            id,
            name: recipe.name,
            data: recipe
        })

        return { success: true, recipe }
    } catch (error) {
        console.error('Error generating recipe:', error)
        return { success: false, error: 'Failed to generate recipe' }
    }
} 