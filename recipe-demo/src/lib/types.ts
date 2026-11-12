export const CUISINES = ['Italian', 'Japanese', 'Mexican', 'Indian', 'French'] as const;

export type Cuisine = (typeof CUISINES)[number];

export interface Recipe {
  id: string;
  title: string;
  cuisine: Cuisine;
  ingredients: string[];
  steps: string[];
  likedBy: string[];
  createdAt: string;
}

export type RecipeDraft = Omit<Recipe, 'id' | 'likedBy' | 'createdAt'>;
