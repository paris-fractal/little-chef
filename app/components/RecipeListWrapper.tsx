import { listRecipes } from '../lib/db';
import RecipeList from './RecipeList';
import type { Recipe } from '../schema';
import { auth } from '../auth';

export default async function RecipeListWrapper() {
    const session = await auth();
    console.log(session)
    if (!session?.user?.id) {
        return <div>Please sign in to view your recipes</div>;
    }

    const recipes = await listRecipes(session.user.id);

    return <RecipeList recipes={recipes} />;
} 