'use client';

import RecipeList from './RecipeList';
import { trpc } from '../lib/trpc/client';
import { authClient } from '../lib/auth-client';

export default function RecipeListWrapper() {
    const session = authClient.useSession()
    const { data, isLoading, error } = trpc.recipes.list.useQuery();

    if (session.isPending) {
        return <div className="p-4 text-center">Loading recipes...</div>;
    }

    if (error || session.error) {
        return <div className="p-4 text-center text-red-600">Error loading recipes: {error?.message || session.error?.message}</div>;
    }

    if (!session.data?.user?.id) {
        return <div className="p-4 text-center">Please sign in to view your recipes</div>;
    }

    if (isLoading) {
        return <div className="p-4 text-center">Loading recipes...</div>;
    }

    return <RecipeList recipes={data!.recipes} />;
} 