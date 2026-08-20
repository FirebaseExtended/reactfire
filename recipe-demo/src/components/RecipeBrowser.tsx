'use client';

import { useState } from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { RecipeList } from './RecipeList';
import { recipeQuery } from '@/lib/recipes';
import { CUISINES, type Cuisine, type Recipe } from '@/lib/types';

export function RecipeBrowser({ initialRecipes }: { initialRecipes: Recipe[] }) {
  const [cuisine, setCuisine] = useState<Cuisine | 'all'>('all');
  const { data, status } = useFirestoreCollectionData(recipeQuery(cuisine), {
    idField: 'id',
    initialData: initialRecipes,
  });
  const recipes = data as Recipe[];

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

      <RecipeList recipes={recipes} loading={status === 'loading'} />
    </>
  );
}
