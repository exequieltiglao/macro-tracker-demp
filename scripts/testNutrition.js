// Simple test runner for NutritionAPI
// Usage: node scripts/testNutrition.js [query]

(async () => {
  try {
    const {getNutritionForQuery} = await import(
      '../src/services/NutritionAPI.js'
    );

    const queries = process.argv.slice(2);
    const tests =
      queries.length > 0
        ? queries
        : ['1 medium apple', '1 bar protein bar', '200g chicken breast'];

    for (const q of tests) {
      const result = await getNutritionForQuery(q, 1);
      console.log('Query:', q);
      console.log('Result:', result);
      console.log('---');
    }
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
})();
