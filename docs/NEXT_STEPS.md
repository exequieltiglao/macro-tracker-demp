# Macro Tracker – Next Steps / Roadmap

## High-Impact Features
1. Real Camera Integration
   - Wire `react-native-vision-camera` for photo, permissions, preview, capture
   - Optional on-device model for food recognition; fallback to manual selection
2. Barcode Scanning
   - Integrate `vision-camera-code-scanner` or `react-native-barcode-scanner`
   - Map UPC → Open Food Facts product → nutrition; fall back to generic
3. API Matching Improvements
   - OFF: broaden search (page_size=3), choose best by fuzzy match to query
   - Secondary provider fallback sequence (OFF → Nutritionix / Edamam if keys set)
4. Meal Builder
   - Save multi-item meals/recipes; quickly re-add saved meals
   - Per-meal macros and tags (breakfast/lunch/dinner/snack)
5. Sync & Backup
   - Optional cloud sync (Supabase/Firebase) for cross-device continuity
   - Export/import history (CSV/JSON)

## UX Enhancements
- Undo snackbar after adding or deleting an entry
- Quick-add widgets: common foods, recent items, favorites
- Weekly/Monthly insights: averages, best days, streaks
- Goal coaching: suggest adjustments when consistently over/under

## Data Quality & Validation
- Unit parsing improvements (e.g., ml vs g) and conversion helpers
- Strict schema for `food_history` and macro totals
- Deduplicate or merge entries added within a short time window

## Performance & Stability
- Batch `AsyncStorage` operations; memoize derived data
- Add error boundaries; structured logging for API failures
- E2E tests for add/log/read flows

## Platform & Release
- iOS scaffolding mirror of Android config
- CI workflow (lint, tests) and preview builds
- App icons, splash screen, and store metadata prep

## Developer Notes
- Provider config is in `src/services/NutritionAPI.js` (`CONFIG.provider`)
- Local DB remains as last-resort fallback for offline reliability
- Storage keys documented in `docs/FEATURES.md`
