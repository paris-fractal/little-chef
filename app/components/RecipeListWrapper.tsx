'use server';

import { listRecipes } from '../lib/db';
import ClientRecipeList from './ClientRecipeList';
import type { ParsedRecipe } from '../api/openai';

interface SavedRecipe {
    id: string;
    name: string;
    data: ParsedRecipe;
}

export default async function RecipeListWrapper() {
    const recipes = await listRecipes();
    const initialRecipes: SavedRecipe[] = recipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        data: {
            name: recipe.name,
            ingredients: recipe.data.ingredients,
            instructions: recipe.data.instructions
        }
    }));
    return <ClientRecipeList initialRecipes={initialRecipes} />;
} 