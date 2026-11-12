import { Timestamp } from 'firebase/firestore';

export type Category = "Breakfast" | "Lunch" | "Dinner" | "Dessert" | "Snack" | "Drink" | "Other";

export interface Recipe {
  id?: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  category: Category;
  rating?: number;
  estimatedTime?: number | null;
  authorId: string;
  householdId: string;
  sourceUrl?: string;
  imageUrl?: string;
  createdAt: Timestamp;
  isStock?: boolean;
}

export interface Household {
  id?: string;
  name: string;
  ownerId: string;
  members: { [userId: string]: 'admin' | 'member' | 'viewer' };
  createdAt?: Timestamp;
  isStock?: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
