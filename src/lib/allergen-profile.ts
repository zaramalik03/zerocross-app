import { supabase } from "@/integrations/supabase/client";

/** Severity ladder shown under every selected allergen. */
export const SEVERITIES = [
  { id: "mild", label: "Mild sensitivity", note: "Discomfort only" },
  { id: "moderate", label: "Moderate intolerance", note: "Illness for hours" },
  { id: "severe", label: "Severe allergy", note: "Medical attention likely" },
  {
    id: "anaphylactic",
    label: "Anaphylactic risk",
    note: "Life-threatening — epinephrine required",
  },
] as const;

export type SeverityId = (typeof SEVERITIES)[number]["id"];

/** Every allergen in the allergens table, grouped by regulatory scope. */
export type ProfileAllergen = {
  /** Primary allergens table id. */
  dbId: number;
  /** All allergens table ids this profile entry covers. */
  dbIds: number[];
  id: string;
  label: string;
  description: string;
  group: "FDA major" | "EU regulated" | "Extended sensitivities";
};

export const FDA_ALLERGENS: ProfileAllergen[] = [
  {
    dbId: 3,
    dbIds: [3],
    id: "peanut",
    label: "Peanut",
    description: "Legume; oils, flours, sauces and satay bases.",
    group: "FDA major",
  },
  {
    dbId: 4,
    dbIds: [4],
    id: "tree-nut",
    label: "Tree Nut",
    description: "Almond, cashew, walnut, pistachio, pecan and more.",
    group: "FDA major",
  },
  {
    dbId: 5,
    dbIds: [5],
    id: "milk",
    label: "Milk / Dairy",
    description: "Casein, whey, butter, ghee and cultured products.",
    group: "FDA major",
  },
  {
    dbId: 6,
    dbIds: [6],
    id: "egg",
    label: "Egg",
    description: "Whites, yolks, albumin, mayonnaise and glazes.",
    group: "FDA major",
  },
  {
    dbId: 2,
    dbIds: [2, 1],
    id: "wheat",
    label: "Wheat / Gluten",
    description: "Flour, semolina, seitan, soy sauce and roux.",
    group: "FDA major",
  },
  {
    dbId: 7,
    dbIds: [7],
    id: "soy",
    label: "Soy",
    description: "Tofu, edamame, soy lecithin and most Asian sauces.",
    group: "FDA major",
  },
  {
    dbId: 8,
    dbIds: [8],
    id: "fish",
    label: "Fish",
    description: "Finned fish, fish sauce, Worcestershire and dashi.",
    group: "FDA major",
  },
  {
    dbId: 9,
    dbIds: [9],
    id: "shellfish",
    label: "Crustacean Shellfish",
    description: "Shrimp, crab, lobster, crawfish and shellfish stock.",
    group: "FDA major",
  },
  {
    dbId: 10,
    dbIds: [10],
    id: "sesame",
    label: "Sesame",
    description: "Tahini, seeds, halva and many bread toppings.",
    group: "FDA major",
  },
  {
    dbId: 11,
    dbIds: [11],
    id: "mustard",
    label: "Mustard",
    description: "Seeds, powder, prepared mustard, dressings and marinades.",
    group: "EU regulated",
  },
  {
    dbId: 12,
    dbIds: [12],
    id: "celery",
    label: "Celery",
    description: "Stalk, celeriac, celery salt, stocks and spice blends.",
    group: "EU regulated",
  },
  {
    dbId: 13,
    dbIds: [13],
    id: "lupin",
    label: "Lupin",
    description: "Lupin flour in gluten-free breads, pasta and pastries.",
    group: "EU regulated",
  },
  {
    dbId: 14,
    dbIds: [14],
    id: "sulphites",
    label: "Sulphites",
    description: "Preservative in wine, dried fruit, vinegars and pickles.",
    group: "EU regulated",
  },
  {
    dbId: 15,
    dbIds: [15],
    id: "molluscs",
    label: "Molluscs",
    description: "Clams, mussels, oysters, squid, octopus and snails.",
    group: "EU regulated",
  },
  {
    dbId: 16,
    dbIds: [16],
    id: "corn",
    label: "Corn",
    description: "Masa, cornstarch, corn syrup, dextrose and thickeners.",
    group: "Extended sensitivities",
  },
  {
    dbId: 17,
    dbIds: [17],
    id: "latex",
    label: "Latex (fruit cross-reactive)",
    description: "Banana, avocado, kiwi and chestnut cross-reactions.",
    group: "Extended sensitivities",
  },
  {
    dbId: 18,
    dbIds: [18],
    id: "nightshade",
    label: "Nightshade",
    description: "Tomato, potato, eggplant, peppers and paprika.",
    group: "Extended sensitivities",
  },
  {
    dbId: 19,
    dbIds: [19],
    id: "histamine",
    label: "Histamine",
    description: "Aged cheese, cured meats, fermented foods and vinegar.",
    group: "Extended sensitivities",
  },
  {
    dbId: 20,
    dbIds: [20],
    id: "fructose",
    label: "Fructose",
    description: "High-fructose syrups, honey, apples and agave.",
    group: "Extended sensitivities",
  },
  {
    dbId: 21,
    dbIds: [21],
    id: "coconut",
    label: "Coconut",
    description: "Coconut milk, oil, flour and desiccated flakes.",
    group: "Extended sensitivities",
  },
];

export const ALLERGEN_GROUPS = [
  "FDA major",
  "EU regulated",
  "Extended sensitivities",
] as const;

export const ALLERGEN_BY_DB_ID = new Map(
  FDA_ALLERGENS.flatMap((a) => a.dbIds.map((dbId) => [dbId, a] as const)),
);

