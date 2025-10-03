// Comprehensive food database with nutritional information
export const FOOD_DATABASE = {
  // Fruits
  'apple': {
    name: 'Apple',
    calories: 95,
    carbs: 25,
    protein: 0.5,
    fat: 0.3,
    fiber: 4,
    serving: '1 medium (182g)',
    category: 'fruit'
  },
  'banana': {
    name: 'Banana',
    calories: 105,
    carbs: 27,
    protein: 1.3,
    fat: 0.4,
    fiber: 3,
    serving: '1 medium (118g)',
    category: 'fruit'
  },
  'orange': {
    name: 'Orange',
    calories: 62,
    carbs: 15.4,
    protein: 1.2,
    fat: 0.2,
    fiber: 3.1,
    serving: '1 medium (154g)',
    category: 'fruit'
  },
  'strawberries': {
    name: 'Strawberries',
    calories: 49,
    carbs: 11.7,
    protein: 1,
    fat: 0.5,
    fiber: 3,
    serving: '1 cup (152g)',
    category: 'fruit'
  },
  'blueberries': {
    name: 'Blueberries',
    calories: 84,
    carbs: 21.4,
    protein: 1.1,
    fat: 0.5,
    fiber: 3.6,
    serving: '1 cup (148g)',
    category: 'fruit'
  },

  // Vegetables
  'broccoli': {
    name: 'Broccoli',
    calories: 55,
    carbs: 11,
    protein: 4.3,
    fat: 0.6,
    fiber: 5.1,
    serving: '1 cup (91g)',
    category: 'vegetable'
  },
  'spinach': {
    name: 'Spinach',
    calories: 7,
    carbs: 1.1,
    protein: 0.9,
    fat: 0.1,
    fiber: 0.7,
    serving: '1 cup (30g)',
    category: 'vegetable'
  },
  'carrots': {
    name: 'Carrots',
    calories: 50,
    carbs: 12,
    protein: 1,
    fat: 0.3,
    fiber: 3.6,
    serving: '1 cup (128g)',
    category: 'vegetable'
  },
  'sweet_potato': {
    name: 'Sweet Potato',
    calories: 112,
    carbs: 26,
    protein: 2,
    fat: 0.1,
    fiber: 3.8,
    serving: '1 medium (114g)',
    category: 'vegetable'
  },

  // Proteins
  'chicken_breast': {
    name: 'Chicken Breast',
    calories: 165,
    carbs: 0,
    protein: 31,
    fat: 3.6,
    fiber: 0,
    serving: '100g',
    category: 'protein'
  },
  'salmon': {
    name: 'Salmon',
    calories: 208,
    carbs: 0,
    protein: 25,
    fat: 12,
    fiber: 0,
    serving: '100g',
    category: 'protein'
  },
  'eggs': {
    name: 'Eggs',
    calories: 155,
    carbs: 1.1,
    protein: 13,
    fat: 11,
    fiber: 0,
    serving: '2 large (100g)',
    category: 'protein'
  },
  'greek_yogurt': {
    name: 'Greek Yogurt',
    calories: 100,
    carbs: 6,
    protein: 17,
    fat: 0,
    fiber: 0,
    serving: '1 cup (170g)',
    category: 'protein'
  },
  'tofu': {
    name: 'Tofu',
    calories: 76,
    carbs: 1.9,
    protein: 8,
    fat: 4.8,
    fiber: 0.3,
    serving: '100g',
    category: 'protein'
  },

  // Grains
  'brown_rice': {
    name: 'Brown Rice',
    calories: 111,
    carbs: 23,
    protein: 2.6,
    fat: 0.9,
    fiber: 1.8,
    serving: '1/2 cup cooked (98g)',
    category: 'grain'
  },
  'quinoa': {
    name: 'Quinoa',
    calories: 120,
    carbs: 22,
    protein: 4.4,
    fat: 1.9,
    fiber: 2.8,
    serving: '1/2 cup cooked (92g)',
    category: 'grain'
  },
  'oats': {
    name: 'Oats',
    calories: 154,
    carbs: 27,
    protein: 5.3,
    fat: 2.6,
    fiber: 4,
    serving: '1/2 cup (40g)',
    category: 'grain'
  },
  'whole_wheat_bread': {
    name: 'Whole Wheat Bread',
    calories: 81,
    carbs: 13.8,
    protein: 4,
    fat: 1.1,
    fiber: 1.9,
    serving: '1 slice (28g)',
    category: 'grain'
  },

  // Nuts & Seeds
  'almonds': {
    name: 'Almonds',
    calories: 164,
    carbs: 6.1,
    protein: 6,
    fat: 14.2,
    fiber: 3.5,
    serving: '1 oz (28g)',
    category: 'nuts'
  },
  'walnuts': {
    name: 'Walnuts',
    calories: 185,
    carbs: 3.9,
    protein: 4.3,
    fat: 18.5,
    fiber: 1.9,
    serving: '1 oz (28g)',
    category: 'nuts'
  },
  'chia_seeds': {
    name: 'Chia Seeds',
    calories: 137,
    carbs: 12,
    protein: 4.4,
    fat: 8.6,
    fiber: 10.6,
    serving: '1 oz (28g)',
    category: 'nuts'
  },

  // Dairy
  'milk': {
    name: 'Milk',
    calories: 103,
    carbs: 12,
    protein: 8,
    fat: 2.4,
    fiber: 0,
    serving: '1 cup (244g)',
    category: 'dairy'
  },
  'cheese': {
    name: 'Cheddar Cheese',
    calories: 113,
    carbs: 0.4,
    protein: 7,
    fat: 9.3,
    fiber: 0,
    serving: '1 oz (28g)',
    category: 'dairy'
  },

  // Processed Foods
  'protein_bar': {
    name: 'Protein Bar',
    calories: 200,
    carbs: 20,
    protein: 15,
    fat: 8,
    fiber: 3,
    serving: '1 bar (50g)',
    category: 'processed'
  },
  'granola': {
    name: 'Granola',
    calories: 471,
    carbs: 64,
    protein: 10,
    fat: 20,
    fiber: 5,
    serving: '1 cup (122g)',
    category: 'processed'
  }
};

// Search function to find foods by name or category
export const searchFoods = (query) => {
  const searchTerm = query.toLowerCase();
  return Object.entries(FOOD_DATABASE)
    .filter(([key, food]) => 
      food.name.toLowerCase().includes(searchTerm) ||
      food.category.toLowerCase().includes(searchTerm)
    )
    .map(([key, food]) => ({ key, ...food }));
};

// Get random food suggestions
export const getRandomFoods = (count = 5) => {
  const foodKeys = Object.keys(FOOD_DATABASE);
  const randomKeys = foodKeys.sort(() => 0.5 - Math.random()).slice(0, count);
  return randomKeys.map(key => ({ key, ...FOOD_DATABASE[key] }));
};

// Get foods by category
export const getFoodsByCategory = (category) => {
  return Object.entries(FOOD_DATABASE)
    .filter(([key, food]) => food.category === category)
    .map(([key, food]) => ({ key, ...food }));
};

// Calculate macros for serving size
export const calculateMacrosForServing = (food, servingMultiplier) => {
  return {
    ...food,
    calories: Math.round(food.calories * servingMultiplier),
    carbs: Math.round(food.carbs * servingMultiplier * 10) / 10,
    protein: Math.round(food.protein * servingMultiplier * 10) / 10,
    fat: Math.round(food.fat * servingMultiplier * 10) / 10,
    fiber: Math.round(food.fiber * servingMultiplier * 10) / 10,
  };
};
