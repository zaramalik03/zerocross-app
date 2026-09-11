import { Link } from "@tanstack/react-router";
import { HeartRating } from "@/components/zerocross/HeartRating";
import {
  allergenLabel,
  cuisineFlag,
  dietLabel,
  placeScore,
  RANK_BADGE,
  RANK_LABEL,
  scoreTone,
  type DbAllergen,
  type DbDiet,
  type Place,
} from "@/lib/places-data";

function Flag({ on, label }: { on: boolean; label: string }) {
  if (!on) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-tier-1-ink">
      ✓ {label}
    </span>
  );
}

export function PlaceResultCard({
  place,
  avoid,
  allergens,
  diets = [],
}: {
  place: Place;
  avoid: number[];
  allergens: DbAllergen[];
  diets?: DbDiet[];
}) {
  const score = placeScore(place, avoid);
  const tone = scoreTone(score);
  const rank = place.ranking ?? 3;

  const dietTags = place.diets
    .map((d) => ({
      diet: diets.find((x) => x.id === d.diet_id),
      availability: d.availability,
    }))
    .filter((d) => d.diet);

  const badges = allergens
    .filter((a) => avoid.includes(a.id) && place.allergens[a.id])
    .map((a) => ({ a, status: place.allergens[a.id]! }));

  return (
    <Link
      to="/places/$id"
      params={{ id: String(place.id) }}
      className="zc-rise group flex flex-col rounded-[12px] bg-panel p-6 ring-1 ring-hairline transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_oklch(0.141_0.005_285.8_/_35%)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
            {place.name}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-ink-faint">
            {place.category ?? "Place"} · {place.city}
            {place.state ? `, ${place.state}` : ""}
          </p>
          {place.street_address && (
            <p className="mt-1 text-xs text-ink-muted">
              📍 {place.street_address}
              {place.zipcode ? `, ${place.zipcode}` : ""}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {/* {place.cultural_cuisine && (
            <p className="mt-1 text-[40px] text-ink-muted">
              {cuisineFlag(place.cultural_cuisine)}
            </p>
          )} */}
          <HeartRating
            value={place.avg_rating ?? 0} // or whatever field holds the average
            readOnly
            size={22}
            label={place.name}
            showValue
          />
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${RANK_BADGE[rank]}`}
          >
            {RANK_LABEL[rank]}
          </span>
        </div>
      </div>
      <span className="mt-5 text-sm font-medium text-tier-1-ink group-hover:underline">
        View details →
      </span>
    </Link>
  );
}
