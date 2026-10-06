// src/lib/userprofile.ts
export type UserProfile = {
  allergens: string[]
  diets: string[]
  completedOnboarding: boolean
}

const DEFAULT: UserProfile = {
  allergens: [],
  diets: [],
  completedOnboarding: false,
}

const RESTRICTION_TAG_MAP: Record<string, string[]> = {
  gluten: ['gluten-free'],
  peanut: ['nut-free', 'top-9-allergen-free', 'top-14-allergen-free'],
  'tree-nut': ['nut-free', 'top-9-allergen-free', 'top-14-allergen-free'],
  dairy: ['dairy-free'],
  egg: ['egg-free'],
  soy: ['soy-free'],
  fish: ['top-9-allergen-free', 'top-14-allergen-free'],
  shellfish: ['top-9-allergen-free', 'top-14-allergen-free'],
  sesame: ['top-9-allergen-free', 'top-14-allergen-free'],
  'gluten-free': ['gluten-free'],
  vegan: ['vegan'],
  keto: ['keto'],
  paleo: ['paleo'],
  'low-fodmap': ['low-fodmap'],
  vegetarian: ['vegetarian'],
  'low-carb': ['low-carb'],
  'high-protein': ['high-protein'],
  mediterranean: ['mediterranean'],
  halal: ['halal'],
  kosher: ['kosher'],
  pescatarian: ['pescatarian'],
  'nut-free': ['nut-free', 'top-9-allergen-free', 'top-14-allergen-free'],
}

export const getProfile = (): UserProfile => {
  if (typeof window === 'undefined') return DEFAULT
  const raw = localStorage.getItem('zc-profile')
  return raw ? JSON.parse(raw) : DEFAULT
}

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem('zc-profile', JSON.stringify(profile))
}

export const clearProfile = (): void => {
  localStorage.removeItem('zc-profile')
}

export const getRequiredDietaryTags = (restrictions: string[]): string[] => {
  const tags = new Set<string>()

  restrictions.forEach((restriction) => {
    const mapped = RESTRICTION_TAG_MAP[restriction]
    if (mapped) {
      mapped.forEach((tag) => tags.add(tag))
    }
  })

  return Array.from(tags)
}

export const matchesDietaryRestrictions = (dietaryTags: string[], restrictions: string[]): boolean => {
  const requiredTags = getRequiredDietaryTags(restrictions)
  if (requiredTags.length === 0) return true
  return requiredTags.every((tag) => dietaryTags.includes(tag))
}