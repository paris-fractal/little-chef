import type { ParsedRecipe } from "../api/openai"

interface RecipeDisplayProps {
    recipe: ParsedRecipe
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
    return (
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
    )
} 