'use client';

import { useState } from 'react';
import { RecipeList } from './RecipeList';
import { useRecipes } from '@/lib/use-recipes';
import { CUISINES, type Cuisine, type Recipe } from '@/lib/types';

export function RecipeBrowser({ initialRecipes }: { initialRecipes: Recipe[] }) {
  const [cuisine, setCuisine] = useState<Cuisine | 'all'>('all');
  const { recipes, status, error } = useRecipes(cuisine, initialRecipes);

  return (
    <>
      <label>
        Cuisine
        <select value={cuisine} onChange={(e) => setCuisine(e.target.value as Cuisine | 'all')}>
          <option value="all">All cuisines</option>
          {CUISINES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {error ? (
        <article aria-invalid="true">Could not load recipes: {error.message}</article>
      ) : (
        <RecipeList recipes={recipes} loading={status === 'loading'} />
      )}
    </>
  );
}
