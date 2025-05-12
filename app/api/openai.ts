import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedRecipe {
    name: string;
    ingredients: ParsedIngredient[];
    instructions: ParsedInstruction[];
}

interface ParsedIngredient {
    name: string;
    amount: string;
    unit: string;
}

interface ParsedInstruction {
    description: string;
    timer?: number;
    relatedIngredientNames: string[];
}

export interface EnhancedInstruction {
    description: string;
    timer?: number;
    relatedIngredientNames: string[];
}

const recipeSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        ingredients: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    amount: { type: "string" },
                    unit: { type: "string" }
                },
                required: ["name", "amount", "unit"]
            }
        },
        instructions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    description: { type: "string" },
                    timer: { type: "number", nullable: true },
                    relatedIngredientNames: {
                        type: "array",
                        items: { type: "string" }
                    }
                },
                required: ["description", "relatedIngredientNames"]
            }
        }
    },
    required: ["name", "ingredients", "instructions"]
};

export async function parseRecipe(rawRecipeText: string): Promise<ParsedRecipe> {
    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "system",
                content: "You extract structured recipe data from text. Identify ingredients with precise amounts, units, and instructions with detailed steps."
            },
            { role: "user", content: rawRecipeText }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "recipe",
                description: "A recipe, including ingredients and instructions",
                schema: recipeSchema
            }
        }
    });

    return JSON.parse(response.choices[0].message.content!);
}

export async function generateRecipe(rawText: string): Promise<ParsedRecipe> {
    if (rawText === "ham") {
        // carveout to avoid the cost of the API call
        return {
            name: "Ham Sandwich",
            ingredients: [{ name: "ham", amount: "1 slice", unit: "slice" }],
            instructions: [{ description: "Put ham on bread", relatedIngredientNames: ["ham"] }]
        }
    }
    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "system",
                content: "You are a professional chef. Create a detailed recipe based on the user's request. Include precise measurements and clear instructions. For each instruction step, identify any cooking times (in minutes) and which ingredients from the ingredients list are being used in that step."
            },
            { role: "user", content: rawText }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "recipe",
                description: "A recipe, including ingredients and instructions",
                schema: recipeSchema
            }
        }
    });

    return JSON.parse(response.choices[0].message.content!);
}

export async function enhanceRecipe(parsedRecipe: ParsedRecipe): Promise<EnhancedInstruction[]> {
    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            {
                role: "system",
                content: `Analyze these recipe instructions and identify:
                1. Any cooking times mentioned (in minutes)
                2. References to ingredients from the ingredients list
                Return the enhanced instructions with timing and ingredient references.`
            },
            {
                role: "user",
                content: JSON.stringify({
                    ingredients: parsedRecipe.ingredients,
                    instructions: parsedRecipe.instructions
                })
            }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "enhanced_instructions",
                description: "An array of cooking instructions with timing and ingredient references",
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            description: { type: "string" },
                            timer: { type: "number", nullable: true },
                            relatedIngredientNames: {
                                type: "array",
                                items: { type: "string" }
                            }
                        },
                        required: ["description", "relatedIngredientNames"]
                    }
                }
            }
        }
    });

    return JSON.parse(response.choices[0].message.content!);
}