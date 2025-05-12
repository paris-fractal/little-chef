'use client';

import type { Recipe } from "../schema"
import { handleDeleteRecipe } from "../actions"
import { useRouter } from "next/navigation"

interface RecipeDisplayProps {
    recipe: Recipe
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this recipe?')) {
            const result = await handleDeleteRecipe(recipe.id);
            if (result.success) {
                router.push('/');
            } else {
                alert('Failed to delete recipe');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{recipe.name}</h2>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                <ul className="list-disc pl-6 space-y-2">
                    {recipe.data.ingredients.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Instructions</h3>
                <ol className="list-decimal pl-6 space-y-4">
                    {recipe.data.instructions.map((instruction, index) => (
                        <li key={index} className="pl-2">
                            <div className="mb-2">{instruction.description}</div>
                            {instruction.timer && (
                                <div className="text-sm text-gray-600 mb-1">
                                    ⏱️ Cook for {instruction.timer} minutes
                                </div>
                            )}
                            {instruction.relatedIngredientNames.length > 0 && (
                                <div className="text-sm text-gray-600">
                                    🥄 Using:{" "}
                                    {instruction.relatedIngredientNames.map((ingredientName, i) => {
                                        const ingredient = recipe.data.ingredients.find(
                                            (ing) => ing.name.toLowerCase() === ingredientName.toLowerCase()
                                        );
                                        return (
                                            <span key={i} className="group relative inline-block">
                                                <span className="cursor-help text-blue-600 hover:text-blue-800">
                                                    {ingredientName}
                                                </span>
                                                {ingredient && (
                                                    <span className="invisible group-hover:visible absolute z-10 bg-gray-900 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                                        {ingredient.amount} {ingredient.unit}
                                                    </span>
                                                )}
                                                {i < instruction.relatedIngredientNames.length - 1 ? ", " : ""}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
} 