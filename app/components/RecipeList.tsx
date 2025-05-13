'use client';

import { useState } from 'react';
import type { Recipe } from '../schema';
import { useRouter, usePathname } from 'next/navigation';

interface RecipeListProps {
    recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const selectedRecipeId = pathname.startsWith('/recipe/') ? pathname.split('/')[2] : null;

    const handleNewRecipe = () => {
        router.push('/');
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
                                onClick={() => router.push(`/recipe/${recipe.id}`)}
                                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors ${selectedRecipeId === recipe.id
                                    ? 'bg-gray-100 border-l-4 border-blue-500 font-medium'
                                    : ''
                                    }`}
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