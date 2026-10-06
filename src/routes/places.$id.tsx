import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { FDA_ALLERGENS } from "@/lib/allergen-profile";
import { useState } from "react";
import { HeartRating } from "@/components/zerocross/HeartRating";
import {
  allergenLabel,
  cuisineFlag,
  dietLabel,
  fetchAllergens,
  fetchDiets,
  fetchPlaces,
  placeScore,
  PROFILE_TO_DB_ALLERGEN,
  RANK_BADGE,
  RANK_LABEL,
  scoreTone,
  type DbDiet,
} from "@/lib/places-data";

export const Route = createFileRoute("/places/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Place safety profile — ZeroCross" },
      {
        name: "description",
        content:
          "Cross-contact detail, allergen status and know-before-you-go notes for this kitchen, scored against your profile.",
      },
      { property: "og:title", content: "Place safety profile — ZeroCross" },
      {
        property: "og:description",
        content:
          "Dedicated facility status, staff training and allergen-by-allergen handling for this place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlaceDetail,
});

const STATUS_STYLE: Record<string, string> = {
  free_from: "bg-brand-soft text-tier-1-ink",
  can_accommodate: "bg-accom-soft text-accom-ink",
  may_contain: "bg-caution-soft text-caution-ink",
  contains: "bg-avoid-soft text-avoid",
};

const STATUS_LABEL: Record<string, string> = {
  free_from: "Free from",
  can_accommodate: "Can accommodate",
  may_contain: "May contain",
  contains: "Contains",
};

