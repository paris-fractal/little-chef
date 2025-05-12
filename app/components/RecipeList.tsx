'use client';

import { useState } from 'react';
import type { ParsedRecipe } from '../api/openai';
import { useRecipe } from '../context/RecipeContext';

interface SavedRecipe {
    id: string;
    name: string;
    data: ParsedRecipe;
}

interface RecipeListProps {
    initialRecipes: SavedRecipe[];
    onSelectRecipe: (recipe: ParsedRecipe) => void;
    selectedRecipeId: string | null;
}

export default function RecipeList({ initialRecipes, onSelectRecipe, selectedRecipeId }: RecipeListProps) {
    const [recipes] = useState<SavedRecipe[]>(initialRecipes);
    const { setSelectedRecipe } = useRecipe();

    const handleNewRecipe = () => {
        setSelectedRecipe(null);
    };

    return (
        <div className="h-full bg-gray-50 p-4 border-r">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Saved Recipes</h2>
                <button
                    onClick={handleNewRecipe}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                    title="Create new recipe"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {recipes.length === 0 ? (
                <p className="text-gray-500">No recipes saved yet</p>
            ) : (
                <ul className="space-y-2">
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>
                            <button
                                onClick={() => onSelectRecipe(recipe.data)}
                                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors ${selectedRecipeId === recipe.id ? 'bg-gray-100' : ''}`}
                            >
                                {recipe.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
} 