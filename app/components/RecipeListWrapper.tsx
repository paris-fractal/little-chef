import { listRecipes } from '../lib/db';
import RecipeList from './RecipeList';
import type { Recipe } from '../schema';

export default async function RecipeListWrapper() {
    const recipes = await listRecipes();

    return <RecipeList recipes={recipes} />;
} 