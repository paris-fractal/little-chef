'use client';

import { useState } from "react"
import type { Recipe } from "../schema"
import { useRouter } from "next/navigation"
import { trpc } from "../lib/trpc/client"

export function RecipeForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const generateRecipeMutation = trpc.recipes.generate.useMutation({
        onSuccess: (result) => {
            if (result.success && result.recipe) {
                router.push(`/recipe/${result.recipe.id}`)
            }
        },
        onError: (error) => {
            setError(error.message || 'Failed to generate recipe')
        },
    })

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const text = formData.get('recipe-request') as string

        try {
            generateRecipeMutation.mutate({ text })
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
                        disabled={loading || generateRecipeMutation.isPending}
                        className="px-6 py-3 bg-[#a8c4d9] text-[#2c3e50] rounded-lg hover:bg-[#8ab3d0] disabled:opacity-50 transition-colors font-medium"
                    >
                        {loading || generateRecipeMutation.isPending ? "Generating..." : "Generate Recipe"}
                    </button>
                </div>
            </form>
            {(error || generateRecipeMutation.error) && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-8 border border-red-200">
                    {error || generateRecipeMutation.error?.message}
                </div>
            )}
        </>
    )
} 