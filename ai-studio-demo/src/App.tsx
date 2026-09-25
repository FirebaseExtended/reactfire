import { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  Timestamp,
  setDoc,
  getDoc,
  getDocs,
  deleteField
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  signIn, 
  logOut 
} from './firebase';
import { 
  Recipe, 
  Household, 
  Category 
} from './types';
import { 
  extractRecipeFromUrl,
  generateRecipe,
  generateRecipeImage
} from './services/geminiService';
import { 
  Plus, 
  Search, 
  Filter, 
  Link as LinkIcon, 
  LogOut, 
  Users, 
  Star, 
  ChevronRight, 
  ChefHat, 
  X, 
  Loader2,
  Trash2,
  Edit2,
  Clock,
  Utensils,
  AlertCircle,
  Soup,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We don't throw here to avoid crashing the whole app, but we log it clearly
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h1 className="text-2xl font-serif font-bold text-stone-900">Something went wrong</h1>
          <p className="text-stone-500">We encountered an unexpected error. Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh App</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Components ---

const Button = ({ className, variant = 'primary', ...props }: any) => {
  const variants = {
    primary: 'bg-stone-800 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-200',
    secondary: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700',
    outline: 'border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900',
    ghost: 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'
  };
  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-full font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant as keyof typeof variants],
        className
      )} 
      {...props} 
    />
  );
};

