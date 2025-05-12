'use client';

import { RecipeForm } from "./components/RecipeForm"

export default function Home() {
  return (
    <div className="p-8 pb-20 gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <RecipeForm />
        </div>
      </div>
    </div>
  )
}
