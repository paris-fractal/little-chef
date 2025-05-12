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
                        const ingredient = recipe.ingredients.find(
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
      )}
    </div>
  )
}
