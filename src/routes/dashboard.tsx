import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ChefCardWidget } from "@/components/zerocross/ChefCardWidget";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { FDA_ALLERGENS, SEVERITIES } from "@/lib/allergen-profile";
import { fetchPlaces, PROFILE_TO_DB_ALLERGEN } from "@/lib/places-data";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your safety dashboard — ZeroCross" },
      {
        name: "description",
        content:
          "Every place scored against your saved allergen matrix, with filters pre-applied automatically.",
      },
      { property: "og:title", content: "Your safety dashboard — ZeroCross" },
      {
        property: "og:description",
        content:
          "Your allergen profile, chef card and saved food places in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { profile, loading, isGuest } = useProfile();
  const placesQuery = useQuery({ queryKey: ["places"], queryFn: fetchPlaces });

  const activeAllergens = useMemo(
    () => FDA_ALLERGENS.filter((a) => profile.allergens[a.id]),
    [profile],
  );

  const avoid = useMemo(() => {
    const ids = new Set<number>();
    for (const a of activeAllergens) {
      for (const dbId of PROFILE_TO_DB_ALLERGEN[a.id] ?? []) ids.add(dbId);
    }
    return [...ids].sort((x, y) => x - y);
  }, [activeAllergens]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth/signin", replace: true });
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface text-sm text-ink-muted">
        Loading your profile…
      </div>
    );
  }

  if (activeAllergens.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Your allergen matrix is empty
          </h1>
          <p className="text-sm text-ink-muted">
            Every score, filter and swap derives from your profile. It takes a
            minute.
          </p>
          <Link
            to="/onboarding"
            className="inline-flex rounded-[10px] bg-brand px-5 py-2.5 text-sm font-medium text-on-brand hover:bg-brand-bright"
          >
            Build my profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-ink antialiased">
      <header className="no-print sticky top-0 z-50 border-b border-hairline bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col space-y-4 justify-between gap-4 px-6 py-3">
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-brand-deep text-center"
          >
            ZeroCross
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-16 px-2 py-12">
        <section className="mx-auto flex w-full max-w-md flex-col space-y-4">
          <ChefCardWidget profile={profile} />
          {/* Put in Your Profile with your name, location, allergies, and hearted places*/}
          <div className="mt-3 no-print flex items-start justify-between gap-3">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Your Profile
            </h2>
          </div>
          <div className="space-y-2 rounded-[12px] bg-panel p-4 ring-1 ring-hairline">
            Your Allergies
            <div className="flex flex-wrap gap-1.5 bg-panel ring-1 ring-hairline p-2 rounded-[10px]">
              {activeAllergens.map((a) => {
                const severity = profile.allergens[a.id];
                const critical =
                  severity === "anaphylactic" || severity === "severe";
                return (
                  <span
                    key={a.id}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      critical
                        ? "bg-honey-soft text-honey-ink ring-1 ring-honey"
                        : "bg-surface-raised text-ink"
                    }`}
                  >
                    {a.label}
                    <span className="font-mono text-[9px] opacity-70">
                      {
                        SEVERITIES.find((s) => s.id === severity)?.label.split(
                          " ",
                        )[0]
                      }
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="space-y-2 rounded-[12px] bg-panel p-4 ring-1 ring-hairline">
            Your Hearted Places
            <div className="flex flex-wrap gap-1.5 bg-panel ring-1 ring-hairline p-2 rounded-[10px]">
              {/* {profile.hearted_places.length === 0 ? (
                <span className="text-sm text-ink-muted">No hearted places yet.</span>
              ) : (
                profile.hearted_places.map((p) => (
                  <Link
                    key={p.id}
                    to="/places/$id"
                    params={{ id: String(p.id) }}
                    className="inline-flex items-center gap-1 rounded-full bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-ink ring-1 ring-hairline hover:bg-surface-raised/50"
                  >
                    {p.name}
                  </Link>
                ))
              )} */}
            </div>
          </div>
        </section>
        <div className="mx-auto flex w-full max-w-md flex-col space-y-4">
          <button
            // onClick={() => window.print()}
            className="flex-1 rounded-[10px] bg-brand px-4 py-2 text-sm font-medium text-on-brand transition-colors hover:bg-brand-bright"
          >
            Feedback & Support
          </button>
          <button className="flex-1 rounded-[10px] bg-brand px-4 py-2 text-sm font-medium text-on-brand transition-colors hover:bg-brand-bright">
            Invite Friends
          </button>
          <button
            onClick={signOut}
            className="flex-1 rounded-[10px] bg-surface-raised px-4 py-2 text-sm font-medium text-ink ring-1 ring-hairline transition-colors hover:bg-surface-raised/50"
          >
            Logout
          </button>
        </div>
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
      <footer>
        <div className="mx-auto max-w-6xl px-6 py-4 text-center text-xs text-ink-muted">
          &copy; {new Date().getFullYear()} ZeroCross. All rights reserved.
        </div>
        <div className="mx-auto max-w-6xl px-6 py-2 text-center text-xs text-ink-muted space-x-4">
          Terms of Service | Privacy Policy | Contact Us
        </div>
      </footer>
    </div>
  );
}
