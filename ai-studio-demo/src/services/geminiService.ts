import { GoogleGenAI, Type } from "@google/genai";

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || '' });

export interface ExtractedRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  estimatedTime?: number;
}

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
    category: { type: Type.STRING, description: "One of: Breakfast, Lunch, Dinner, Dessert, Snack, Drink, Other" },
    estimatedTime: { type: Type.NUMBER, description: "The estimated total time to make this recipe in minutes" }
  },
  required: ["title", "ingredients", "instructions", "category"]
};

export async function extractRecipeFromUrl(url: string): Promise<ExtractedRecipe> {
  try {
    if (!url.startsWith('http')) {
      throw new Error("Please enter a valid URL starting with http:// or https://");
    }

    const contents = [
      { text: `I need you to extract a recipe from this specific URL: ${url}` },
      { text: `Please use your tools to access the content of the page at ${url}.
      CRITICAL INSTRUCTION: Many recipe pages are very long and filled with ads or life stories. To find the actual recipe, you MUST search the page content for the exact words "ingredients", "directions", or "instructions". The recipe will be located near these keywords.
      
      Extract the following information in JSON format:
      - title: The name of the recipe
      - ingredients: An array of strings, each being one ingredient with its amount
      - instructions: An array of strings, each being one step of the recipe
      - category: One of [Breakfast, Lunch, Dinner, Dessert, Snack, Drink, Other]
      - estimatedTime: The estimated total time to make this recipe in minutes (number)
      
      Focus only on the recipe itself. Ignore the blog post text, ads, and comments.` }
    ];

    const response = await getAi().models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        tools: [{ urlContext: {} }, { googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: recipeSchema
      }
    });

    const text = response.text;
    if (!text || text.trim() === "{}" || text.trim() === "[]") {
      throw new Error("The AI couldn't find a recipe at that URL. The website might be blocking access or the layout might be too complex.");
    }

    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON Parse Error:", text);
      throw new Error("The AI returned data in an unexpected format. Please try again.");
    }
    
    if (!parsed.title || !parsed.ingredients || parsed.ingredients.length === 0) {
      throw new Error("The AI found the page but couldn't identify a complete recipe. You might need to add this one manually.");
    }
    
    return parsed as ExtractedRecipe;
  } catch (error) {
    console.error("Error in extractRecipeFromUrl:", error);
    if (error instanceof Error) {
      if (error.message.includes("URL") || error.message.includes("AI") || error.message.includes("format") || error.message.includes("recipe")) {
        throw error;
      }
    }
    throw new Error("We had trouble reaching that website. Please try another URL or add the recipe manually.");
  }
}

export async function generateRecipe(category: string, details: string): Promise<ExtractedRecipe> {
  const prompt = `Act as a professional chef. Generate a high-quality, delicious recipe for a ${category}. 
  ${details ? `The user has requested the following specific details or ingredients: ${details}` : ''}
  Please provide a creative title, a list of ingredients with measurements, and step-by-step instructions.`;

  const response = await getAi().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate recipe.");
  return JSON.parse(text) as ExtractedRecipe;
}

async function compressImage(base64Str: string, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64Str);
  });
}

