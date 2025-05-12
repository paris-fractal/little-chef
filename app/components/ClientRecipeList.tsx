'use client';

import { useState, useEffect } from 'react';
import type { Recipe } from '../schema';
import RecipeList from './RecipeList';
import { useRecipe } from '../context/RecipeContext';

interface ClientRecipeListProps {
    initialRecipes: Recipe[];
}

export default function ClientRecipeList({ initialRecipes }: ClientRecipeListProps) {
    const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
    const { selectedRecipe, setSelectedRecipe } = useRecipe();

    // Update recipes when selectedRecipe changes
    useEffect(() => {
        if (selectedRecipe && !recipes.some(r => r.id === selectedRecipe.id)) {
            // Add the new recipe to the list
            setRecipes(prev => [...prev, selectedRecipe]);
            setSelectedRecipeId(selectedRecipe.id);
        }
    }, [selectedRecipe, recipes, setSelectedRecipe]);

    const handleSelectRecipe = (recipe: Recipe) => {
        setSelectedRecipeId(recipe.id);
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