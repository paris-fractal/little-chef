'use server';

import postgres, { RowList, Row } from 'postgres';
import { Recipe } from '../schema';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function setupDatabase() {
    await sql`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      recipe_data TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function getRecipe(id: string) {
    const recipe = await sql`SELECT * FROM recipes WHERE id = ${id}`;
    return toRecipe(recipe[0]);
}


export async function createRecipe(recipe: Recipe) {
    const res = await sql`
    INSERT INTO recipes (id, name, recipe_data) VALUES (${recipe.id}, ${recipe.name}, ${JSON.stringify(recipe.data)})`;
    return res;
}

export async function listRecipes() {
    const recipes = await sql`SELECT * FROM recipes`;
    return recipes.map(toRecipe);
}

export async function deleteRecipe(id: string) {
    const res = await sql`DELETE FROM recipes WHERE id = ${id}`;
    return res;
}

function toRecipe(row: Row): Recipe {
    return {
        id: row.id,
        name: row.name,
        data: JSON.parse(row.recipe_data)
    }
}

