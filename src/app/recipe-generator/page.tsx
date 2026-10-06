"use client"

import { useMemo, useState } from 'react'
import { getProfile } from '@/lib/userprofile'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert']

const CULTURES = [
  { id: 'south_asian', label: 'Indian', flag: '🍛' },
  { id: 'japanese', label: 'Japanese', flag: '🍱' },
  { id: 'mexican', label: 'Mexican', flag: '🌮' },
  { id: 'southeast_asian', label: 'Thai', flag: '🍜' },
  { id: 'ethiopian', label: 'Ethiopian', flag: '🌍' },
  { id: 'middle_eastern', label: 'Middle Eastern', flag: '🌿' },
]

const ALLERGEN_OPTIONS = [
  { id: 'gluten', emoji: '🌾', label: 'Gluten' },
  { id: 'peanut', emoji: '🥜', label: 'Peanuts' },
  { id: 'tree-nut', emoji: '🌰', label: 'Tree nuts' },
  { id: 'dairy', emoji: '🥛', label: 'Dairy' },
  { id: 'egg', emoji: '🥚', label: 'Eggs' },
  { id: 'soy', emoji: '🫘', label: 'Soy' },
  { id: 'fish', emoji: '🐟', label: 'Fish' },
  { id: 'shellfish', emoji: '🦐', label: 'Shellfish' },
  { id: 'sesame', emoji: '⚪', label: 'Sesame' },
]

type RecipeIngredient = {
  name: string
  quantity: string
  notes: string | null
  optional: boolean
}

type Recipe = {
  id: number
  name: string
  description: string
  cultural_cuisine: string
  meal_type: string
  difficulty: string
  prep_time_mins: number
  cook_time_mins: number
  servings: number
  instructions: string
  tips: string | null
  emoji_icon: string | null
  ingredients: RecipeIngredient[]
}

