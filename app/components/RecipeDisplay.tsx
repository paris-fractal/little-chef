'use client';

import type { Recipe } from "../schema"
import { useRouter } from "next/navigation"
import { Timer } from "./Timer"
import { trpc } from "../lib/trpc/client"

interface RecipeDisplayProps {
    recipe: Recipe
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
    const router = useRouter();

    const deleteRecipeMutation = trpc.recipes.delete.useMutation({
        onSuccess: () => {
            router.push('/');
        },
        onError: (error) => {
            alert(`Failed to delete recipe: ${error.message}`);
        },
    });

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this recipe?')) {
            deleteRecipeMutation.mutate({ id: recipe.id });
        }
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-4xl font-bold text-[#2c3e50]">{recipe.name}</h2>
                <button
                    onClick={handleDelete}
                    disabled={deleteRecipeMutation.isPending}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#e8d5c4]">
                <h3 className="text-2xl font-semibold mb-4 text-[#2c3e50]">Ingredients</h3>
                <ul className="list-disc pl-6 space-y-2 text-[#4a5568]">
                    {recipe.data.ingredients.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#e8d5c4]">
                <h3 className="text-2xl font-semibold mb-4 text-[#2c3e50]">Instructions</h3>
                <ol className="list-decimal pl-6 space-y-6">
                    {recipe.data.instructions.map((instruction, index) => (
                        <li key={index} className="pl-2">
                            <div className="mb-2 text-[#4a5568]">{instruction.description}</div>
                            {instruction.timer && (
                                <Timer
                                    minutes={instruction.timer}
                                    instructionIndex={index}
                                />
                            )}
                            {instruction.relatedIngredientNames.length > 0 && (
                                <div className="text-sm text-[#718096] mt-2">
                                    🥄 Using:{" "}
                                    {instruction.relatedIngredientNames.map((ingredientName, i) => {
                                        const ingredient = recipe.data.ingredients.find(
                                            (ing) => ing.name.toLowerCase() === ingredientName.toLowerCase()
                                        );
                                        return (
                                            <span key={i} className="group relative inline-block">
                                                <span className="cursor-help text-[#a8c4d9] hover:text-[#8ab3d0]">
                                                    {ingredientName}
                                                </span>
                                                {ingredient && (
                                                    <span className="invisible group-hover:visible absolute z-10 bg-[#2c3e50] text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
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