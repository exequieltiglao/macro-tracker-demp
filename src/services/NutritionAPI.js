// Lightweight nutrition API client with provider selection and local fallback
// Configure via env-like constants. Do NOT commit real keys.

import { FOOD_DATABASE, calculateMacrosForServing } from './FoodDatabase';

const CONFIG = {
  // Choose a provider: 'usda' | 'edamam' | 'nutritionix'
  provider: 'edamam',

  // Edamam Nutrition Analysis API (food name to nutrition)
  edamam: {
    appId: process.env.EDAMAM_APP_ID || '',
    appKey: process.env.EDAMAM_APP_KEY || '',
    endpoint: 'https://api.edamam.com/api/nutrition-data',
  },

  // Nutritionix Natural Language endpoint (food name to nutrition)
  nutritionix: {
    appId: process.env.NUTRITIONIX_APP_ID || '',
    appKey: process.env.NUTRITIONIX_APP_KEY || '',
    endpoint: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
  },

  // USDA FoodData Central (requires food id search, not implemented here)
  usda: {
    apiKey: process.env.USDA_API_KEY || '',
    endpoint: 'https://api.nal.usda.gov/fdc/v1',
  },
};

function hasProviderConfig() {
  const p = CONFIG.provider;
  if (p === 'edamam') return Boolean(CONFIG.edamam.appId && CONFIG.edamam.appKey);
  if (p === 'nutritionix') return Boolean(CONFIG.nutritionix.appId && CONFIG.nutritionix.appKey);
  if (p === 'usda') return Boolean(CONFIG.usda.apiKey);
  return false;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    return resp;
  } finally {
    clearTimeout(id);
  }
}

function mapEdamamResponseToFood(name, json) {
  // Edamam nutrition-data returns total calories/macros for the query
  // json: { calories, totalNutrients: { CHOCDF: {quantity}, PROCNT: {quantity}, FAT: {quantity} } }
  const carbs = json?.totalNutrients?.CHOCDF?.quantity ?? 0;
  const protein = json?.totalNutrients?.PROCNT?.quantity ?? 0;
  const fat = json?.totalNutrients?.FAT?.quantity ?? 0;
  const calories = json?.calories ?? 0;
  return {
    name,
    calories,
    carbs,
    protein,
    fat,
    serving: '1 serving',
    source: 'edamam',
  };
}

async function callEdamam(nameWithServing) {
  const { appId, appKey, endpoint } = CONFIG.edamam;
  const url = `${endpoint}?app_id=${encodeURIComponent(appId)}&app_key=${encodeURIComponent(appKey)}&ingr=${encodeURIComponent(nameWithServing)}`;
  const resp = await fetchWithTimeout(url);
  if (!resp.ok) throw new Error(`Edamam error: ${resp.status}`);
  const json = await resp.json();
  return mapEdamamResponseToFood(nameWithServing, json);
}

async function callNutritionix(nameWithServing) {
  const { appId, appKey, endpoint } = CONFIG.nutritionix;
  const resp = await fetchWithTimeout(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': appId,
      'x-app-key': appKey,
    },
    body: JSON.stringify({ query: nameWithServing }),
  });
  if (!resp.ok) throw new Error(`Nutritionix error: ${resp.status}`);
  const json = await resp.json();
  // nutritionix returns foods array
  const f = json?.foods?.[0];
  if (!f) throw new Error('No foods found');
  return {
    name: f.food_name || nameWithServing,
    calories: f.nf_calories ?? 0,
    carbs: f.nf_total_carbohydrate ?? 0,
    protein: f.nf_protein ?? 0,
    fat: f.nf_total_fat ?? 0,
    serving: f.serving_qty && f.serving_unit ? `${f.serving_qty} ${f.serving_unit}` : '1 serving',
    source: 'nutritionix',
  };
}

export async function getNutritionForQuery(query, servingMultiplier = 1) {
  // query examples: "1 medium apple", "200g chicken breast", "protein bar"
  try {
    if (hasProviderConfig()) {
      let base;
      if (CONFIG.provider === 'edamam') base = await callEdamam(query);
      else if (CONFIG.provider === 'nutritionix') base = await callNutritionix(query);
      else throw new Error('Provider not implemented');

      return calculateMacrosForServing(base, servingMultiplier);
    }
  } catch (err) {
    // fall through to local
    console.warn('Nutrition API failed, falling back to local DB:', err?.message || err);
  }

  // Fallback: try matching against local DB by name token
  const key = Object.keys(FOOD_DATABASE).find(k => query.toLowerCase().includes(k.replace('_', ' ')));
  if (key) {
    const food = FOOD_DATABASE[key];
    return calculateMacrosForServing(food, servingMultiplier);
  }

  // Last resort: return minimal entry
  return {
    name: query,
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    serving: '1 serving',
    source: 'local-unknown',
  };
}

export function isNutritionAPIConfigured() {
  return hasProviderConfig();
}