const Card = ({ children, className }: any) => (
  <div className={cn('bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border border-stone-100 dark:border-stone-800', className)}>
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on body
      document.body.style.overflow = 'hidden';
      
      // Set aria-hidden on main content
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.setAttribute('aria-hidden', 'true');

      // Focus the modal
      modalRef.current?.focus();
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCloseRef.current();
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            // If focus is outside the modal, bring it back in
            if (!modalRef.current?.contains(document.activeElement)) {
              firstElement.focus();
              e.preventDefault();
              return;
            }

            if (e.shiftKey) {
              if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
                lastElement.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        if (mainContent) mainContent.removeAttribute('aria-hidden');
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div 
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-stone-50 dark:bg-stone-900 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl outline-none"
      >
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-stone-900">
          <h2 id="modal-title" className="text-2xl font-serif font-semibold text-stone-800 dark:text-stone-100">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors" aria-label="Close modal">
            <X className="w-6 h-6 text-stone-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 text-stone-600 dark:text-stone-300">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const STOCK_RECIPES: Partial<Recipe>[] = [
  {
    title: "Classic Avocado Toast",
    category: "Breakfast",
    rating: 5,
    estimatedTime: 10,
    ingredients: [
      "2 slices of sourdough bread",
      "1 ripe avocado",
      "1/2 lemon, juiced",
      "Pinch of sea salt and black pepper",
      "Red pepper flakes (optional)",
      "1 tbsp olive oil"
    ],
    instructions: [
      "Toast the sourdough bread slices until golden brown and crispy.",
      "In a small bowl, mash the avocado with lemon juice, salt, and pepper.",
      "Spread the mashed avocado evenly over the toasted bread.",
      "Drizzle with olive oil and sprinkle with red pepper flakes if desired."
    ],
    imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  },
  {
    title: "Mediterranean Quinoa Bowl",
    category: "Lunch",
    rating: 4,
    estimatedTime: 20,
    ingredients: [
      "1 cup cooked quinoa",
      "1/2 cup cherry tomatoes, halved",
      "1/4 cup cucumber, diced",
      "1/4 cup kalamata olives, pitted",
      "1/4 cup feta cheese, crumbled",
      "2 tbsp hummus",
      "1 tbsp lemon vinaigrette"
    ],
    instructions: [
      "Place the cooked quinoa in the base of a bowl.",
      "Arrange the cherry tomatoes, cucumber, olives, and feta cheese on top of the quinoa.",
      "Add a dollop of hummus in the center.",
      "Drizzle the lemon vinaigrette over the entire bowl before serving."
    ],
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  },
  {
    title: "Garlic Butter Salmon",
    category: "Dinner",
    rating: 5,
    estimatedTime: 25,
    ingredients: [
      "2 salmon fillets",
      "3 cloves garlic, minced",
      "2 tbsp butter, melted",
      "1 tbsp fresh parsley, chopped",
      "1/2 lemon, sliced",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C) and line a baking sheet with parchment paper.",
      "Place salmon fillets on the baking sheet and season generously with salt and pepper.",
      "In a small bowl, mix melted butter, minced garlic, and chopped parsley.",
      "Brush the garlic butter mixture over the salmon fillets.",
      "Top with lemon slices and bake for 12-15 minutes until salmon is flaky."
    ],
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  },
  {
    title: "Fudgy Chocolate Brownies",
    category: "Dessert",
    rating: 5,
    estimatedTime: 45,
    ingredients: [
      "1/2 cup unsalted butter, melted",
      "1 cup granulated sugar",
      "2 large eggs",
      "1 tsp vanilla extract",
      "1/3 cup cocoa powder",
      "1/2 cup all-purpose flour",
      "1/4 tsp salt",
      "1/2 cup chocolate chips"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C) and grease an 8x8 inch baking pan.",
      "In a large bowl, whisk together melted butter and sugar until well combined.",
      "Beat in the eggs and vanilla extract until the mixture is smooth.",
      "Fold in the cocoa powder, flour, and salt until just combined (do not overmix).",
      "Stir in the chocolate chips.",
      "Pour the batter into the prepared pan and bake for 20-25 minutes.",
      "Let cool completely before cutting into squares."
    ],
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  },
  {
    title: "Spicy Roasted Chickpeas",
    category: "Snack",
    rating: 4,
    estimatedTime: 35,
    ingredients: [
      "1 can (15 oz) chickpeas, rinsed and thoroughly dried",
      "1 tbsp olive oil",
      "1 tsp smoked paprika",
      "1/2 tsp garlic powder",
      "1/4 tsp cayenne pepper",
      "1/2 tsp sea salt"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C) and line a baking sheet with parchment paper.",
      "Ensure chickpeas are completely dry to ensure crispiness.",
      "Toss the chickpeas with olive oil, paprika, garlic powder, cayenne pepper, and salt.",
      "Spread them in a single layer on the baking sheet.",
      "Roast for 25-30 minutes, shaking the pan halfway through, until crispy.",
      "Let cool slightly before serving."
    ],
    imageUrl: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  },
  {
    title: "Refreshing Berry Smoothie",
    category: "Drink",
    rating: 5,
    estimatedTime: 5,
    ingredients: [
      "1 cup mixed frozen berries (strawberries, blueberries, raspberries)",
      "1/2 cup Greek yogurt",
      "1/2 cup almond milk",
      "1 tbsp honey or maple syrup",
      "1/2 banana"
    ],
    instructions: [
      "Add all ingredients into a blender.",
      "Blend on high speed until smooth and creamy.",
      "If the smoothie is too thick, add a splash more almond milk.",
      "Pour into a glass and serve immediately."
    ],
    imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=1000",
    isStock: true
  }
];

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [householdsLoading, setHouseholdsLoading] = useState(true);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteHouseholdConfirmOpen, setIsDeleteHouseholdConfirmOpen] = useState(false);

  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [aiCategory, setAiCategory] = useState<Category>('Dinner');
  const [aiDetails, setAiDetails] = useState('');

  const [isDemoDisabledModalOpen, setIsDemoDisabledModalOpen] = useState(false);
  const [isDataDeletedModalOpen, setIsDataDeletedModalOpen] = useState(false);
  const [isFirstFamilyModalOpen, setIsFirstFamilyModalOpen] = useState(false);
  const [recipeFormError, setRecipeFormError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Ensure user profile exists
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', u.uid), {
            displayName: u.displayName || 'Anonymous Chef',
            photoURL: u.photoURL || ''
          });
        }

        // Cleanup old data (older than 24 hours)
        try {
          const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
          let dataDeleted = false;

          const hQuery = query(collection(db, 'households'), where(`members.${u.uid}`, 'in', ['admin', 'member', 'viewer']));
          const hSnapshot = await getDocs(hQuery);
          
          for (const hDoc of hSnapshot.docs) {
            const hData = hDoc.data();
            const createdAt = hData.createdAt?.toMillis?.() || 0;
            
            if (createdAt > 0 && createdAt < twentyFourHoursAgo && hData.ownerId === u.uid && !hData.isStock) {
              try {
                const rQuery = query(collection(db, 'recipes'), where('householdId', '==', hDoc.id));
                const rSnapshot = await getDocs(rQuery);
                for (const rDoc of rSnapshot.docs) {
                  try {
                    await deleteDoc(doc(db, 'recipes', rDoc.id));
                  } catch (e) {
                    console.error("Failed to delete recipe", e);
                  }
                }
                
                await deleteDoc(doc(db, 'households', hDoc.id));
                dataDeleted = true;
              } catch (e) {
                console.error("Failed to delete household", e);
              }
            } else {
              const rQuery = query(collection(db, 'recipes'), where('householdId', '==', hDoc.id));
              const rSnapshot = await getDocs(rQuery);
              for (const rDoc of rSnapshot.docs) {
                const rData = rDoc.data();
                const rCreatedAt = rData.createdAt?.toMillis?.() || 0;
                if (rCreatedAt > 0 && rCreatedAt < twentyFourHoursAgo && !rData.isStock && (rData.authorId === u.uid || hData.ownerId === u.uid)) {
                  try {
                    await deleteDoc(doc(db, 'recipes', rDoc.id));
                    dataDeleted = true;
                  } catch (e) {
                    console.error("Failed to delete recipe", e);
                  }
                }
              }
            }
          }

          if (dataDeleted) {
            setIsDataDeletedModalOpen(true);
          }
        } catch (error) {
          console.error("Error cleaning up old data:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Households
  useEffect(() => {
    if (!user) {
      setHouseholdsLoading(false);
      return;
    }
    setHouseholdsLoading(true);
    const q = query(collection(db, 'households'), where(`members.${user.uid}`, 'in', ['admin', 'member', 'viewer']));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const h = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Household));
      setHouseholds(h);
      setHouseholdsLoading(false);
      if (h.length > 0) {
        setSelectedHousehold(prev => {
          if (!prev) return h[0];
          const updated = h.find(hh => hh.id === prev.id);
          return updated || h[0];
        });
      } else {
        setSelectedHousehold(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'households');
    });
    return () => unsubscribe();
  }, [user]);

  // Fetch Recipes
  useEffect(() => {
    if (!user || !selectedHousehold) {
      setRecipes([]);
      return;
    }
    const q = query(collection(db, 'recipes'), where('householdId', '==', selectedHousehold.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRecipes = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
      fetchedRecipes.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || Date.now();
        const timeB = b.createdAt?.toMillis?.() || Date.now();
        return timeB - timeA;
      });
      setRecipes(fetchedRecipes);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'recipes');
    });
    return () => unsubscribe();
  }, [user, selectedHousehold]);

  const handleCreateHousehold = async (name: string) => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const newH = {
        name,
        ownerId: user.uid,
        members: { [user.uid]: 'admin' },
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'households'), newH);
      
      // Add stock recipes to the new household
      for (const recipe of STOCK_RECIPES) {
        await addDoc(collection(db, 'recipes'), {
          ...recipe,
          authorId: user.uid,
          householdId: docRef.id,
          createdAt: serverTimestamp()
        });
      }

      setSelectedHousehold({ id: docRef.id, ...newH } as Household);
      setIsHouseholdModalOpen(false);
      setIsFirstFamilyModalOpen(true);
    } catch (error) {
      console.error("Error creating household:", error);
      alert("Failed to create household.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteHousehold = async (householdId: string) => {
    if (!user) return;
    try {
      // 1. Delete all recipes in the household
      const rQuery = query(collection(db, 'recipes'), where('householdId', '==', householdId));
      const rSnapshot = await getDocs(rQuery);
      for (const rDoc of rSnapshot.docs) {
        await deleteDoc(doc(db, 'recipes', rDoc.id));
      }
      // 2. Delete the household
      await deleteDoc(doc(db, 'households', householdId));
      
      setIsDeleteHouseholdConfirmOpen(false);
      setIsHouseholdModalOpen(false);
    } catch (error) {
      console.error("Failed to delete household:", error);
      alert("Failed to delete household. Please try again.");
    }
  };

  const handleSaveRecipe = async (recipeData: Partial<Recipe>) => {
    if (!user || !selectedHousehold) return;
    
    // Validation
    if (!recipeData.title?.trim()) {
      setRecipeFormError("Please enter a recipe title.");
      return;
    }
    if (!recipeData.ingredients || recipeData.ingredients.length === 0) {
      setRecipeFormError("Please add at least one ingredient.");
      return;
    }
    if (!recipeData.instructions || recipeData.instructions.length === 0) {
      setRecipeFormError("Please add at least one instruction step.");
      return;
    }

    setRecipeFormError(null);

    // Remove undefined fields to prevent Firestore errors
    const cleanedData = Object.fromEntries(
      Object.entries(recipeData).filter(([_, v]) => v !== undefined)
    );

    try {
      if (editingRecipe?.id) {
        await updateDoc(doc(db, 'recipes', editingRecipe.id), {
          ...cleanedData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'recipes'), {
          ...cleanedData,
          authorId: user.uid,
          householdId: selectedHousehold.id,
          createdAt: serverTimestamp(),
          rating: cleanedData.rating || 0
        });
      }
      setIsAddModalOpen(false);
      setEditingRecipe(null);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
      setViewingRecipe(null);
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `recipes/${id}`);
    }
  };

  const handleImport = async () => {
    if (!importUrl) return;
    setIsProcessing(true);
    setImportError(null);
    console.log("Starting import for URL:", importUrl);
    try {
      const extracted = await extractRecipeFromUrl(importUrl);
      console.log("Extracted recipe:", extracted);
      
      const imageUrl = await generateRecipeImage(extracted.title, extracted.category);
      
      // Close import modal first
      setIsImportModalOpen(false);
      
      // Set the editing recipe with temporary fields to satisfy the type
      setEditingRecipe({
        ...extracted,
        id: '', // Temporary ID to indicate it's new but has data
        sourceUrl: importUrl,
        imageUrl: imageUrl || '',
        category: extracted.category as Category || 'Other',
        authorId: user?.uid || '',
        householdId: selectedHousehold?.id || '',
        createdAt: Timestamp.now()
      } as Recipe);
      
      // Open the add modal
      setIsAddModalOpen(true);
      setImportUrl(''); // Clear the URL
    } catch (error) {
      console.error("Import failed:", error);
      setImportError(error instanceof Error ? error.message : "Failed to import recipe. Please check the URL and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateRecipe = async () => {
    setIsProcessing(true);
    try {
      const recipe = await generateRecipe(aiCategory, aiDetails);
      const imageUrl = await generateRecipeImage(recipe.title, aiCategory);
      
      setIsGenerateModalOpen(false);
      
      setEditingRecipe({
        ...recipe,
        category: aiCategory,
        imageUrl: imageUrl || '',
        id: '',
        authorId: user?.uid || '',
        householdId: selectedHousehold?.id || '',
        createdAt: Timestamp.now()
      } as Recipe);
      
      setIsAddModalOpen(true);
      setAiDetails('');
    } catch (error) {
      console.error("Generate failed:", error);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddMember = async (userId: string, role: 'admin' | 'member' | 'viewer' = 'member') => {
    if (!selectedHousehold || !user || selectedHousehold.ownerId !== user.uid) return;
    try {
      const hRef = doc(db, 'households', selectedHousehold.id);
      await updateDoc(hRef, {
        [`members.${userId}`]: role
      });
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Failed to add member. Please check the User ID and try again.");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedHousehold || !user || selectedHousehold.ownerId !== user.uid) return;
    if (userId === user.uid) {
      alert("You cannot remove yourself from your own household.");
      return;
    }
    try {
      const hRef = doc(db, 'households', selectedHousehold.id);
      await updateDoc(hRef, {
        [`members.${userId}`]: deleteField()
      });
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member. Please try again.");
    }
  };

  const handleCopyId = () => {
    if (user) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading || (user && householdsLoading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 font-serif">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-stone-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl rotate-3">
            <ChefHat className="w-10 h-10 text-stone-50" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-stone-900 tracking-tight">Heirloom</h1>
            <p className="text-stone-500 text-lg">Your digital kitchen for family traditions.</p>
          </div>
          <Button onClick={signIn} className="w-full py-4 text-lg shadow-lg">
            Sign in with Google
          </Button>
        </motion.div>
      </div>
    );
  }

  if (households.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center p-6 font-serif">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-stone-800 rounded-3xl flex items-center justify-center mx-auto shadow-xl rotate-3">
            <Users className="w-10 h-10 text-stone-50" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Create a Household</h1>
            <p className="text-stone-500 text-lg">You need a household to start saving recipes. A household is where you and your family share traditions.</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const name = new FormData(e.currentTarget).get('name') as string;
            handleCreateHousehold(name);
          }} className="space-y-4">
            <input 
              name="name" 
              required 
              placeholder="e.g. The Smith Family" 
              className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-stone-800/10 outline-none bg-white shadow-sm" 
              disabled={isProcessing} 
            />
            <Button type="submit" className="w-full py-4 text-lg shadow-lg" disabled={isProcessing}>
              {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create Household"}
            </Button>
          </form>

          <button onClick={logOut} className="text-stone-400 hover:text-stone-600 text-sm font-medium transition-colors">
            Sign out
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f5f5f0] dark:bg-stone-950 text-stone-800 dark:text-stone-200 font-sans pb-24 transition-colors duration-300">
      <div id="main-content">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#f5f5f0]/80 dark:bg-stone-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-stone-200/50 dark:border-stone-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-800 dark:bg-stone-100 rounded-xl flex items-center justify-center shadow-lg -rotate-6">
            <ChefHat className="w-6 h-6 text-stone-50 dark:text-stone-900" />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight hidden sm:block">Heirloom</h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => setIsDarkMode(prev => !prev)}
            className="p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-500 dark:text-stone-400 flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative group">
            <button 
              onClick={() => setIsHouseholdModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all shadow-sm"
            >
              <Users className="w-4 h-4 text-stone-400" />
              <span className="font-medium text-sm text-stone-700 dark:text-stone-200">{selectedHousehold?.name || 'Select Household'}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3 pl-4 border-l border-stone-200 dark:border-stone-800">
            <img src={user.photoURL || ''} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-800" alt="Profile" />
            <button onClick={logOut} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors">
              <LogOut className="w-5 h-5 text-stone-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome & Stats */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-serif font-bold text-stone-900 dark:text-stone-50">Welcome, {user.displayName?.split(' ')[0]}</h2>
            <p className="text-stone-500 dark:text-stone-400 italic">What's cooking today?</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsGenerateModalOpen(true)} className="dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700">
              <Sparkles className="w-4 h-4" /> AI Recipe
            </Button>
            <Button variant="secondary" onClick={() => setIsImportModalOpen(true)} className="dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700">
              <LinkIcon className="w-4 h-4" /> Import URL
            </Button>
            <Button onClick={() => { setEditingRecipe(null); setIsAddModalOpen(true); }} className="dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
              <Plus className="w-4 h-4" /> Add Recipe
            </Button>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 lg:min-w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search recipes or ingredients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 transition-all text-lg"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={cn(
                  "px-6 py-4 rounded-2xl whitespace-nowrap font-medium transition-all border",
                  selectedCategory === cat 
                    ? "bg-stone-800 dark:bg-stone-100 text-stone-50 dark:text-stone-900 border-stone-800 dark:border-stone-100 shadow-md" 
                    : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Recipe Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                onClick={() => setViewingRecipe(recipe)}
                className="group cursor-pointer"
              >
                <Card className="h-full flex flex-col gap-4 overflow-hidden p-0 border-stone-200 dark:border-stone-800">
                  <div className="aspect-[4/3] bg-stone-200 dark:bg-stone-800 relative overflow-hidden">
                    {recipe.imageUrl ? (
                      <img 
                        src={recipe.imageUrl} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                        alt={recipe.title} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-stone-600">
                        <Utensils className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-100 shadow-sm">
                      {recipe.category}
                    </div>
                  </div>
                  <div className="p-6 pt-2 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-50 line-clamp-1">{recipe.title}</h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">{recipe.rating || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-stone-400 dark:text-stone-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.estimatedTime ? `${recipe.estimatedTime}m` : `${recipe.instructions.length * 5}m`}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Soup className="w-4 h-4" />
                        <span>{recipe.ingredients.length} ingredients</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-stone-300" />
            </div>
            <h3 className="text-xl font-serif font-medium text-stone-500">No recipes found</h3>
            <p className="text-stone-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
      </div>

      {/* Modals */}
      
      {/* View Recipe Modal */}
      <Modal 
        isOpen={!!viewingRecipe} 
        onClose={() => { setViewingRecipe(null); setIsDeleteConfirmOpen(false); }} 
        title={viewingRecipe?.title}
      >
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-stone-500 dark:text-stone-400">
            <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-bold uppercase">{viewingRecipe?.category}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">{viewingRecipe?.rating}</span>
            </div>
            {viewingRecipe?.sourceUrl && (
              <a href={viewingRecipe.sourceUrl} target="_blank" className="flex items-center gap-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-100">
                <LinkIcon className="w-4 h-4" /> Source
              </a>
            )}
          </div>

          {viewingRecipe?.imageUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
              <img 
                src={viewingRecipe.imageUrl} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
                alt={viewingRecipe.title} 
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
              <h4 className="text-lg font-serif font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-stone-900 dark:text-stone-50">Ingredients</h4>
              <ul className="space-y-2">
                {viewingRecipe?.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700 mt-2 flex-shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-lg font-serif font-bold border-b border-stone-200 dark:border-stone-800 pb-2 text-stone-900 dark:text-stone-50">Instructions</h4>
              <ol className="space-y-6">
                {viewingRecipe?.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-400 dark:text-stone-500 text-sm">{i + 1}</span>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex justify-between">
            {isDeleteConfirmOpen ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-red-600">Are you sure?</span>
                <Button variant="danger" onClick={() => viewingRecipe && handleDeleteRecipe(viewingRecipe.id!)}>
                  Yes, Delete
                </Button>
                <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setIsDeleteConfirmOpen(true)}>
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            )}
            <Button onClick={() => { setEditingRecipe(viewingRecipe); setViewingRecipe(null); setIsAddModalOpen(true); }}>
              <Edit2 className="w-4 h-4" /> Edit Recipe
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add/Edit Recipe Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setEditingRecipe(null); setRecipeFormError(null); }} 
        title={editingRecipe?.id ? "Edit Recipe" : "Add New Recipe"}
      >
        <form 
          key={editingRecipe ? (editingRecipe.id || 'imported-' + editingRecipe.title) : 'new'}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSaveRecipe({
              title: formData.get('title') as string,
              category: formData.get('category') as Category,
              rating: Number(formData.get('rating')),
              estimatedTime: formData.get('estimatedTime') ? Number(formData.get('estimatedTime')) : null,
              ingredients: (formData.get('ingredients') as string).split('\n').filter(i => i.trim()),
              instructions: (formData.get('instructions') as string).split('\n').filter(i => i.trim()),
              imageUrl: formData.get('imageUrl') as string,
              sourceUrl: formData.get('sourceUrl') as string,
            });
          }} 
          className="space-y-6"
        >
          {recipeFormError && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{recipeFormError}</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Title</label>
              <input name="title" required defaultValue={editingRecipe?.title} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Category</label>
              <select name="category" defaultValue={editingRecipe?.category || 'Dinner'} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none">
                {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Rating (1-5)</label>
              <input name="rating" type="number" min="1" max="5" defaultValue={editingRecipe?.rating || 5} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Time (minutes)</label>
              <input name="estimatedTime" type="number" min="1" defaultValue={editingRecipe?.estimatedTime} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none" placeholder="e.g. 30" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Ingredients (One per line)</label>
            <textarea name="ingredients" required rows={5} defaultValue={editingRecipe?.ingredients.join('\n')} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Instructions (One step per line)</label>
            <textarea name="instructions" required rows={5} defaultValue={editingRecipe?.instructions.join('\n')} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Image URL (Optional)</label>
              <input name="imageUrl" defaultValue={editingRecipe?.imageUrl} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Source URL (Optional)</label>
              <input name="sourceUrl" defaultValue={editingRecipe?.sourceUrl} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none" />
            </div>
          </div>

          <Button type="submit" className="w-full py-4 text-lg">Save Recipe</Button>
        </form>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={isImportModalOpen} onClose={() => { setIsImportModalOpen(false); setImportError(null); }} title="Import from Web">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Recipe URL</label>
            <input 
              type="url" 
              placeholder="https://example.com/best-cookies" 
              value={importUrl}
              onChange={(e) => { setImportUrl(e.target.value); setImportError(null); }}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none" 
            />
          </div>
          {importError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{importError}</p>
            </div>
          )}
          <Button className="w-full py-4" onClick={handleImport} disabled={isProcessing || !importUrl}>
            {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Extracting...</> : "Import Recipe"}
          </Button>
          <p className="text-sm text-stone-400 text-center italic">Gemini will intelligently gather only the essential recipe details and ingredients for you.</p>
        </div>
      </Modal>

      {/* Generate AI Recipe Modal */}
      <Modal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} title="Generate AI Recipe">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Meal Type</label>
            <select 
              value={aiCategory} 
              onChange={(e) => setAiCategory(e.target.value as Category)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none"
            >
              {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Preferences (Optional)</label>
            <textarea 
              placeholder="e.g., Needs to be vegan, use sweet potatoes, spicy..."
              value={aiDetails}
              onChange={(e) => setAiDetails(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-stone-800/10 dark:focus:ring-stone-100/10 outline-none"
            />
          </div>
          <Button className="w-full py-4" onClick={handleGenerateRecipe} disabled={isProcessing}>
            {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : "Generate Recipe & Image"}
          </Button>
          <p className="text-sm text-stone-400 text-center italic">Gemini will create a unique recipe and generate a photo to match.</p>
        </div>
      </Modal>

      {/* Household Modal */}
      <Modal isOpen={isHouseholdModalOpen} onClose={() => setIsHouseholdModalOpen(false)} title="My Households">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Switch Household</h3>
            <div className="grid grid-cols-1 gap-2">
              {households.map(h => (
                <button
                  key={h.id}
                  onClick={() => { setSelectedHousehold(h); setIsHouseholdModalOpen(false); }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all",
                    selectedHousehold?.id === h.id 
                      ? "bg-stone-800 dark:bg-stone-100 border-stone-800 dark:border-stone-100 text-stone-50 dark:text-stone-900" 
                      : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 text-stone-900 dark:text-stone-100"
                  )}
                >
                  <span className="font-medium">{h.name}</span>
                  {selectedHousehold?.id === h.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {selectedHousehold && selectedHousehold.ownerId === user.uid && (
            <div className="space-y-4 pt-8 border-t border-stone-200">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Invite Member</h3>
              <p className="text-xs text-stone-400 italic">Enter the User ID of the person you want to invite.</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const uid = new FormData(e.currentTarget).get('uid') as string;
                handleAddMember(uid);
                e.currentTarget.reset();
              }} className="flex gap-2">
                <input name="uid" required placeholder="User UID" className="flex-1 px-4 py-2 rounded-xl border border-stone-200 outline-none" />
                <Button type="submit">Invite</Button>
              </form>
              <div className="space-y-2">
                {Object.entries(selectedHousehold.members).map(([uid, role]) => (
                  <div key={uid} className="flex justify-between items-center text-sm p-2 bg-white rounded-lg border border-stone-100">
                    <span className="font-mono text-xs text-stone-400">{uid.slice(0, 8)}...</span>
                    <div className="flex items-center gap-2">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-bold">{role}</span>
                      {uid !== user.uid && (
                        <button 
                          onClick={() => handleRemoveMember(uid)}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                          title="Remove member"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 pt-8 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">My User ID</h3>
            <div className="flex items-center justify-between p-3 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <code className="text-xs font-mono text-stone-600 dark:text-stone-300">{user.uid}</code>
              <button 
                onClick={handleCopyId}
                className="text-[10px] font-bold uppercase text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Create New Household</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = new FormData(e.currentTarget).get('name') as string;
              handleCreateHousehold(name);
            }} className="flex gap-2">
              <input name="name" required placeholder="e.g. The Smith Family" className="flex-1 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 outline-none" disabled={isProcessing} />
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create"}
              </Button>
            </form>
          </div>

          {selectedHousehold && selectedHousehold.ownerId === user.uid && (
            <div className="pt-8 border-t border-stone-200 flex justify-end">
              {isDeleteHouseholdConfirmOpen ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-red-600">Are you sure?</span>
                  <Button variant="danger" onClick={() => handleDeleteHousehold(selectedHousehold.id)}>
                    Yes, Delete Household
                  </Button>
                  <Button variant="secondary" onClick={() => setIsDeleteHouseholdConfirmOpen(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="danger" onClick={() => setIsDeleteHouseholdConfirmOpen(true)}>
                  <Trash2 className="w-4 h-4" /> Delete Household
                </Button>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Demo Disabled Modal */}
      <Modal isOpen={isDemoDisabledModalOpen} onClose={() => setIsDemoDisabledModalOpen(false)} title="Feature Disabled">
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-stone-400" />
          </div>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            Sharing households with other users has been disabled for this demo to protect user privacy.
          </p>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            If you'd like to use this feature, click the <strong>Remix</strong> button in AI Studio to create your own private version of this app!
          </p>
          <Button className="w-full py-4 mt-4" onClick={() => setIsDemoDisabledModalOpen(false)}>
            Got it
          </Button>
        </div>
      </Modal>

      {/* Data Deleted Modal */}
      <Modal isOpen={isDataDeletedModalOpen} onClose={() => setIsDataDeletedModalOpen(false)} title="Data Cleanup">
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-stone-400" />
          </div>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            Welcome back! Just a heads up: to keep this demo clean, all user data is automatically deleted after 24 hours.
          </p>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            If you want your recipes to persist forever, click the <strong>Remix</strong> button in AI Studio to create your own private version of this app!
          </p>
          <Button className="w-full py-4 mt-4" onClick={() => setIsDataDeletedModalOpen(false)}>
            I understand
          </Button>
        </div>
      </Modal>

      {/* First Family Created Modal */}
      <Modal isOpen={isFirstFamilyModalOpen} onClose={() => setIsFirstFamilyModalOpen(false)} title="Welcome to Heirloom!">
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-stone-400" />
          </div>
          <div className="space-y-4">
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              Your family kitchen has been created! 
            </p>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-900/50 rounded-2xl text-amber-800 dark:text-amber-200 text-sm">
              <p className="font-bold mb-1">Important Demo Info:</p>
              <p>To keep this demo fast and clean, all data is automatically deleted after 24 hours.</p>
            </div>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              If you want to create your own permanent version and keep your family recipes forever, click the <strong>Remix</strong> button in the top right of AI Studio!
            </p>
          </div>
          <Button className="w-full py-4 mt-4" onClick={() => setIsFirstFamilyModalOpen(false)}>
            Start Cooking
          </Button>
        </div>
      </Modal>
    </div>
    </ErrorBoundary>
  );
}
