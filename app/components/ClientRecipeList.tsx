'use client';

import { useState } from 'react';
import type { ParsedRecipe } from '../api/openai';
import RecipeList from './RecipeList';
import { useRecipe } from '../context/RecipeContext';

interface SavedRecipe {
    id: string;
    name: string;
    data: ParsedRecipe;
}

interface ClientRecipeListProps {
    initialRecipes: SavedRecipe[];
}

export default function ClientRecipeList({ initialRecipes }: ClientRecipeListProps) {
    const [recipes] = useState<SavedRecipe[]>(initialRecipes);
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
    const { setSelectedRecipe } = useRecipe();

    const handleSelectRecipe = (recipe: ParsedRecipe) => {
        // Find the recipe ID from the initial recipes
        const selectedRecipe = recipes.find(r => r.data === recipe);
        setSelectedRecipeId(selectedRecipe?.id || null);
        setSelectedRecipe(recipe);
    };

    return (
        <RecipeList
            initialRecipes={recipes}
            onSelectRecipe={handleSelectRecipe}
            selectedRecipeId={selectedRecipeId}
        />
    );
} 