const CURATED_FOOD_IMAGES = [
  { id: 'photo-1482049016688-2d3e1b311543', tags: 'eggs, breakfast, toast, avocado, brunch' },
  { id: 'photo-1504674900247-0877df9cc836', tags: 'steak, meat, dinner, gourmet, beef' },
  { id: 'photo-1512621776951-a57141f2eefd', tags: 'salad, healthy, lunch, vegetables, green' },
  { id: 'photo-1563729784474-d77dbb933a9e', tags: 'cake, dessert, sweet, baking, chocolate' },
  { id: 'photo-1546069901-ba9599a7e63c', tags: 'bowl, healthy, lunch, quinoa, buddha bowl' },
  { id: 'photo-1565299624946-b28f40a0ae38', tags: 'pizza, italian, dinner, cheese, pepperoni' },
  { id: 'photo-1473093226795-af9932fe5856', tags: 'pasta, italian, dinner, tomato, spaghetti' },
  { id: 'photo-1528207776546-365bb710ee93', tags: 'pancakes, breakfast, syrup, sweet, stack' },
  { id: 'photo-1555939594-58d7cb561ad1', tags: 'bbq, meat, grill, dinner, skewers' },
  { id: 'photo-1540189549336-e6e99c3679fe', tags: 'salad, healthy, lunch, gourmet, salmon' },
  { id: 'photo-1565958011703-44f9829ba187', tags: 'dessert, cheesecake, sweet, berries, fruit' },
  { id: 'photo-1484723091739-30a097e8f929', tags: 'toast, breakfast, fruit, healthy, french toast' },
  { id: 'photo-1476224489421-aba8c155111a', tags: 'dinner, gourmet, plated, professional, seafood' },
  { id: 'photo-1517701550927-30cf4ba1dba5', tags: 'coffee, drink, breakfast, cafe, latte' },
  { id: 'photo-1544145945-f904253d0c7b', tags: 'cocktail, drink, bar, party, mojito' },
  { id: 'photo-1551024506-0bccd828d307', tags: 'donuts, dessert, sweet, snack, glazed' },
  { id: 'photo-1543339308-43e59d6b73a6', tags: 'snack, healthy, fruit, nuts, platter' },
  { id: 'photo-1562967914-608f82629710', tags: 'chicken, dinner, roasted, meat, poultry' },
  { id: 'photo-1493770348161-369560ae357d', tags: 'breakfast, healthy, fruit, bowl, smoothie' },
  { id: 'photo-1543353071-873f17a7a088', tags: 'soup, lunch, dinner, warm, bowl' },
  { id: 'photo-1511690656952-34342bb7c2f2', tags: 'food, table, spread, variety, feast' },
  { id: 'photo-1504113888839-1c8eb50233d3', tags: 'japanese, sushi, dinner, fish, rolls' },
  { id: 'photo-1551183053-bf91a1d81141', tags: 'pie, dessert, baking, fruit, crust' },
  { id: 'photo-1541014741259-de529411b96a', tags: 'burger, fast food, lunch, dinner, fries' },
  { id: 'photo-1513104890138-7c749659a591', tags: 'pizza, italian, cheese, dinner, fast food' },
  { id: 'photo-1432139555190-58524dae6a55', tags: 'meat, steak, dinner, gourmet, beef' },
  { id: 'photo-1467003909585-2f8a72700288', tags: 'salmon, fish, dinner, healthy, seafood' },
  { id: 'photo-1470333738027-550397360af1', tags: 'cocktail, drink, bar, party, alcohol' },
  { id: 'photo-1490645935967-10de6ba17061', tags: 'salad, healthy, lunch, vegetables, vegan' },
  { id: 'photo-1506084868730-342b1f852e0d', tags: 'breakfast, healthy, bowl, fruit, granola' },
  { id: 'photo-1504674900247-0877df9cc836', tags: 'steak, dinner, meat, gourmet, beef' },
  { id: 'photo-1512621776951-a57141f2eefd', tags: 'salad, healthy, lunch, vegetables, green' },
  { id: 'photo-1513104890138-7c749659a591', tags: 'pizza, italian, cheese, dinner, fast food' },
  { id: 'photo-1514327605112-b887c0e61c0a', tags: 'soup, lunch, dinner, warm, bowl' },
  { id: 'photo-1515003197210-e0cd71810b5f', tags: 'burger, lunch, dinner, fast food, fries' },
  { id: 'photo-1519708227418-c8fd9a32b7a2', tags: 'salmon, fish, dinner, healthy, seafood' },
  { id: 'photo-1529042410759-befb1284b791', tags: 'meatballs, dinner, italian, pasta, tomato' },
  { id: 'photo-1534422298391-e4f8c172dddb', tags: 'dumplings, asian, lunch, dinner, chinese' },
  { id: 'photo-1540189549336-e6e99c3679fe', tags: 'salad, healthy, lunch, gourmet, salmon' },
  { id: 'photo-1543353071-873f17a7a088', tags: 'soup, lunch, dinner, warm, bowl' },
  { id: 'photo-1544025162-d76694265947', tags: 'ribs, bbq, meat, dinner, grill' },
  { id: 'photo-1546069901-ba9599a7e63c', tags: 'bowl, healthy, lunch, quinoa, buddha bowl' },
  { id: 'photo-1546793665-c74683c3f43d', tags: 'sandwich, lunch, healthy, bread, snack' },
  { id: 'photo-1551024601-bec78aea704b', tags: 'dessert, cake, sweet, baking, chocolate' },
  { id: 'photo-1551183053-bf91a1d81141', tags: 'pie, dessert, baking, fruit, crust' },
  { id: 'photo-1555939594-58d7cb561ad1', tags: 'bbq, meat, grill, dinner, skewers' },
  { id: 'photo-1559339352-11d035aa65de', tags: 'tacos, mexican, dinner, lunch, spicy' },
  { id: 'photo-1560684848-51c893eca19c', tags: 'pasta, italian, dinner, tomato, spaghetti' },
  { id: 'photo-1562967914-608f82629710', tags: 'chicken, dinner, roasted, meat, poultry' },
  { id: 'photo-1563379091339-03b21ef4a4f8', tags: 'pasta, italian, dinner, cheese, creamy' },
  { id: 'photo-1563729784474-d77dbb933a9e', tags: 'cake, dessert, sweet, baking, chocolate' },
  { id: 'photo-1565299507177-b0ac66763828', tags: 'burger, lunch, dinner, fast food, cheese' },
  { id: 'photo-1565299624946-b28f40a0ae38', tags: 'pizza, italian, dinner, cheese, pepperoni' },
  { id: 'photo-1565958011703-44f9829ba187', tags: 'dessert, cheesecake, sweet, berries, fruit' },
  { id: 'photo-1565299543923-37dd39e06736', tags: 'pancakes, breakfast, syrup, sweet, stack' },
  { id: 'photo-1554520735-0ad66a96f34b', tags: 'pancakes, breakfast, syrup, sweet, stack' },
  { id: 'photo-1568901346375-23c9450c58cd', tags: 'burger, lunch, dinner, fast food, cheese' },
  { id: 'photo-1569718212165-3a8278d5f624', tags: 'ramen, noodles, asian, dinner, soup' },
  { id: 'photo-1574484284002-952d92456975', tags: 'curry, indian, dinner, spicy, rice' },
  { id: 'photo-1574894709920-11b28e7367e3', tags: 'pasta, italian, dinner, tomato, spaghetti' },
  { id: 'photo-1585032226651-759b368d7246', tags: 'noodles, asian, lunch, dinner, spicy' },
  { id: 'photo-1589302168068-964664d93dc0', tags: 'biryani, indian, dinner, rice, spicy' },
  { id: 'photo-1593504049359-74330189a345', tags: 'pizza, italian, dinner, cheese, fast food' },
  { id: 'photo-1594000199163-24b94cee129f', tags: 'pizza, italian, dinner, cheese, fast food' },
  { id: 'photo-1598103442097-8b74394b95c6', tags: 'chicken, dinner, roasted, meat, poultry' },
  { id: 'photo-1598515214211-89d3c73ae83b', tags: 'chicken, dinner, roasted, meat, poultry' },
  { id: 'photo-1600891964599-f61ba0e24092', tags: 'steak, dinner, meat, gourmet, beef' },
  { id: 'photo-1603360946369-dc9bb6258143', tags: 'pasta, italian, dinner, tomato, spaghetti' },
  { id: 'photo-1604382354936-07c5d9983bd3', tags: 'pizza, italian, dinner, cheese, fast food' },
  { id: 'photo-1604908176997-125f25cc6f3d', tags: 'chicken, dinner, roasted, meat, poultry' },
  { id: 'photo-1606787366850-de6330128bfc', tags: 'food, table, spread, variety, feast' },
  { id: 'photo-1607532941433-304659e8198a', tags: 'salad, healthy, lunch, vegetables, green' },
  { id: 'photo-1621996346565-e3dbc646d9a9', tags: 'pasta, italian, dinner, tomato, spaghetti' },
  { id: 'photo-1627308595229-7830a5c91f9f', tags: 'salad, healthy, lunch, vegetables, green' },
  { id: 'photo-1633337444204-60a301a3240d', tags: 'burger, lunch, dinner, fast food, cheese' },
  { id: 'photo-1481931098730-318b6f776db0', tags: 'fruit, healthy, snack, sweet, colorful' },
  { id: 'photo-1490818387583-1baba5e638af', tags: 'fruit, healthy, snack, sweet, colorful' },
  { id: 'photo-1494390248081-4e521a5940db', tags: 'breakfast, healthy, bowl, fruit, granola' },
  { id: 'photo-1502819126416-d387f86d47a1', tags: 'dessert, cake, sweet, baking, chocolate' },
  { id: 'photo-1505253716362-afaea1d3d1af', tags: 'sandwich, lunch, healthy, bread, snack' },
  { id: 'photo-1505576399279-565b52d4ac71', tags: 'smoothie, drink, healthy, fruit, breakfast' },
  { id: 'photo-1505935428862-770b6f24f629', tags: 'dessert, cake, sweet, baking, chocolate' },
  { id: 'photo-1506354666786-959d6d497f1a', tags: 'pizza, italian, dinner, cheese, fast food' },
  { id: 'photo-1511690656952-34342bb7c2f2', tags: 'food, table, spread, variety, feast' },
  { id: 'photo-1512152272829-e3139592d56f', tags: 'fast food, burger, fries, lunch, dinner' },
  { id: 'photo-1513104890138-7c749659a591', tags: 'pizza, italian, dinner, cheese, fast food' },
  { id: 'photo-1513442542250-854d436a73f2', tags: 'breakfast, healthy, egg, toast, coffee' },
  { id: 'photo-1515003197210-e0cd71810b5f', tags: 'burger, lunch, dinner, fast food, cheese' },
  { id: 'photo-1519708227418-c8fd9a32b7a2', tags: 'salmon, fish, dinner, healthy, seafood' },
  { id: 'photo-1525351484163-7529414344d8', tags: 'breakfast, healthy, bowl, fruit, granola' },
  { id: 'photo-1529042410759-befb1284b791', tags: 'meatballs, dinner, italian, pasta, tomato' },
  { id: 'photo-1532980400857-e8d9d275d858', tags: 'pancakes, breakfast, syrup, sweet, stack' },
  { id: 'photo-1533089860892-a7c6f0a88666', tags: 'breakfast, healthy, bowl, fruit, granola' },
  { id: 'photo-1534422298391-e4f8c172dddb', tags: 'dumplings, asian, lunch, dinner, chinese' },
  { id: 'photo-1540189549336-e6e99c3679fe', tags: 'salad, healthy, lunch, gourmet, salmon' },
  { id: 'photo-1541014741259-de529411b96a', tags: 'burger, lunch, dinner, fast food, cheese' },
  { id: 'photo-1543353071-873f17a7a088', tags: 'soup, lunch, dinner, warm, bowl' },
  { id: 'photo-1544025162-d76694265947', tags: 'ribs, bbq, meat, dinner, grill' },
  { id: 'photo-1546069901-ba9599a7e63c', tags: 'bowl, healthy, lunch, quinoa, buddha bowl' },
  { id: 'photo-1546793665-c74683c3f43d', tags: 'sandwich, lunch, healthy, bread, snack' }
];


