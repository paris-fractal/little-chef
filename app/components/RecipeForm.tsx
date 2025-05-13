import { useState } from "react"
import type { Recipe } from "../schema"
import { handleRecipeRequest } from "../actions"
import { useRouter } from "next/navigation"

export function RecipeForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const text = formData.get('recipe-request') as string

        try {
            const result = await handleRecipeRequest(text)

            if (result.success && result.recipe) {
                router.push(`/recipe/${result.recipe.id}`)
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
                <div className="space-y-4">
                    <label htmlFor="recipe-request" className="block text-lg font-medium">
                        What would you like to cook?
                    </label>
                    <textarea
                        id="recipe-request"
                        name="recipe-request"
                        className="w-full p-4 border border-[#e8d5c4] rounded-lg min-h-[100px] bg-white focus:ring-2 focus:ring-[#a8c4d9] focus:border-transparent"
                        placeholder="Describe what you'd like to cook..."
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-[#a8c4d9] text-[#2c3e50] rounded-lg hover:bg-[#8ab3d0] disabled:opacity-50 transition-colors font-medium"
                    >
                        {loading ? "Generating..." : "Generate Recipe"}
                    </button>
                </div>
            </form>
            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-8 border border-red-200">
                    {error}
                </div>
            )}
        </>
    )
} 