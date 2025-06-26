import { router } from '../trpc';
import { recipesRouter } from './routers/recipes';

export const appRouter = router({
    recipes: recipesRouter,
});

export type AppRouter = typeof appRouter; 