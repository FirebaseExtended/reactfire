import { getAI, getGenerativeModel, Schema } from 'firebase/ai';
import { app } from './firebase';
import { CUISINES, type Cuisine, type RecipeDraft } from './types';

// Taken from the AI Studio export, which is the only place we have seen a model
// id confirmed against a working app. Swap here if AI Logic rejects it.
export const RECIPE_MODEL = 'gemini-3-flash-preview';

const recipeSchema = Schema.object({
  properties: {
    title: Schema.string(),
    cuisine: Schema.enumString({ enum: [...CUISINES] }),
    ingredients: Schema.array({ items: Schema.string() }),
    steps: Schema.array({ items: Schema.string() }),
  },
});

export async function generateRecipe(cuisine: Cuisine): Promise<RecipeDraft> {
  const model = getGenerativeModel(getAI(app), {
    model: RECIPE_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: recipeSchema,
    },
  });

  const result = await model.generateContent(
    `Invent one ${cuisine} recipe. Give it a title, a list of ingredients with quantities, and numbered steps.`,
  );

  return JSON.parse(result.response.text()) as RecipeDraft;
}
