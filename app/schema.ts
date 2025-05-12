export interface Recipe {
    id: string;
    name: string;
    data: {
        ingredients: Ingredient[];
        instructions: Instruction[];
    }
}

export interface Ingredient {
    name: string;
    amount: string;
    unit: string;
}

export interface Instruction {
    description: string;
    timer?: number; // minutes
    relatedIngredientNames: string[];
}