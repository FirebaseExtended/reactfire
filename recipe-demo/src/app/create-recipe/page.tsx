'use client';

import Link from 'next/link';
import { useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { generateRecipe } from '@/lib/ai';
import { createRecipe } from '@/lib/recipes';
import { CUISINES, type Cuisine, type RecipeDraft } from '@/lib/types';

function CreateRecipe() {
  const [cuisine, setCuisine] = useState<Cuisine>(CUISINES[0]);
  const [draft, setDraft] = useState<RecipeDraft | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  async function onGenerate() {
    setPending(true);
    setError(undefined);
    setDraft(undefined);
    try {
      const generated = await generateRecipe(cuisine);
      await createRecipe(generated);
      setDraft(generated);
    } catch (err) {
      // Surfaced verbatim on purpose: when AI Logic is not enabled, or the
      // billing account has lapsed, the raw message is the whole diagnosis.
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <h1>Create a recipe</h1>

      <label>
        Cuisine
        <select value={cuisine} onChange={(e) => setCuisine(e.target.value as Cuisine)}>
          {CUISINES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <button onClick={onGenerate} aria-busy={pending} disabled={pending}>
        Generate a recipe
      </button>

      {error && (
        <article aria-invalid="true">
          <strong>Generation failed</strong>
          <p>{error}</p>
        </article>
      )}

      {draft && (
        <article>
          <strong>{draft.title}</strong> was added. <Link href="/">See it on the homepage.</Link>
        </article>
      )}
    </>
  );
}

export default function CreateRecipePage() {
  return (
    <RequireAuth>
      <CreateRecipe />
    </RequireAuth>
  );
}
