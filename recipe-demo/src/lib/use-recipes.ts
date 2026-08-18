'use client';

import { onSnapshot } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { recipeQuery, toRecipes } from './recipes';
import type { Cuisine, Recipe } from './types';

export type FeedStatus = 'hydrated' | 'live' | 'loading' | 'error';

/**
 * Takes over from the server-rendered list: seeds with what the server already
 * fetched, then switches to a live subscription without a loading flash.
 */
export function useRecipes(cuisine: Cuisine | 'all', initialRecipes: Recipe[]) {
  const renderedCuisine = useRef(cuisine);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [status, setStatus] = useState<FeedStatus>('hydrated');
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    // The server data only describes the cuisine the page was rendered for, so
    // any other filter starts from nothing until the first snapshot lands.
    if (cuisine !== renderedCuisine.current) {
      setStatus('loading');
    }

    return onSnapshot(
      recipeQuery(cuisine),
      (snapshot) => {
        setRecipes(toRecipes(snapshot));
        setStatus('live');
        setError(undefined);
      },
      (err) => {
        setError(err);
        setStatus('error');
      },
    );
  }, [cuisine]);

  return { recipes, status, error };
}
