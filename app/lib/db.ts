
//import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and } from 'drizzle-orm';
import { recipes } from './schema';
import type { Recipe as RecipeType } from '../schema';

const client = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
export const db = drizzle(client);

export async function getRecipe(id: string, userId: string) {
    const result = await db
        .select()
        .from(recipes)
        .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))
        .limit(1);

    if (result.length === 0) {
        return null;
    }

    return toRecipe(result[0]);
}

export async function createRecipe(recipe: RecipeType, userId: string) {
    const res = await db.insert(recipes).values({
        id: recipe.id,
        name: recipe.name,
        recipeData: JSON.stringify(recipe.data),
        userId: userId,
    });
    return res;
}

export async function listRecipes(userId: string) {
    const result = await db
        .select()
        .from(recipes)
        .where(eq(recipes.userId, userId));

    return result.map(toRecipe);
}

export async function deleteRecipe(id: string, userId: string) {
    const res = await db
        .delete(recipes)
        .where(and(eq(recipes.id, id), eq(recipes.userId, userId)));
    return res;
}

function toRecipe(row: typeof recipes.$inferSelect): RecipeType {
    return {
        id: row.id,
        name: row.name,
        data: JSON.parse(row.recipeData)
    };
}

