# Macro Tracker – Implemented Features

## Navigation & Structure
- Bottom tab navigation: `Home`, `Camera`, `History`, `Profile`
- Modern, consistent theming and responsive layouts

## Home Screen
- Daily macro progress (calories, carbs, protein, fat) with progress bars
- Weekly calories chart powered by stored entries
- Water intake tracker (daily goal, progress bar, increment action)
- Auto-refresh of today’s totals and water intake

## Camera Screen (Simulated Capture)
- Take Photo / Scan Barcode actions simulate recognition
- Nutrition fetched from API (Open Food Facts by default) with graceful fallback to local DB
- Search modal with live local results and API enrichment on selection
- Serving size input with dynamic macro recalculation
- Adds food to:
  - Today’s macro totals in `AsyncStorage` (`macros_<date>`) 
  - `food_history` (detailed entry list)

## History Screen
- Search, date filters (7-day quick pick), and sorting (newest/oldest/calories/name)
- Daily summaries with totals and macro breakdown
- Per-entry macros, timestamps, and delete action
- Empty-state messaging

## Profile Screen
- User profile (name, age, height, weight, activity level, goal)
- Health metrics:
  - BMR (Mifflin–St Jeor), TDEE, BMI with category color
  - Ideal weight range, daily water recommendation
- Macro goals editor (calories, carbs, protein, fat) with “Calculate” helper
- Data persisted to `AsyncStorage`

## Services & Data
- `FoodDatabase` with ~25+ common foods and helpers (search, serving scaling)
- `NutritionAPI` providers:
  - Default: Open Food Facts (free, no key). Maps per-serving or per-100g → serving
  - Optional: Edamam / Nutritionix via env vars (documented in README)
  - Fallback to local DB when API is unavailable or no match

## Android (scaffolded)
- Android project structure included and configured (debug signing, manifests, gradle)
- Note: Physical camera is not yet wired; capture is simulated in UI

## Storage Keys
- Today’s macros: `macros_<new Date().toDateString()>`
- Food history list: `food_history`
- Profile: `user_profile`
- Goals: `user_goals`
- Water intake (daily): `water_<new Date().toDateString()>`