export const DIETS: { dbId: number; id: string; label: string }[] = [
  { dbId: 1, id: "vegan", label: "Vegan" },
  { dbId: 2, id: "vegetarian", label: "Vegetarian" },
  { dbId: 3, id: "pescatarian", label: "Pescatarian" },
  { dbId: 4, id: "halal", label: "Halal" },
  { dbId: 5, id: "kosher", label: "Kosher" },
  { dbId: 6, id: "paleo", label: "Paleo" },
  { dbId: 7, id: "keto", label: "Keto" },
  { dbId: 8, id: "low_fodmap", label: "Low FODMAP" },
  { dbId: 9, id: "whole30", label: "Whole30" },
  { dbId: 10, id: "low_sodium", label: "Low Sodium" },
  { dbId: 11, id: "high_protein", label: "High Protein" },
];

export const DIET_LEVELS = [
  { id: "flexible", label: "Flexible" },
  { id: "strict", label: "Strict / Mandatory" },
] as const;

export type DietLevel = (typeof DIET_LEVELS)[number]["id"];

export const CUISINE_GROUPS: { id: string; label: string; examples: string }[] =
  [
    {
      id: "east_asian",
      label: "East Asian",
      examples: "Chinese, Japanese, Korean",
    },
    {
      id: "south_asian",
      label: "South Asian",
      examples: "Indian, Pakistani, Sri Lankan",
    },
    {
      id: "southeast_asian",
      label: "Southeast Asian",
      examples: "Vietnamese, Thai, Filipino",
    },
    {
      id: "mexican_central",
      label: "Mexican & Central American",
      examples: "Oaxacan, Yucatán, Salvadoran",
    },
    {
      id: "south_american",
      label: "South American",
      examples: "Peruvian, Brazilian, Argentinian",
    },
    {
      id: "caribbean",
      label: "Caribbean",
      examples: "Jamaican, Haitian, Trinidadian",
    },
    {
      id: "mena",
      label: "Middle Eastern / North African",
      examples: "Levantine, Persian, Moroccan",
    },
    {
      id: "sub_saharan",
      label: "Sub-Saharan African",
      examples: "Ethiopian, Nigerian, Senegalese",
    },
    { id: "european", label: "European", examples: "Italian, French, Spanish" },
    {
      id: "american",
      label: "American-style options",
      examples: "Diners, grills, comfort food",
    },
  ];

export type AllergenProfile = {
  allergens: Record<string, SeverityId>;
  diets: Record<string, DietLevel>;
  cuisines: string[];
  completedAt?: string;
};

export const EMPTY_PROFILE: AllergenProfile = {
  allergens: {},
  diets: {},
  cuisines: [],
};

const STORAGE_KEY = "zerocross.profile";

export function readGuestProfile(): AllergenProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AllergenProfile;
    return { ...EMPTY_PROFILE, ...parsed };
  } catch {
    return null;
  }
}

export function writeGuestProfile(profile: AllergenProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearGuestProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/** Allergen ids used by the scoring engine, derived from the saved profile. */
// export function activeAllergenIds(profile: AllergenProfile): AllergenId[] {
//   return FDA_ALLERGENS.filter((a) => profile.allergens[a.id]).map(
//     (a) => a.id,
//   ) as AllergenId[];
// }

export async function fetchRemoteProfile(
  userId: string,
): Promise<AllergenProfile> {
  const [allergenRows, dietRows] = await Promise.all([
    supabase
      .from("user_allergens")
      .select("allergen_id, severity")
      .eq("user_id", userId),
    supabase
      .from("dietary_preferences")
      .select("diet_id, level")
      .eq("user_id", userId as never),
  ]);

  const profile: AllergenProfile = { allergens: {}, diets: {}, cuisines: [] };

  for (const row of allergenRows.data ?? []) {
    const allergen = ALLERGEN_BY_DB_ID.get(row.allergen_id);
    if (allergen)
      profile.allergens[allergen.id] = (row.severity as SeverityId) ?? "severe";
  }
  for (const row of (dietRows.data ?? []) as {
    diet_id: number;
    level: string | null;
  }[]) {
    const diet = DIETS.find((d) => d.dbId === row.diet_id);
    if (diet) profile.diets[diet.id] = (row.level as DietLevel) ?? "flexible";
  }

  return profile;
}

export async function saveRemoteProfile(
  userId: string,
  profile: AllergenProfile,
) {
  const allergenRows = FDA_ALLERGENS.filter(
    (a) => profile.allergens[a.id],
  ).flatMap((a) =>
    a.dbIds.map((dbId) => ({
      user_id: userId,
      allergen_id: dbId,
      severity: profile.allergens[a.id] ?? "severe",
    })),
  );

  const dietRows = DIETS.filter((d) => profile.diets[d.id]).map((d) => ({
    user_id: userId,
    diet_id: d.dbId,
    level: profile.diets[d.id] ?? "flexible",
  }));

  await supabase.from("user_allergens").delete().eq("user_id", userId);
  await supabase
    .from("dietary_preferences")
    .delete()
    .eq("user_id", userId as never);

  if (allergenRows.length) {
    const { error } = await supabase
      .from("user_allergens")
      .insert(allergenRows);
    if (error) throw error;
  }
  if (dietRows.length) {
    const { error } = await supabase
      .from("dietary_preferences")
      .insert(dietRows as never);
    if (error) throw error;
  }

  // Make sure a profile row exists before flagging onboarding complete.
  const { data: authData } = await supabase.auth.getUser();
  const authUser = authData.user;
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email: authUser?.email ?? "",
      display_name:
        (authUser?.user_metadata?.["display_name"] as string | undefined) ??
        authUser?.email ??
        "ZeroCross member",
      onboarding_complete: true,
    },
    { onConflict: "id" },
  );
  if (profileError) throw profileError;
}
