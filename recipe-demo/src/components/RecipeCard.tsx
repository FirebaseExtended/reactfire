'use client';

import { useState } from 'react';
import { useUser } from 'reactfire';
import { toggleLike } from '@/lib/recipes';
import type { Recipe } from '@/lib/types';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { data: user } = useUser();
  const [pending, setPending] = useState(false);
  const liked = user ? recipe.likedBy.includes(user.uid) : false;

  async function onToggleLike() {
    if (!user) return;
    setPending(true);
    try {
      await toggleLike(recipe.id, user.uid, liked);
    } finally {
      setPending(false);
    }
  }

  return (
    <article>
      <header>
        <strong>{recipe.title}</strong>
        <br />
        <small>{recipe.cuisine}</small>
      </header>

      <details>
        <summary>Ingredients and steps</summary>
        <ul>
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
        <ol>
          {recipe.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </details>

      <footer>
        <button
          className={liked ? undefined : 'secondary'}
          onClick={onToggleLike}
          disabled={!user || pending}
          aria-busy={pending}
        >
          {liked ? 'Liked' : 'Like'} ({recipe.likedBy.length})
        </button>
        {!user && <small> Sign in to like recipes.</small>}
      </footer>
    </article>
  );
}
