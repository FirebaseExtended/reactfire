import { RecipeBrowser } from '@/components/RecipeBrowser';
import { fetchRecipes } from '@/lib/recipes';

// The recipe list is public, and rendering it on the server is the one place
// this app is not a client component. Rendered per request so a newly created
// recipe shows up on a refresh.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const recipes = await fetchRecipes('all');

  return (
    <>
      <hgroup>
        <h1>Recipes</h1>
        <p>Everything below was rendered on the server, then kept live in the browser.</p>
      </hgroup>
      <RecipeBrowser initialRecipes={recipes} />
    </>
  );
}
