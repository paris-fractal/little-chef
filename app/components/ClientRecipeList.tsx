'use client';

import { useState, useEffect } from 'react';
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
    const [recipes, setRecipes] = useState<SavedRecipe[]>(initialRecipes);
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
    const { selectedRecipe, setSelectedRecipe } = useRecipe();

    // Update recipes when selectedRecipe changes
    useEffect(() => {
        if (selectedRecipe && !recipes.some(r => r.data === selectedRecipe)) {
            // Add the new recipe to the list
            const newRecipe: SavedRecipe = {
                id: crypto.randomUUID(), // Generate a temporary ID
                name: selectedRecipe.name,
                data: selectedRecipe
            };
            setRecipes(prev => [...prev, newRecipe]);
            setSelectedRecipeId(newRecipe.id);
        }
    }, [selectedRecipe, recipes, setSelectedRecipe]);

    const handleSelectRecipe = (recipe: ParsedRecipe) => {
        // Find the recipe ID from the recipes list
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