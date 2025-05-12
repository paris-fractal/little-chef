'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { ParsedRecipe } from '../api/openai';

interface RecipeContextType {
    selectedRecipe: ParsedRecipe | null;
    setSelectedRecipe: (recipe: ParsedRecipe | null) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
    const [selectedRecipe, setSelectedRecipe] = useState<ParsedRecipe | null>(null);

    return (
        <RecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe }}>
            {children}
        </RecipeContext.Provider>
    );
}

export function useRecipe() {
    const context = useContext(RecipeContext);
    if (context === undefined) {
        throw new Error('useRecipe must be used within a RecipeProvider');
    }
    return context;
} 