import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useMemo, useState } from "react";
import { PlaceResultCard } from "@/components/zerocross/PlaceResultCard";
import { useProfile } from "@/hooks/useProfile";
import { useUserLocation } from "@/hooks/useUserLocation";
import { DIETS, FDA_ALLERGENS } from "@/lib/allergen-profile";
import { geocodePlaces } from "@/lib/geocode.functions";
import {
  canonicalCuisine,
  cuisineFlag,
  fetchAllergens,
  fetchCuisines,
  fetchDiets,
  fetchPlaces,
  placeScore,
  PROFILE_TO_DB_ALLERGEN,
} from "@/lib/places-data";

const PlacesMap = lazy(() => import("@/components/zerocross/PlacesMap"));

export const Route = createFileRoute("/places/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Safe dining near you — ZeroCross Places" },
      {
        name: "description",
        content:
          "Every restaurant, bakery and cafe scored against your allergen profile, with dedicated-facility and cross-contact detail up front.",
      },
      {
        property: "og:title",
        content: "Safe dining near you — ZeroCross Places",
      },
      {
        property: "og:description",
        content:
          "Filter by cuisine, rank and the allergens you avoid. Compatibility scores are applied from your profile automatically.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlacesPage,
});

const DEFAULT_RADIUS = 50;
const RADIUS_OPTIONS = [30, 40, 50];

/** Great-circle distance in miles. */
function milesBetween(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(a));
}

const SELECT =
  "mt-2 w-full rounded-[8px] border border-hairline bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand";