export default function RecipeCustomizerPage() {
  const [avoid, setAvoid] = useState<string[]>(() => getProfile().allergens)
  const [meal, setMeal] = useState<string | null>(null)
  const [culture, setCulture] = useState<string | null>(null)
  const [servings, setServings] = useState(2)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null)

  const selectedRecipe = useMemo(() => {
    return recipes.find((recipe) => recipe.id === selectedRecipeId) ?? null
  }, [recipes, selectedRecipeId])

  const toggleAllergen = (id: string) => {
    setAvoid((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const findRecipes = async () => {
    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const params = new URLSearchParams()
      if (avoid.length) params.set('avoid', avoid.join(','))
      if (meal) params.set('meal', meal)
      if (culture) params.set('culture', culture)
      params.set('servings', String(servings))

      const res = await fetch(`/api/recipe-generator?${params.toString()}`)
      if (!res.ok) throw new Error('Failed')

      const json = await res.json()
      const nextRecipes = json.data ?? []

      setRecipes(nextRecipes)
      setSelectedRecipeId(nextRecipes.length ? nextRecipes[0].id : null)
    } catch {
      setError('Could not load recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell min-h-screen">
      <div className="page-header">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
          <p className="section-label">Recipe customizer</p>
          <h1 className="section-title mt-3">The safe swap engine.</h1>
          <p className="section-body mt-3 max-w-3xl">
            Proven recipes from published cookbooks — not generated text. Pick your restrictions and
            only verified recipes for your profile will appear.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10 lg:py-12">
        <section className="surface-card p-6 lg:p-7">
          <div className="mb-6">
            <h2 className="text-base font-semibold" style={{ color: '#1A3D2B' }}>
              1. What do you need to avoid?
            </h2>
            <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
              Select all that apply. Leaving this empty shows every recipe.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((allergen) => {
                const active = avoid.includes(allergen.id)
                return (
                  <button
                    key={allergen.id}
                    onClick={() => toggleAllergen(allergen.id)}
                    className="rounded-full border px-4 py-2 text-sm font-semibold transition-all"
                    style={
                      active
                        ? { backgroundColor: '#151b3a', color: '#faf7f0', borderColor: '#151b3a' }
                        : { backgroundColor: '#ffffff', color: '#4a5568', borderColor: '#d1d5db' }
                    }
                  >
                    {allergen.emoji} {allergen.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold" style={{ color: '#1A3D2B' }}>
                2. Cuisine (optional)
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setCulture(null)}
                  className="rounded-full border px-4 py-2 text-sm font-semibold transition-all"
                  style={
                    !culture
                      ? { backgroundColor: '#151b3a', color: '#faf7f0', borderColor: '#151b3a' }
                      : { backgroundColor: '#ffffff', color: '#4a5568', borderColor: '#d1d5db' }
                  }
                >
                  Any cuisine
                </button>

                {CULTURES.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setCulture(option.id)}
                    className="rounded-full border px-4 py-2 text-sm font-semibold transition-all"
                    style={
                      culture === option.id
                        ? { backgroundColor: '#151b3a', color: '#faf7f0', borderColor: '#151b3a' }
                        : { backgroundColor: '#ffffff', color: '#4a5568', borderColor: '#d1d5db' }
                    }
                  >
                    {option.flag} {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold" style={{ color: '#1A3D2B' }}>
                3. Meal type (optional)
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setMeal(null)}
                  className="rounded-full border px-4 py-2 text-sm font-semibold transition-all"
                  style={
                    !meal
                      ? { backgroundColor: '#151b3a', color: '#faf7f0', borderColor: '#151b3a' }
                      : { backgroundColor: '#ffffff', color: '#4a5568', borderColor: '#d1d5db' }
                  }
                >
                  Any meal
                </button>

                {MEAL_TYPES.map((option) => (
                  <button
                    key={option}
                    onClick={() => setMeal(option)}
                    className="rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-all"
                    style={
                      meal === option
                        ? { backgroundColor: '#151b3a', color: '#faf7f0', borderColor: '#151b3a' }
                        : { backgroundColor: '#ffffff', color: '#4a5568', borderColor: '#d1d5db' }
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold" style={{ color: '#1A3D2B' }}>
                4. Servings
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setServings((current) => Math.max(1, current - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border text-lg font-semibold"
                  style={{ backgroundColor: '#ffffff', color: '#151b3a', borderColor: '#d1d5db' }}
                >
                  −
                </button>
                <span className="min-w-24 text-center text-lg font-semibold" style={{ color: '#151b3a' }}>
                  {servings} {servings === 1 ? 'serving' : 'servings'}
                </span>
                <button
                  onClick={() => setServings((current) => Math.min(12, current + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border text-lg font-semibold"
                  style={{ backgroundColor: '#ffffff', color: '#151b3a', borderColor: '#d1d5db' }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={findRecipes}
              disabled={loading}
              className="w-full rounded-full px-5 py-3 text-sm font-semibold transition-all lg:w-auto"
              style={
                loading
                  ? { backgroundColor: '#9ca3af', color: '#ffffff', cursor: 'not-allowed' }
                  : { backgroundColor: '#151b3a', color: '#faf7f0', cursor: 'pointer' }
              }
            >
              {loading ? 'Finding safe recipes...' : 'Find my safe recipes →'}
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium" style={{ color: '#991b1b' }}>
            {error}
          </div>
        )}

        {searched && !loading && recipes.length === 0 && !error && (
          <div className="mt-6 rounded-3xl border border-dashed p-10 text-center" style={{ borderColor: '#d1d5db' }}>
            <div className="mb-4 text-5xl">🔍</div>
            <p className="text-lg font-semibold" style={{ color: '#151b3a' }}>
              No recipes found for this combination
            </p>
            <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>
              Try removing some allergen restrictions or selecting a different cuisine.
            </p>
          </div>
        )}

        {recipes.length > 0 && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-3">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className="w-full rounded-2xl border p-4 text-left transition-all"
                  style={
                    selectedRecipeId === recipe.id
                      ? { borderColor: '#151b3a', backgroundColor: '#eef2ff' }
                      : { borderColor: '#d1d5db', backgroundColor: '#ffffff' }
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{recipe.emoji_icon ?? '🍽️'}</span>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: '#151b3a' }}>
                        {recipe.name}
                      </h3>
                      <p className="mt-1 text-xs" style={{ color: '#6b7280' }}>
                        {recipe.cultural_cuisine} · {recipe.meal_type}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </aside>

            {selectedRecipe && <RecipeDetail recipe={selectedRecipe} />}
          </div>
        )}
      </div>
    </div>
  )
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  return (
    <section className="surface-card p-6 lg:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#226580' }}>
        Verified recipe
      </p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight" style={{ color: '#151b3a' }}>
            {recipe.name}
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>
            {recipe.cultural_cuisine} · {recipe.meal_type} · {recipe.servings} servings
          </p>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
          ✓ Verified Safe
        </span>
      </div>

      <p className="mt-4 text-sm leading-6" style={{ color: '#4a5568' }}>
        {recipe.description}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['⏱', 'Prep', `${recipe.prep_time_mins ?? '?'} min`],
          ['🔥', 'Cook', `${recipe.cook_time_mins ?? '?'} min`],
          ['🍽️', 'Servings', String(recipe.servings)],
          ['📊', 'Difficulty', recipe.difficulty],
        ].map(([icon, label, value]) => (
          <div key={label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: '#f9fafb' }}>
            <div className="text-sm">{icon}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wide" style={{ color: '#9ca3af' }}>
              {label}
            </div>
            <div className="mt-1 text-sm font-semibold" style={{ color: '#151b3a' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#226580' }}>
          Ingredients
        </h3>
        <ul className="mt-3 space-y-2 text-sm">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={`${ingredient.name}-${index}`} className="flex items-start gap-3 rounded-xl px-2 py-2" style={{ backgroundColor: '#f9fafb' }}>
              <span className="mt-2 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#e8a020', flexShrink: 0 }} />
              <span style={{ color: '#374151' }}>
                <strong style={{ color: '#151b3a' }}>{ingredient.quantity}</strong>{' '}
                {ingredient.name}
                {ingredient.notes && <span style={{ color: '#9ca3af' }}> — {ingredient.notes}</span>}
                {ingredient.optional && <span style={{ color: '#9ca3af' }}> (optional)</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#226580' }}>
          Method
        </h3>
        <ol className="mt-3 space-y-3 text-sm">
          {recipe.instructions.split('\n').filter((line) => line.trim()).map((step, index) => (
            <li key={`${step}-${index}`} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: '#e2efef', color: '#151b3a' }}>
                {index + 1}
              </span>
              <span style={{ color: '#374151' }}>{step.replace(/^\d+\.\s*/, '')}</span>
            </li>
          ))}
        </ol>
      </div>

      {recipe.tips && (
        <div className="mt-8 rounded-2xl border-l-4 p-4" style={{ backgroundColor: '#fef3c7', borderColor: '#e8a020' }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#92400e' }}>
            Chef&apos;s tip
          </p>
          <p className="mt-2 text-sm" style={{ color: '#78350f' }}>
            {recipe.tips}
          </p>
        </div>
      )}
    </section>
  )
}

