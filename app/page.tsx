'use client';

import { useState } from "react"
import type { ParsedRecipe } from "./api/openai"
import { handleRecipeRequest } from "./actions"

export default function Home() {
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
    <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold mb-8">Little Chef</h1>

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
          <h2 className="text-3xl font-bold">{recipe.name}</h2>

          <div>
            <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
            <ul className="list-disc pl-6 space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Instructions</h3>
            <ol className="list-decimal pl-6 space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="pl-2">
                  {instruction.description}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
