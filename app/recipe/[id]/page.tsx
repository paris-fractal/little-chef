import { RecipeDisplay } from "../../components/RecipeDisplay";
import { getRecipe } from "../../lib/db";
import { notFound } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function RecipePage({ params }: Props) {
    const awaited = await params;
    const recipe = await getRecipe(awaited.id);

    if (!recipe) {
        notFound();
    }

    return (
        <div className="p-8 pb-20">
            <RecipeDisplay recipe={recipe} />
        </div>
    );
} 