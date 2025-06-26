import { listRecipes } from '../lib/db';
import RecipeList from './RecipeList';
import type { Recipe } from '../schema';
import { auth } from '../auth';
import { headers } from 'next/headers';

export default async function RecipeListWrapper() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    console.log(session)
    if (!session?.user?.id) {
        return <div>Please sign in to view your recipes</div>;
    }

    const recipes = await listRecipes(session.user.id);

    return <RecipeList recipes={recipes} />;
} 