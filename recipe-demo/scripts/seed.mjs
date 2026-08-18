// Seeds the emulator (default) or a real project with a demo user and recipes.
// Idempotent: deterministic document ids plus setDoc, so re-running overwrites
// rather than duplicating.
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, doc, getFirestore, setDoc } from 'firebase/firestore';

const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS !== 'false';
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'rxfire-525a3';
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'fake-api-key';
const authHost = '127.0.0.1:9099';

const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = 'password';

const RECIPES = [
  { id: 'cacio-e-pepe', title: 'Cacio e Pepe', cuisine: 'Italian', ingredients: ['320g tonnarelli', '150g pecorino romano', '2 tsp black peppercorns'], steps: ['Toast the peppercorns and crush them.', 'Cook the pasta until very al dente.', 'Emulsify pecorino with pasta water, then toss.'] },
  { id: 'ribollita', title: 'Ribollita', cuisine: 'Italian', ingredients: ['Stale sourdough', 'Cavolo nero', 'Cannellini beans', 'Soffritto'], steps: ['Build a soffritto.', 'Simmer with beans and greens.', 'Layer with bread and rest overnight.'] },
  { id: 'oyakodon', title: 'Oyakodon', cuisine: 'Japanese', ingredients: ['2 chicken thighs', '3 eggs', 'Dashi, soy, mirin', 'Short grain rice'], steps: ['Simmer chicken in seasoned dashi.', 'Pour beaten egg over in two stages.', 'Slide onto hot rice.'] },
  { id: 'agedashi-tofu', title: 'Agedashi Tofu', cuisine: 'Japanese', ingredients: ['Silken tofu', 'Potato starch', 'Tsuyu', 'Grated daikon'], steps: ['Drain the tofu well.', 'Dust and fry until crisp.', 'Serve in warm tsuyu.'] },
  { id: 'tacos-al-pastor', title: 'Tacos al Pastor', cuisine: 'Mexican', ingredients: ['Pork shoulder', 'Guajillo and achiote', 'Pineapple', 'Corn tortillas'], steps: ['Marinate the pork overnight.', 'Roast and char.', 'Chop and serve with pineapple.'] },
  { id: 'sopa-de-lima', title: 'Sopa de Lima', cuisine: 'Mexican', ingredients: ['Chicken broth', 'Limes', 'Tomato and habanero', 'Tortilla strips'], steps: ['Poach and shred the chicken.', 'Simmer the broth with lime.', 'Top with fried tortilla strips.'] },
  { id: 'dal-tadka', title: 'Dal Tadka', cuisine: 'Indian', ingredients: ['Toor dal', 'Ghee', 'Cumin, garlic, dried chilli', 'Tomato'], steps: ['Pressure cook the dal.', 'Bloom the tempering in ghee.', 'Pour over and stir through.'] },
  { id: 'tarte-tatin', title: 'Tarte Tatin', cuisine: 'French', ingredients: ['6 apples', '150g sugar', '80g butter', 'Puff pastry'], steps: ['Make a dry caramel.', 'Pack the apples in tightly.', 'Cover with pastry and bake, then invert.'] },
];

async function seedUser() {
  if (!useEmulators) {
    console.log('Skipping user creation: only the Auth emulator accepts an unauthenticated signUp.');
    return;
  }

  const response = await fetch(
    `http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD, returnSecureToken: true }),
    },
  );

  if (response.ok) {
    console.log(`Created ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
    return;
  }

  const body = await response.json();
  if (body?.error?.message === 'EMAIL_EXISTS') {
    console.log(`${DEMO_EMAIL} already exists, leaving it alone.`);
    return;
  }
  throw new Error(`Could not create the demo user: ${JSON.stringify(body)}`);
}

async function seedRecipes() {
  const app = initializeApp({ projectId, apiKey });
  const firestore = getFirestore(app);
  if (useEmulators) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8085);
  }

  let createdAt = Date.now() - RECIPES.length * 60_000;
  for (const { id, ...recipe } of RECIPES) {
    createdAt += 60_000;
    await setDoc(doc(firestore, 'recipes', id), { ...recipe, likedBy: [], createdAt: new Date(createdAt) });
  }
  console.log(`Wrote ${RECIPES.length} recipes to ${projectId}.`);
}

await seedUser();
await seedRecipes();
process.exit(0);
