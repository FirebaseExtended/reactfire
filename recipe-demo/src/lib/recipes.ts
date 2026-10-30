import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  type QuerySnapshot,
} from 'firebase/firestore';
import { firestore } from './firebase';
import type { Cuisine, Recipe, RecipeDraft } from './types';

export const recipesCollection = collection(firestore, 'recipes');

export function recipeQuery(cuisine: Cuisine | 'all') {
  return cuisine === 'all'
    ? query(recipesCollection, orderBy('createdAt', 'desc'))
    : query(recipesCollection, where('cuisine', '==', cuisine), orderBy('createdAt', 'desc'));
}

// Server components may only hand plain JSON to client components, and a
// Firestore Timestamp is not that. Converting here keeps every caller honest.
export function toRecipes(snapshot: QuerySnapshot): Recipe[] {
  return snapshot.docs.map((d) => {
    const { createdAt, ...rest } = d.data();
    return {
      id: d.id,
      ...rest,
      createdAt: createdAt?.toDate?.().toISOString() ?? new Date(0).toISOString(),
    } as Recipe;
  });
}

export async function fetchRecipes(cuisine: Cuisine | 'all' = 'all'): Promise<Recipe[]> {
  return toRecipes(await getDocs(recipeQuery(cuisine)));
}

export function createRecipe(draft: RecipeDraft) {
  return addDoc(recipesCollection, { ...draft, likedBy: [], createdAt: new Date() });
}

export function toggleLike(recipeId: string, uid: string, liked: boolean) {
  return updateDoc(doc(recipesCollection, recipeId), {
    likedBy: liked ? arrayRemove(uid) : arrayUnion(uid),
  });
}
