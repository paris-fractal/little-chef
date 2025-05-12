'use client';

import { useEffect, useState } from 'react';
import { listRecipes } from '../lib/db';
import RecipeList from './RecipeList';
import { usePathname } from 'next/navigation';
import type { Recipe } from '../schema';

export default function RecipeListWrapper() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const pathname = usePathname();
    const selectedRecipeId = pathname.startsWith('/recipe/') ? pathname.split('/')[2] : null;

    useEffect(() => {
        const loadRecipes = async () => {
            const loadedRecipes = await listRecipes();
            setRecipes(loadedRecipes);
        };
        loadRecipes();
    }, []);

    return <RecipeList initialRecipes={recipes} selectedRecipeId={selectedRecipeId} />;
} 