'use client';

import { useState } from "react"
import type { ParsedRecipe } from "./api/openai"
import { handleRecipeRequest } from "./actions"
import { RecipeDisplay } from "./components/RecipeDisplay"
import { useRecipe } from "./context/RecipeContext"

export default function Home() {
  const [recipe, setRecipe] = useState<ParsedRecipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { selectedRecipe, setSelectedRecipe } = useRecipe()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSelectedRecipe(null)

    const formData = new FormData(event.currentTarget)
    const text = formData.get('recipe-request') as string

    try {
      const result = await handleRecipeRequest(text)

      if (result.success && result.recipe) {
        setRecipe(result.recipe)
        setSelectedRecipe(result.recipe)
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
    <div className="p-8 pb-20 gap-8 sm:p-20">
      <h1 className="text-4xl font-bold mb-8">Little Chef</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {!selectedRecipe ? (
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
                  <h2 className="text-2xl font-semibold mb-4">Generated Recipe</h2>
                  <RecipeDisplay recipe={recipe} />
                </div>
              )}
            </>
          ) : (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold mb-4">Selected Recipe</h2>
              <RecipeDisplay recipe={selectedRecipe} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