export async function generateRecipeImage(title: string, category?: string): Promise<string | null> {
  try {
    const imageList = CURATED_FOOD_IMAGES.map((img, index) => `${index}: ${img.tags}`).join('\n');
    
    const response = await getAi().models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I have a recipe titled "${title}" in the category "${category || 'Other'}". 
      Below is a list of high-quality food images with their tags. 
      Pick the index of the image that best matches this recipe.
      
      IMAGES:
      ${imageList}
      
      Output ONLY the index number, nothing else.`,
    });
    
    const indexStr = response.text.trim();
    const index = parseInt(indexStr);
    
    if (!isNaN(index) && index >= 0 && index < CURATED_FOOD_IMAGES.length) {
      return `https://images.unsplash.com/${CURATED_FOOD_IMAGES[index].id}?auto=format&fit=crop&q=80&w=1000`;
    }
    
    throw new Error("Invalid index returned");
  } catch (error) {
    console.error("Failed to select curated image:", error);
    // Fallback to a random image from the category if possible, or just a generic one
    const categoryMatch = CURATED_FOOD_IMAGES.find(img => img.tags.includes((category || '').toLowerCase()));
    const fallbackId = categoryMatch ? categoryMatch.id : CURATED_FOOD_IMAGES[20].id;
    return `https://images.unsplash.com/${fallbackId}?auto=format&fit=crop&q=80&w=1000`;
  }
}