function PlaceDetail() {
  const { id } = Route.useParams();
  const { profile } = useProfile();
  const placesQuery = useQuery({ queryKey: ["places"], queryFn: fetchPlaces });
  const allergenQuery = useQuery({
    queryKey: ["allergens"],
    queryFn: fetchAllergens,
  });
  const dietQuery = useQuery({ queryKey: ["diets"], queryFn: fetchDiets });
  const [rating, setRating] = useState(0);

  const place = (placesQuery.data ?? []).find((p) => String(p.id) === id);
  const allergens = allergenQuery.data ?? [];

  const avoid = useMemo(() => {
    const ids = new Set<number>();
    for (const a of FDA_ALLERGENS) {
      if (profile.allergens[a.id]) {
        for (const dbId of PROFILE_TO_DB_ALLERGEN[a.id] ?? []) ids.add(dbId);
      }
    }
    return [...ids];
  }, [profile]);

  if (placesQuery.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface text-sm text-ink-muted">
        Loading place…
      </div>
    );
  }

  if (!place) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-6 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Place not found</h1>
          <Link to="/places" className="text-sm text-tier-1-ink underline">
            Back to all places
          </Link>
        </div>
      </div>
    );
  }

  const score = placeScore(place, avoid);
  const tone = scoreTone(score);
  const rank = place.ranking ?? 3;
  const placeDiets = place.diets
    .map((d) => ({
      diet: (dietQuery.data ?? []).find((x) => x.id === d.diet_id),
      availability: d.availability,
    }))
    .filter(
      (d): d is { diet: DbDiet; availability: string | null } => !!d.diet,
    );

  return (
    <div className="min-h-screen bg-surface text-ink antialiased">
      <header className="border-b border-hairline bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col space-y-4 justify-between gap-4 px-6 py-3">
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-brand-deep text-center"
          >
            ZeroCross
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/places" className="text-ink-muted hover:text-ink">
              ← All places
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-screen max-w-md pb-28">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              {place.name}
            </h1>
            <p className="mt-2 text-sm uppercase tracking-wide text-ink-faint">
              {place.category} · {place.city}
              {place.state ? `, ${place.state}` : ""}
            </p>
            {place.cultural_cuisine && (
              <p className="text-xl text-ink-muted">
                {cuisineFlag(place.cultural_cuisine)} {place.cultural_cuisine}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <HeartRating
              value={rating}
              onChange={(v) => {
                setRating(v);
                // TODO: persist v to your ratings table / server function
              }}
              size={36}
              label={place.name}
            />
            {/* <span
              className={`rounded-full px-2 py-1 text-[10px] font-semibold ${RANK_BADGE[rank]}`}
            >
              {RANK_LABEL[rank]}
            </span> */}
          </div>
        </div>

        {/* {place.description && (
          <p className="text-base leading-relaxed text-ink-muted">{place.description}</p>
        )} */}
        <div className="mt-4">
          {place.know_before_you_go && (
            <div className="rounded-r-[8px] border-l-4 border-honey bg-honey-soft px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-honey-ink">
                Know Before Going
              </p>
              <p className="mt-1 text-sm leading-relaxed text-honey-ink">
                {place.know_before_you_go}
              </p>
            </div>
          )}
        </div>

        {/* 
        {place.know_before_you_go && (
          <div className="rounded-r-[8px] border-l-4 border-honey bg-honey-soft px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-honey-ink">
              Know Before You Go
            </p>
            <p className="mt-1 text-sm leading-relaxed text-honey-ink">
              {place.know_before_you_go}
            </p>
          </div>
        )} */}

        <section>
          <h2 className="mt-4 text-sm font-semibold uppercase tracking-widest text-ink-faint">
            Safety flags
          </h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {[
              ["Dedicated facility", place.is_dedicated_facility],
              ["Certified", place.is_certified],
              ["Trained staff", !!place.trained_staff],
              ["Written allergen menu", !!place.written_allergen_menu],
              ["Catering", !!place.offers_catering],
              ["Delivery", !!place.offers_delivery],
            ].map(([label, on]) => (
              <span
                key={label as string}
                className={`rounded-full px-3 py-1 text-xs font-medium ${on ? "bg-brand-soft text-tier-1-ink" : "bg-surface-raised text-ink-faint"}`}
              >
                {on ? "✓" : "✗"} {label as string}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mt-4 text-sm font-semibold uppercase tracking-widest text-ink-faint">
            Allergen handling
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {allergens
              .filter((a) => place.allergens[a.id])
              .map((a) => (
                <span
                  key={a.id}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[place.allergens[a.id]!]}`}
                >
                  {STATUS_LABEL[place.allergens[a.id]!]} ·{" "}
                  {allergenLabel(a.name)}
                </span>
              ))}
            {allergens.filter((a) => place.allergens[a.id]).length === 0 && (
              <p className="text-sm text-ink-muted">
                No allergen declarations on file — call ahead before ordering.
              </p>
            )}
          </div>
        </section>

        {placeDiets.length > 0 && (
          <section>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-widest text-ink-faint">
              Diets
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {placeDiets.map(({ diet, availability }) => (
                <span
                  key={diet.id}
                  className="rounded-full bg-accom-soft px-3 py-1 text-xs font-medium text-accom-ink"
                >
                  {dietLabel(diet.name)}
                  {availability ? ` · ${availability.replace(/_/g, " ")}` : ""}
                </span>
              ))}
            </div>
          </section>
        )}
        <section className="mt-4 rounded-[12px] bg-panel p-6 text-sm ring-1 ring-hairline">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-faint">
            Visit
          </h2>
          <p className="mt-3 text-ink">
            {[place.street_address, place.city, place.state, place.zipcode]
              .filter(Boolean)
              .join(", ")}
          </p>
          {place.phone && <p className="mt-1 text-ink-muted">{place.phone}</p>}
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-medium text-tier-1-ink underline"
            >
              Visit website →
            </a>
          )}
        </section>
      </main>
      <nav className="fixed inset-x-0 sticky bottom-0 z-30 border-b border-hairline bg-surface/85 backdrop-blur-md">
        <div className="flex max-w-2xl items-center justify-between gap-2 px-3 pt-2 py-3 mx-auto">
          <Link to="/places" className="font-medium text-tier-1-ink">
            Places
          </Link>
          <Link to="/addplace" className="text-ink-muted hover:text-ink">
            Add Place
          </Link>
          <Link to="/menuanalyzer" className="text-ink-muted hover:text-ink">
            Menu Analyzer
          </Link>
          <Link to="/dashboard" className="text-ink-muted hover:text-ink">
            Dashboard
          </Link>
          <Link to="/onboarding" className="text-ink-muted hover:text-ink">
            Edit profile
          </Link>
        </div>
      </nav>
    </div>
  );
}
