'use client';

import { RecipeCard } from './RecipeCard';
import type { Recipe } from '@/lib/types';

export function RecipeList({ recipes, loading }: { recipes: Recipe[]; loading: boolean }) {
  if (loading) {
    return <article aria-busy="true">Loading recipes</article>;
  }

  if (recipes.length === 0) {
    return <article>No recipes yet. Sign in and create one.</article>;
  }

  return (
    <section>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </section>
  );
}
