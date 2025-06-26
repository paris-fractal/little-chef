import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';
import { generateRecipe } from '../../../api/openai';
import { v4 as uuidv4 } from 'uuid';
import { createRecipe, deleteRecipe, listRecipes, getRecipe } from '../../db';
import type { Recipe } from '../../../schema';

const recipeDataSchema = z.object({
    ingredients: z.array(z.object({
        name: z.string(),
        amount: z.string(),
        unit: z.string(),
    })),
    instructions: z.array(z.object({
        description: z.string(),
        timer: z.number().optional(),
        relatedIngredientNames: z.array(z.string()),
    })),
});

const createRecipeSchema = z.object({
    name: z.string(),
    data: recipeDataSchema,
});

export const recipesRouter = router({
    // Get all recipes for the authenticated user
    list: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const recipes = await listRecipes(ctx.userId);
                return { success: true, recipes };
            } catch (error) {
                console.error('Error fetching recipes:', error);
                throw new Error('Failed to fetch recipes');
            }
        }),

    // Get a single recipe by ID
    get: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const recipe = await getRecipe(input.id, ctx.userId);
                if (!recipe) {
                    throw new Error('Recipe not found');
                }
                return { success: true, recipe };
            } catch (error) {
                console.error('Error fetching recipe:', error);
                throw new Error('Failed to fetch recipe');
            }
        }),

    // Create a new recipe manually
    create: protectedProcedure
        .input(createRecipeSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                const id = uuidv4();
                const recipe: Recipe = {
                    id,
                    name: input.name,
                    data: input.data,
                };

                await createRecipe(recipe, ctx.userId);
                return { success: true, recipe };
            } catch (error) {
                console.error('Error creating recipe:', error);
                throw new Error('Failed to create recipe');
            }
        }),

    // Generate a recipe from text description
    generate: protectedProcedure
        .input(z.object({ text: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const parsedRecipe = await generateRecipe(input.text);
                const id = uuidv4();

                const recipe: Recipe = {
                    id,
                    name: parsedRecipe.name,
                    data: {
                        ingredients: parsedRecipe.ingredients,
                        instructions: parsedRecipe.instructions,
                    },
                };

                await createRecipe(recipe, ctx.userId);
                return { success: true, recipe };
            } catch (error) {
                console.error('Error generating recipe:', error);
                throw new Error('Failed to generate recipe');
            }
        }),

    // Delete a recipe
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await deleteRecipe(input.id, ctx.userId);
                return { success: true };
            } catch (error) {
                console.error('Error deleting recipe:', error);
                throw new Error('Failed to delete recipe');
            }
        }),
}); 