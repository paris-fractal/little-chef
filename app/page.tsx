'use client';

import { useState } from "react"
import type { Recipe } from "./schema"
import { RecipeDisplay } from "./components/RecipeDisplay"
import { useRecipe } from "./context/RecipeContext"
import { RecipeForm } from "./components/RecipeForm"

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const { selectedRecipe, setSelectedRecipe } = useRecipe()

  const handleRecipeGenerated = (newRecipe: Recipe) => {
    setRecipe(newRecipe)
    setSelectedRecipe(newRecipe)
  }

  return (
    <div className="p-8 pb-20 gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {!selectedRecipe ? (
            <RecipeForm onRecipeGenerated={handleRecipeGenerated} />
          ) : (
            <div className="space-y-8">
              <RecipeDisplay recipe={selectedRecipe} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
