import { useState } from "react"
import type { ParsedRecipe } from "../api/openai"
import { handleRecipeRequest } from "../actions"
import { RecipeDisplay } from "./RecipeDisplay"

interface RecipeFormProps {
    onRecipeGenerated: (recipe: ParsedRecipe) => void
}

export function RecipeForm({ onRecipeGenerated }: RecipeFormProps) {
    const [recipe, setRecipe] = useState<ParsedRecipe | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const text = formData.get('recipe-request') as string

        try {
            const result = await handleRecipeRequest(text)

            if (result.success && result.recipe) {
                setRecipe(result.recipe)
                onRecipeGenerated(result.recipe)
            } else {
                setError(result.error || 'An unexpected error occurred')
            }
        } catch (err) {
            setError('Failed to generate recipe')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={onSubmit} className="mb-8">
                <div className="flex flex-col gap-4">
                    <label htmlFor="recipe-request" className="text-lg">
                        What would you like to cook?
                    </label>
                    <textarea
                        id="recipe-request"
                        name="recipe-request"
                        className="w-full p-4 border rounded-lg min-h-[100px]"
                        placeholder="Describe what you'd like to cook..."
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Generating..." : "Generate Recipe"}
                    </button>
                </div>
            </form>

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-8">
                    {error}
                </div>
            )}

            {recipe && (
                <div className="space-y-8">
                    <RecipeDisplay recipe={recipe} />
                </div>
            )}
        </>
    )
} 