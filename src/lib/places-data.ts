import { supabase } from "@/integrations/supabase/client";
import { FDA_ALLERGENS } from "@/lib/allergen-profile";

export type AllergenStatus =
  "free_from" | "can_accommodate" | "may_contain" | "contains";

export type DbAllergen = { id: number; name: string; category: string | null };

export type PlaceRow = {
  id: number;
  name: string;
  category: string | null;
  cultural_cuisine: string | null;
  description: string | null;
  website: string | null;
  phone: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  verified: boolean | null;
  ranking: number | null;
  is_dedicated_facility: boolean;
  is_certified: boolean;
  trained_staff: boolean | null;
  written_allergen_menu: boolean | null;
  know_before_you_go: string | null;
  offers_catering: boolean | null;
  offers_delivery: boolean | null;
};

export type DbDiet = { id: number; name: string; tag: string | null };

export type Place = PlaceRow & {
  allergens: Record<number, AllergenStatus>;
  /** Diet ids (diets table) this place supports, with availability note. */
  diets: { diet_id: number; availability: string | null }[];
};

/** Pretty label for a raw diet row name (e.g. "low_fodmap" -> "Low Fodmap"). */
export function dietLabel(name: string): string {
  return allergenLabel(name);
}

/** Pretty label for a raw allergen row name (e.g. "tree_nut" -> "Tree Nut"). */
export function allergenLabel(name: string): string {
  return name
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Maps the profile allergen ids used by onboarding to the allergens table ids. */
export const PROFILE_TO_DB_ALLERGEN: Record<string, number[]> =
  Object.fromEntries(FDA_ALLERGENS.map((a) => [a.id, a.dbIds]));

const CUISINE_FLAGS: { match: string; flag: string }[] = [
  { match: "japan", flag: "🇯🇵" },
  { match: "thai", flag: "🇹🇭" },
  { match: "chinese", flag: "🇨🇳" },
  { match: "korean", flag: "🇰🇷" },
  { match: "vietnam", flag: "🇻🇳" },
  { match: "filipino", flag: "🇵🇭" },
  { match: "italian", flag: "🇮🇹" },
  { match: "french", flag: "🇫🇷" },
  { match: "spanish", flag: "🇪🇸" },
  { match: "greek", flag: "🇬🇷" },
  { match: "danish", flag: "🇩🇰" },
  { match: "scandinavian", flag: "🇸🇪" },
  { match: "moroccan", flag: "🇲🇦" },
  { match: "lebanese", flag: "🇱🇧" },
  { match: "persian", flag: "🇮🇷" },
  { match: "turkish", flag: "🇹🇷" },
  { match: "middle eastern", flag: "🧆" },
  { match: "north african", flag: "🇲🇦" },
  { match: "mexico", flag: "🇲🇽" },
  { match: "ethiopia", flag: "🇪🇹" },
  { match: "nigeria", flag: "🇳🇬" },
  { match: "senegal", flag: "🇸🇳" },
  { match: "ghana", flag: "🇬🇭" },
  { match: "brazil", flag: "🇧🇷" },
  { match: "peruvian", flag: "🇵🇪" },
  { match: "argentin", flag: "🇦🇷" },
  { match: "venezuel", flag: "🇻🇪" },
  { match: "colombian", flag: "🇨🇴" },
  { match: "cuban", flag: "🇨🇺" },
  { match: "jamaican", flag: "🇯🇲" },
  { match: "haitian", flag: "🇭🇹" },
  { match: "puerto ric", flag: "🇵🇷" },
  { match: "caribbean", flag: "🌴" },
  { match: "hawaiian", flag: "🌺" },
  { match: "pakistan", flag: "🇵🇰" },
  { match: "sri lank", flag: "🇱🇰" },
  { match: "india", flag: "🇮🇳" },
  { match: "south asian", flag: "🇮🇳" },
  { match: "east african", flag: "🇪🇹" },
  { match: "west african", flag: "🌍" },
  { match: "african", flag: "🌍" },
  { match: "southeast asian", flag: "🍜" },
  { match: "east asian", flag: "🥢" },
  { match: "european", flag: "🇪🇺" },
  { match: "south american", flag: "🌎" },
  { match: "central american", flag: "🌎" },
  { match: "american", flag: "🇺🇸" },
];

export function cuisineFlag(cuisine: string | null): string {
  if (!cuisine) return "🍽️";
  const lower = canonicalCuisine(cuisine).toLowerCase();
  return CUISINE_FLAGS.find((c) => lower.includes(c.match))?.flag ?? "🍽️";
}

/**
 * Collapses the raw cuisine strings used by places and products into one shared
 * vocabulary, so the filters on /places and /products offer the same options.
 * "American, Southern" and "American" merge; so do "Mexican / Central American"
 * and "Mexican".
 */
const CUISINE_MERGES: Record<string, string> = {
  "american, southern": "American",
  "southern american": "American",
  "mexican / central american": "Mexican",
  "mexican and central american": "Mexican",
  "central american": "Mexican",
};

export function canonicalCuisine(cuisine: string | null): string {
  if (!cuisine) return "";
  const trimmed = cuisine.trim();
  const merged = CUISINE_MERGES[trimmed.toLowerCase()];
  if (merged) return merged;
  // Take the most specific leading segment of compound labels such as
  // "Japanese / East Asian" or "Ethiopian / East African".
  const head = trimmed.split(/\s*[/,]\s*/)[0]?.trim() ?? trimmed;
  return CUISINE_MERGES[head.toLowerCase()] ?? head;
}

/** Distinct canonical cuisines from any mix of place and product rows. */
export function cuisineOptions(
  rows: { cultural_cuisine: string | null }[],
): string[] {
  return [
    ...new Set(
      rows.map((r) => canonicalCuisine(r.cultural_cuisine)).filter(Boolean),
    ),
  ].sort();
}

export const RANK_LABEL: Record<number, string> = {
  1: "Dedicated Facility",
  2: "Has Mostly Allergen-friendly Options",
  3: "Has Limited Options",
};

export const RANK_BADGE: Record<number, string> = {
  1: "bg-tier-1 text-on-brand",
  2: "bg-tier-2 text-inverse-surface",
  3: "bg-tier-3 text-tier-3-ink",
};

export type ScoreResult = {
  score: number;
  verdict: string;
  canAccommodate: boolean;
  reasons: string[];
  warnings: string[];
};

/**
 * Compatibility score, 0–99. Unknown allergen data is never penalised — only
 * confirmed conflicts are. Places that can accommodate an allergen earn credit,
 * and venue-quality signals (dedicated facility, certification, training,
 * written menu) add on top.
 */
export function scorePlace(
  place: Place,
  avoid: number[],
  labelFor: (id: number) => string = (id) => `allergen ${id}`,
): ScoreResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  const contains = avoid.filter((id) => place.allergens[id] === "contains");
  const freeFrom = avoid.filter((id) => place.allergens[id] === "free_from");
  const accommodates = avoid.filter(
    (id) => place.allergens[id] === "can_accommodate",
  );
  const mayContain = avoid.filter(
    (id) => place.allergens[id] === "may_contain",
  );

  let score: number;
  if (avoid.length === 0) {
    score = 95;
  } else {
    // Weighted balance across the allergens you avoid: credit for confirmed
    // safety, deduction — never an automatic zero — for conflicts.
    const weighted =
      freeFrom.length * 1 +
      accommodates.length * 0.75 +
      mayContain.length * -0.7 +
      contains.length * -1.5;
    const ratio = weighted / avoid.length;
    score = 72 + Math.round(ratio * 27);
  }

  if (freeFrom.length > 0)
    reasons.push(`Confirmed free from ${freeFrom.map(labelFor).join(", ")}`);
  if (accommodates.length > 0)
    reasons.push(`Can accommodate ${accommodates.map(labelFor).join(", ")}`);

  // Cross-contact risk devalues the venue-quality signals below.
  const risk = mayContain.length > 0 || contains.length > 0;

  if (place.is_dedicated_facility) {
    score += risk ? 3 : 10;
    reasons.push(
      risk
        ? "Dedicated facility — but cross-contact risk reported for your allergens"
        : "Dedicated allergen-free facility",
    );
  }
  if (place.is_certified) {
    score += risk ? 4 : 8;
    reasons.push("Third-party certified (GFCO or equivalent)");
  }
  if (place.trained_staff) {
    score += risk ? 3 : 5;
    reasons.push("Staff have completed allergen awareness training");
  }
  if (place.written_allergen_menu) {
    score += risk ? 3 : 5;
    reasons.push("Written allergen menu available on request");
  }

  for (const id of mayContain) {
    warnings.push(
      `May contain ${labelFor(id)} — confirm with staff before ordering`,
    );
  }
  for (const id of contains) {
    warnings.push(
      `Contains ${labelFor(id)} — ask about a dedicated preparation`,
    );
  }

  if (contains.length > 0) score = Math.min(score, 40);
  score = Math.min(99, Math.max(5, score));

  const verdict =
    contains.length > 0
      ? "Contains an allergen you avoid"
      : score >= 88
        ? "Highly compatible"
        : score >= 75
          ? "Very safe for your needs"
          : score >= 60
            ? "Generally safe"
            : score >= 45
              ? "Proceed with caution"
              : "Not recommended";

  return {
    score,
    verdict,
    canAccommodate: contains.length === 0,
    reasons,
    warnings,
  };
}

