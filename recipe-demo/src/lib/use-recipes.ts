'use client';

import { onSnapshot } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { recipeQuery, toRecipes } from './recipes';
import type { Cuisine, Recipe } from './types';

export type FeedStatus = 'loading' | 'ready' | 'error';

/**
 * Takes over from the server-rendered list: seeds with what the server already
 * fetched, then switches to a live subscription without a loading flash.
 */
export function useRecipes(cuisine: Cuisine | 'all', initialRecipes: Recipe[]) {
  // Which filter the current `recipes` describe. It starts as the cuisine the
  // server rendered and moves on with every snapshot, so switching away and
  // back still shows loading rather than the previous filter's list.
  const loadedCuisine = useRef(cuisine);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [status, setStatus] = useState<FeedStatus>('ready');
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (cuisine !== loadedCuisine.current) {
      setStatus('loading');
    }

    return onSnapshot(
      recipeQuery(cuisine),
      (snapshot) => {
        setRecipes(toRecipes(snapshot));
        loadedCuisine.current = cuisine;
        setStatus('ready');
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
