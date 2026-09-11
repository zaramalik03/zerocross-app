import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DIETS, FDA_ALLERGENS } from "@/lib/allergen-profile";
import {
  canonicalCuisine,
  cuisineFlag,
  fetchAllergens,
  fetchCuisines,
  fetchDiets,
  PROFILE_TO_DB_ALLERGEN,
} from "@/lib/places-data";

export const Route = createFileRoute("/addplace")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Allergen-free product discovery — ZeroCross" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { profile, loading: profileLoading } = useProfile();
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
  /** Strict diets hard-filter; flexible diets only sort matching items first. */
  const strictDiets = useMemo(
    () =>
      DIETS.filter((d) => profile.diets[d.id] === "strict").map((d) => d.dbId),
    [profile],
  );
  const flexDiets = useMemo(
    () => DIETS.filter((d) => profile.diets[d.id]).map((d) => d.dbId),
    [profile],
  );
  const [nameQuery, setNameQuery] = useState("");

  const avoid = profileAvoid;
  const allergens = allergenQuery.data ?? [];
  const diets = dietQuery.data ?? [];
  const cuisineList = useQuery({
    queryKey: ["cuisines"],
    queryFn: fetchCuisines,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col space-y-4 justify-between gap-4 px-6 py-3">
        <Link
          to="/"
          className="text-2xl font-semibold tracking-tight text-brand-deep text-center"
        >
          ZeroCross
        </Link>
      </div>
      <div className="flex flex-col gap-4">Add A Place</div>
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
    </main>
  );
}
