export interface Recipe {
    id: string;
    name: string;
    data: {
        ingredients: Ingredient[];
        instructions: Instruction[];
    }
}

export interface Ingredient {
    id: string;
    name: string;
    amount: string;
    unit: string;
    notes?: string;
}

export interface Instruction {
    id: string;
    description: string;
    timer?: number; // minutes
    relatedIngredientIds: string[]; // for hover state
}