export function placeScore(place: Place, avoid: number[]): number {
  return scorePlace(place, avoid).score;
}

export function scoreTone(score: number) {
  if (score >= 80)
    return { text: "text-tier-1", chip: "bg-brand-soft text-tier-1-ink" };
  if (score >= 50)
    return { text: "text-honey-ink", chip: "bg-honey-soft text-honey-ink" };
  return { text: "text-avoid", chip: "bg-avoid-soft text-avoid" };
}

export async function fetchAllergens(): Promise<DbAllergen[]> {
  const { data, error } = await supabase
    .from("allergens")
    .select("id, name, category")
    .order("id");
  if (error) throw error;
  return (data ?? []) as DbAllergen[];
}

export async function fetchDiets(): Promise<DbDiet[]> {
  const { data, error } = await supabase
    .from("diets")
    .select("id, name, tag")
    .order("id");
  if (error) throw error;
  return (data ?? []) as DbDiet[];
}

export async function fetchPlaces(): Promise<Place[]> {
  const [placesRes, linkRes, dietRes] = await Promise.all([
    supabase
      .from("places")
      .select(
        "id, name, category, cultural_cuisine, description, website, phone, street_address, city, state, zipcode, verified, ranking, is_dedicated_facility, is_certified, trained_staff, written_allergen_menu, know_before_you_go, offers_catering, offers_delivery",
      )
      .eq("active", true)
      .order("ranking"),
    supabase.from("places_allergens").select("place_id, allergen_id, status"),
    supabase.from("places_diets").select("place_id, diet_id, availability"),
  ]);
  if (placesRes.error) throw placesRes.error;
  if (linkRes.error) throw linkRes.error;
  if (dietRes.error) throw dietRes.error;

  const byPlace = new Map<number, Record<number, AllergenStatus>>();
  for (const row of (linkRes.data ?? []) as {
    place_id: number;
    allergen_id: number;
    status: string;
  }[]) {
    const bucket = byPlace.get(row.place_id) ?? {};
    bucket[row.allergen_id] = row.status as AllergenStatus;
    byPlace.set(row.place_id, bucket);
  }

  const dietsByPlace = new Map<
    number,
    { diet_id: number; availability: string | null }[]
  >();
  for (const row of (dietRes.data ?? []) as {
    place_id: number;
    diet_id: number;
    availability: string | null;
  }[]) {
    const bucket = dietsByPlace.get(row.place_id) ?? [];
    bucket.push({ diet_id: row.diet_id, availability: row.availability });
    dietsByPlace.set(row.place_id, bucket);
  }

  return ((placesRes.data ?? []) as PlaceRow[]).map((p) => ({
    ...p,
    allergens: byPlace.get(p.id) ?? {},
    diets: dietsByPlace.get(p.id) ?? [],
  }));
}

/** Shared cuisine vocabulary across places and products. */
export async function fetchCuisines(): Promise<string[]> {
  const [placeRes, productRes] = await Promise.all([
    supabase.from("places").select("cultural_cuisine").eq("active", true),
    supabase.from("products").select("cultural_cuisine").eq("active", true),
  ]);
  if (placeRes.error) throw placeRes.error;
  if (productRes.error) throw productRes.error;
  return cuisineOptions([...(placeRes.data ?? []), ...(productRes.data ?? [])]);
}
