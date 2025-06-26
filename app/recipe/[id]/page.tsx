import { RecipeDisplay } from "../../components/RecipeDisplay";
import { getRecipe } from "../../lib/db";
import { notFound } from "next/navigation";
import { auth } from "../../auth";

interface Props {
    params: {
        id: string;
    };
}

export default async function RecipePage({ params }: Props) {
    const session = await auth();
    if (!session?.user?.id) {
        return <div>Please sign in to view recipes</div>;
    }

    const recipe = await getRecipe(params.id, session.user.id);

    if (!recipe) {
        notFound();
    }

    return (
        <div className="p-8 pb-20">
            <RecipeDisplay recipe={recipe} />
        </div>
    );
} 