function PlacesPage() {
  const { profile, loading: profileLoading } = useProfile();
  const {
    location: userLocation,
    status: locationStatus,
    error: locationError,
    enable: enableLocation,
    clear: clearLocation,
  } = useUserLocation();

  const placesQuery = useQuery({ queryKey: ["places"], queryFn: fetchPlaces });
  const allergenQuery = useQuery({
    queryKey: ["allergens"],
    queryFn: fetchAllergens,
  });
  const dietQuery = useQuery({ queryKey: ["diets"], queryFn: fetchDiets });

  const profileAvoid = useMemo(() => {
    const ids = new Set<number>();
    for (const a of FDA_ALLERGENS) {
      if (profile.allergens[a.id]) {
        for (const dbId of PROFILE_TO_DB_ALLERGEN[a.id] ?? []) ids.add(dbId);
      }
    }
    return [...ids].sort((a, b) => a - b);
  }, [profile]);

  const [category, setCategory] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState<string | null>(null);

  /** Strict diets hard-filter; flexible diets only sort matching places first. */
  const strictDiets = useMemo(
    () =>
      DIETS.filter((d) => profile.diets[d.id] === "strict").map((d) => d.dbId),
    [profile],
  );
  const flexDiets = useMemo(
    () => DIETS.filter((d) => profile.diets[d.id]).map((d) => d.dbId),
    [profile],
  );
  const [service, setService] = useState<"delivery" | "catering" | null>(null);
  const [nameQuery, setNameQuery] = useState("");
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS);

  const avoid = profileAvoid;
  const places = placesQuery.data ?? [];
  const allergens = allergenQuery.data ?? [];
  const diets = dietQuery.data ?? [];

  const categories = useMemo(
    () =>
      [...new Set(places.map((p) => p.category).filter(Boolean))] as string[],
    [places],
  );
  const cuisineList = useQuery({
    queryKey: ["cuisines"],
    queryFn: fetchCuisines,
  });
  const cuisines = cuisineList.data ?? [];

  /** Geocode every place once so distance filtering and the map share coordinates. */
  const geoTargets = useMemo(
    () =>
      places
        .map((p) => ({
          id: p.id,
          name: p.name,
          address: [p.street_address, p.city, p.state, p.zipcode]
            .filter(Boolean)
            .join(", "),
        }))
        .filter((p) => p.address.length > 3),
    [places],
  );

  const geoQuery = useQuery({
    queryKey: ["geocode", geoTargets.map((t) => t.id).join(",")],
    enabled: geoTargets.length > 0,
    staleTime: Infinity,
    queryFn: () =>
      geocodePlaces({ data: { ids: geoTargets.map((t) => t.id) } }),
  });

  const coords = useMemo(
    () => new Map((geoQuery.data ?? []).map((pt) => [pt.id, pt])),
    [geoQuery.data],
  );

  const results = useMemo(() => {
    const loc = (userLocation?.city ?? "").trim().toLowerCase();
    const nq = nameQuery.trim().toLowerCase();
    return places
      .filter((p) => (category ? p.category === category : true))
      .filter((p) =>
        cuisine ? canonicalCuisine(p.cultural_cuisine) === cuisine : true,
      )

      .filter((p) =>
        service === "delivery"
          ? !!p.offers_delivery
          : service === "catering"
            ? !!p.offers_catering
            : true,
      )
      .filter((p) => {
        if (userLocation?.lat != null && userLocation?.lng != null) {
          const pt = coords.get(p.id);
          // Keep places we haven't geocoded yet rather than hiding them outright.
          if (!pt) return coords.size === 0;
          return (
            milesBetween(userLocation.lat, userLocation.lng, pt.lat, pt.lng) <=
            radius
          );
        }
        return loc
          ? [p.city, p.state, p.street_address, p.zipcode]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(loc)
          : true;
      })
      .filter((p) => (nq ? p.name.toLowerCase().includes(nq) : true))
      .sort((a, b) => {
        const dietRank = (p: typeof a) =>
          strictDiets.filter((d) => p.diets.some((pd) => pd.diet_id === d))
            .length *
            2 +
          flexDiets.filter((d) => p.diets.some((pd) => pd.diet_id === d))
            .length;
        return (
          dietRank(b) - dietRank(a) ||
          placeScore(b, avoid) - placeScore(a, avoid)
        );
      });
  }, [
    places,
    category,
    cuisine,
    strictDiets,
    flexDiets,
    service,
    userLocation,
    radius,
    coords,
    nameQuery,
    avoid,
  ]);

  const markers = useMemo(
    () =>
      results.flatMap((p) => {
        const pt = coords.get(p.id);
        const target = geoTargets.find((t) => t.id === p.id);
        return pt && target
          ? [{ ...pt, name: p.name, address: target.address }]
          : [];
      }),
    [results, coords, geoTargets],
  );

  function clearAll() {
    setCategory(null);

    setCuisine(null);

    setService(null);
    setRadius(DEFAULT_RADIUS);
    setNameQuery("");
  }

  const loading =
    profileLoading || placesQuery.isLoading || allergenQuery.isLoading;

  return (
    <div className="min-h-screen bg-surface text-ink antialiased ">
      <header className="sticky top-0 z-50 border-b border-hairline bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col space-y-4 justify-between gap-4 px-6 py-3">
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-brand-deep text-center"
          >
            ZeroCross
          </Link>
        </div>
      </header>
      <main className="mx-auto min-h-screen max-w-md pb-28">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Discover Places
        </h1>
        <section className="mt-6 space-y-5 rounded-[12px] bg-panel p-6 ring-1 ring-hairline">
          <div className="relative z-10 gap-2 px-5 pt-2">
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                Where do you want to go out?
              </span>
              <select
                value={category ?? ""}
                onChange={(e) => setCategory(e.target.value || null)}
                className={SELECT}
              >
                <option value="">All places</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                Cultural cuisine
              </span>
              <select
                value={cuisine ?? ""}
                onChange={(e) => setCuisine(e.target.value || null)}
                className={SELECT}
              >
                <option value="">All cuisines</option>
                {cuisines.map((c) => (
                  <option key={c} value={c}>
                    {cuisineFlag(c)} {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                Service
              </span>
              <select
                value={service ?? ""}
                onChange={(e) =>
                  setService(
                    (e.target.value || null) as "delivery" | "catering" | null,
                  )
                }
                className={SELECT}
              >
                <option value="">Any service</option>
                <option value="delivery">🛵 Order online for delivery</option>
                <option value="catering">🍽️ Provides catering</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[180px]">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                Your location
              </span>
              <div className="mt-2 flex items-center gap-2">
                {userLocation ? (
                  <>
                    <span className="rounded-[8px] bg-brand-soft px-3 py-2 text-sm font-medium text-tier-1-ink">
                      📍 {userLocation.label || "Located"}
                    </span>
                    <button
                      onClick={clearLocation}
                      className="text-xs font-medium text-ink-muted underline hover:text-ink"
                    >
                      Turn off
                    </button>
                  </>
                ) : (
                  <button
                    onClick={enableLocation}
                    disabled={locationStatus === "loading"}
                    className="rounded-[8px] border border-hairline px-4 py-2 text-sm font-medium text-ink hover:bg-surface-raised disabled:opacity-60"
                  >
                    {locationStatus === "loading"
                      ? "Locating…"
                      : "📍 Use my location"}
                  </button>
                )}
              </div>
              {locationError && (
                <p className="mt-1 text-xs text-avoid">{locationError}</p>
              )}
              {userLocation?.lat != null && (
                <p className="mt-1 text-xs text-ink-faint">
                  Showing places within {radius} miles of you.
                </p>
              )}
            </div>

            {userLocation?.lat != null && (
              <label className="w-[150px]">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                  Search radius
                </span>
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className={SELECT}
                >
                  {RADIUS_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      Within {r} miles
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="flex-1 min-w-[180px]">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                Place name
              </span>
              <input
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                placeholder="Search by name"
                className="mt-2 w-full rounded-[8px] border border-hairline bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
              />
            </label>

            <button
              onClick={clearAll}
              className="rounded-[8px] border border-hairline px-4 py-2 text-xs font-medium text-ink-muted hover:text-ink"
            >
              Clear all
            </button>
          </div>
        </section>

        {avoid.length === 0 && !loading && (
          <p className="mt-6 rounded-[10px] bg-honey-soft px-4 py-3 text-sm text-honey-ink">
            No allergens selected — scores stay at zero until you pick what to
            avoid, or{" "}
            <Link to="/onboarding" className="underline">
              build your profile
            </Link>
            .
          </p>
        )}

        {placesQuery.error && (
          <p className="mt-6 text-sm text-avoid">
            Couldn't load places. Please refresh and try again.
          </p>
        )}

        {/* Interactive map of the matching places */}
        <section className="mt-8 overflow-hidden rounded-[12px] bg-panel ring-1 ring-hairline">
          <div className="flex items-center justify-between px-5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
              Map of matching places
            </p>
            <p className="text-xs text-ink-faint">
              {geoQuery.isLoading
                ? "Locating addresses…"
                : `${markers.length} mapped`}
            </p>
          </div>
          <ClientOnly
            fallback={<div className="h-[420px] w-full bg-surface-raised" />}
          >
            <Suspense
              fallback={<div className="h-[420px] w-full bg-surface-raised" />}
            >
              <PlacesMap
                markers={markers}
                userPoint={
                  userLocation?.lat != null && userLocation?.lng != null
                    ? { lat: userLocation.lat, lng: userLocation.lng }
                    : null
                }
              />
            </Suspense>
          </ClientOnly>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-1">
          {results.map((p) => (
            <PlaceResultCard
              key={p.id}
              place={p}
              avoid={avoid}
              allergens={allergens}
              diets={diets}
            />
          ))}
        </div>

        {!loading && results.length === 0 && (
          <p className="mt-10 text-center text-sm text-ink-muted">
            No places match these filters. Try clearing a few.
          </p>
        )}
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
          <Link to="/editprofile" className="text-ink-muted hover:text-ink">
            Edit profile
          </Link>
        </div>
      </nav>
    </div>
  );
}
