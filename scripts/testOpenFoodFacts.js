// Test Open Food Facts API without importing app modules
// Usage: node scripts/testOpenFoodFacts.js [query]

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {...options, signal: controller.signal});
    return resp;
  } finally {
    clearTimeout(id);
  }
}

function parseServingToGrams(serving) {
  if (!serving) return 100;
  const matchG = /([\d.]+)\s*g/i.exec(serving);
  if (matchG) return parseFloat(matchG[1]);
  const matchMl = /([\d.]+)\s*ml/i.exec(serving);
  if (matchMl) return parseFloat(matchMl[1]);
  return 100;
}

function mapProduct(query, product) {
  const n = product?.nutriments || {};
  const kcalServing = n['energy-kcal_serving'];
  const carbsServing = n['carbohydrates_serving'];
  const proteinServing = n['proteins_serving'];
  const fatServing = n['fat_serving'];

  if (
    kcalServing != null ||
    carbsServing != null ||
    proteinServing != null ||
    fatServing != null
  ) {
    return {
      name: product?.product_name || query,
      calories: kcalServing ?? 0,
      carbs: carbsServing ?? 0,
      protein: proteinServing ?? 0,
      fat: fatServing ?? 0,
      serving: product?.serving_size || '1 serving',
      source: 'openfoodfacts',
    };
  }

  const kcal100 = n['energy-kcal_100g'] ?? 0;
  const carbs100 = n['carbohydrates_100g'] ?? 0;
  const protein100 = n['proteins_100g'] ?? 0;
  const fat100 = n['fat_100g'] ?? 0;
  const grams = parseServingToGrams(product?.serving_size);
  const factor = grams / 100;
  return {
    name: product?.product_name || query,
    calories: Math.round(kcal100 * factor),
    carbs: Math.round(carbs100 * factor * 10) / 10,
    protein: Math.round(protein100 * factor * 10) / 10,
    fat: Math.round(fat100 * factor * 10) / 10,
    serving: product?.serving_size || `${grams} g`,
    source: 'openfoodfacts',
  };
}

async function searchOFF(query) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
    query,
  )}&search_simple=1&json=1&page_size=1`;
  const resp = await fetchWithTimeout(url);
  if (!resp.ok) throw new Error(`OFF error ${resp.status}`);
  const json = await resp.json();
  const product = json?.products?.[0];
  if (!product) throw new Error('No products');
  return mapProduct(query, product);
}

(async () => {
  try {
    const queries = process.argv.slice(2);
    const tests = queries.length
      ? queries
      : ['1 medium apple', 'protein bar', '200g chicken breast'];

    for (const q of tests) {
      const res = await searchOFF(q);
      console.log('Query:', q);
      console.log('Result:', res);
      console.log('---');
    }
  } catch (e) {
    console.error('OFF test failed:', e);
    process.exit(1);
  }
})();
