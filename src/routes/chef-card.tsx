import { createFileRoute, Link } from "@tanstack/react-router";
import { shareCardText } from "@/lib/share-card";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { FDA_ALLERGENS, SEVERITIES } from "@/lib/allergen-profile";

export const Route = createFileRoute("/chef-card")({
  head: () => ({
    meta: [
      { title: "Your Chef Card — ZeroCross Allergen Card for Restaurants" },
      {
        name: "description",
        content:
          "Generate a print-ready chef card from your ZeroCross allergen profile. Show it to your server or chef before ordering to prevent cross-contact.",
      },
      { property: "og:title", content: "Your Chef Card — ZeroCross" },
      {
        property: "og:description",
        content:
          "A print-ready allergen card generated from your profile, written in language kitchens act on.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChefCardPage,
});

/** Exact restaurant-facing language for each allergen. Do not paraphrase. */
const ALLERGEN_LANGUAGE: Record<string, string> = {
  gluten:
    "gluten and all wheat products including bread, pasta, flour, soy sauce, and malt",
  peanut:
    "peanuts and all peanut products including peanut oil and peanut butter",
  tree_nut:
    "all tree nuts including almonds, cashews, walnuts, pecans, and their oils",
  dairy: "all dairy including milk, cheese, butter, cream, and whey",
  egg: "all eggs and egg products including egg whites, yolks, and mayonnaise",
  soy: "all soy products including tofu, edamame, miso, and soy sauce",
  shellfish: "all shellfish including shrimp, crab, lobster, and scallops",
  fish: "all fish including salmon, tuna, cod, and tilapia",
  sesame: "sesame seeds, sesame oil, and tahini",
};

/** Profile allergen ids → chef-card language keys. */
const PROFILE_TO_LANGUAGE: Record<string, string> = {
  wheat: "gluten",
  peanut: "peanut",
  "tree-nut": "tree_nut",
  milk: "dairy",
  egg: "egg",
  soy: "soy",
  shellfish: "shellfish",
  fish: "fish",
  sesame: "sesame",
};

function ChefCardPage() {
  const { profile, loading } = useProfile();
  const [shareNote, setShareNote] = useState<string | null>(null);

  const entries = FDA_ALLERGENS.filter((a) => profile.allergens[a.id]).map(
    (a) => ({
      id: a.id,
      label: a.label,
      severity: profile.allergens[a.id],
      language:
        ALLERGEN_LANGUAGE[PROFILE_TO_LANGUAGE[a.id] ?? ""] ?? a.description,
    }),
  );

  const cardText = [
    "FOOD ALLERGY — PLEASE READ",
    "Verified by ZeroCross allergen profile",
    "",
    "I have a medically-confirmed food allergy and CANNOT consume:",
    ...entries.map((e) => `- ${e.language}`),
    "",
    "Cross-contact is a serious risk. Please use clean utensils and separate prep surfaces. If unsure, ask the chef.",
  ].join("\n");

  async function shareCard() {
    const result = await shareCardText(cardText);
    if (result) setShareNote(result);
  }

  async function saveToHomeScreen() {
    const w = window as unknown as {
      __zcInstallPrompt?: { prompt: () => void };
    };
    if (w.__zcInstallPrompt) {
      w.__zcInstallPrompt.prompt();
      return;
    }
    setShareNote(
      "To save this card: open your browser menu and choose “Add to Home Screen”.",
    );
  }

  return (
    <div className="min-h-screen bg-inverse-surface text-inverse-ink antialiased">
      <header className="no-print border-b border-inverse-hairline">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-brand-bright"
          >
            ZeroCross
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/places"
              className="text-inverse-muted hover:text-inverse-ink"
            >
              Places
            </Link>
            <Link
              to="/addplace"
              className="text-inverse-muted hover:text-inverse-ink"
            >
              Add Place
            </Link>

            <Link
              to="/dashboard"
              className="text-inverse-muted hover:text-inverse-ink"
            >
              Dashboard
            </Link>
            <Link to="/menuanalyzer" className="text-ink-muted hover:text-ink">
              Menu Analyzer
            </Link>
            <Link to="/chef-card" className="font-medium text-brand-bright">
              Chef Card
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="no-print space-y-2 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Your Chef Card
          </h1>
          <p className="text-sm text-inverse-muted">
            Show this to your server or chef before ordering. Generated from
            your allergen profile.
          </p>
        </div>

        {loading ? (
          <p className="mt-12 text-center font-mono text-xs uppercase tracking-widest text-inverse-muted">
            Loading profile…
          </p>
        ) : entries.length === 0 ? (
          <div className="no-print mx-auto mt-12 max-w-md space-y-4 rounded-[12px] border border-inverse-hairline p-8 text-center">
            <h2 className="text-lg font-medium">No allergens on file yet</h2>
            <p className="text-sm text-inverse-muted">
              Your chef card is generated from your allergen matrix. Build it
              once and the card writes itself.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex rounded-[10px] bg-brand px-5 py-2.5 text-sm font-medium text-on-brand hover:bg-brand-bright"
            >
              Build my profile
            </Link>
          </div>
        ) : (
          <>
            <article className="chef-card zc-rise mx-auto mt-10 max-w-xl overflow-hidden rounded-[14px] bg-white text-[#101613] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
              <div className="border-b-[3px] border-[#1A3D2B] bg-[#F4F6F4] px-7 py-5 text-center">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-[#1A3D2B]">
                  Food Allergy — Please Read
                </h2>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#4B5A52]">
                  Verified by ZeroCross allergen profile
                </p>
              </div>

              <div className="space-y-5 px-7 py-6">
                <p className="text-[15px] font-semibold leading-snug">
                  I have a medically-confirmed food allergy and CANNOT consume:
                </p>

                <ul className="space-y-4">
                  {entries.map((e) => (
                    <li key={e.id} className="flex gap-3">
                      <span className="mt-[2px] font-mono text-lg font-bold leading-none text-[#7F1D1D]">
                        ✗
                      </span>
                      <div className="space-y-1">
                        <p className="text-[15px] leading-relaxed">
                          {e.language}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6B7A72]">
                          {SEVERITIES.find((s) => s.id === e.severity)?.label}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3 border-t border-[#D8DED9] pt-5">
                  <span className="mt-[2px] font-mono text-lg font-bold leading-none text-[#92400E]">
                    ⚠
                  </span>
                  <p className="text-[14px] leading-relaxed text-[#3B4741]">
                    Cross-contact is a serious risk. Please use clean utensils
                    and separate prep surfaces. If unsure, ask the chef.
                  </p>
                </div>
              </div>
            </article>

            <div className="no-print mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-[10px] bg-brand px-4 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-bright"
              >
                Print card
              </button>
              <button
                onClick={shareCard}
                className="flex-1 rounded-[10px] border border-inverse-hairline px-4 py-2.5 text-sm font-medium text-inverse-ink transition-colors hover:bg-inverse-panel"
              >
                Share card
              </button>
              <button
                onClick={saveToHomeScreen}
                className="flex-1 rounded-[10px] border border-inverse-hairline px-4 py-2.5 text-sm font-medium text-inverse-ink transition-colors hover:bg-inverse-panel"
              >
                Save to home screen
              </button>
            </div>

            {shareNote ? (
              <p className="no-print mt-3 text-center text-xs text-inverse-muted">
                {shareNote}
              </p>
            ) : null}

            <p className="no-print mx-auto mt-6 max-w-xl text-center text-xs text-inverse-muted">
              Need to change something?{" "}
              <Link to="/onboarding" className="underline">
                Edit your allergen profile
              </Link>
              .
            </p>
          </>
        )}
      </main>
    </div>
  );
}
