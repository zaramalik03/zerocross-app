import { Link } from "@tanstack/react-router";
import { shareCardText } from "@/lib/share-card";
import { useState } from "react";
import {
  FDA_ALLERGENS,
  SEVERITIES,
  type AllergenProfile,
} from "@/lib/allergen-profile";

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

/** Compact chef card, generated from the profile and printable in place. */
export function ChefCardWidget({ profile }: { profile: AllergenProfile }) {
  const [note, setNote] = useState<string | null>(null);

  const entries = FDA_ALLERGENS.filter((a) => profile.allergens[a.id]).map(
    (a) => ({
      id: a.id,
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
    if (result) setNote(result);
  }

  return (
    // Align this to be center of the page, and make it a bit smaller than the full page width
    <section className="mx-auto flex w-full max-w-md flex-col space-y-4">
      <div className="no-print flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Your Chef Card
          </h2>
          <p className="text-sm text-ink-muted">
            Show this to your server before ordering.
          </p>
        </div>
        <Link
          to="/chef-card"
          className="text-xs font-medium text-tier-1-ink hover:underline"
        >
          Full page →
        </Link>
      </div>

      <article className="chef-card overflow-hidden rounded-[12px] bg-white text-[#101613] ring-1 ring-hairline">
        <div className="border-b-[3px] border-[#1A3D2B] bg-[#F4F6F4] px-5 py-4 text-center">
          <h3 className="font-display text-lg font-semibold uppercase tracking-tight text-[#1A3D2B]">
            Food Allergy — Please Read
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#4B5A52]">
            Verified by ZeroCross allergen profile
          </p>
        </div>
        <div className="space-y-4 px-5 py-5">
          <p className="text-sm font-semibold leading-snug">
            I have a medically-confirmed food allergy and CANNOT consume:
          </p>
          <ul className="space-y-3">
            {entries.map((e) => (
              <li key={e.id} className="flex gap-3">
                <span className="mt-[1px] font-mono text-base font-bold leading-none text-[#7F1D1D]">
                  ✗
                </span>
                <div className="space-y-1">
                  <p className="text-[13px] leading-relaxed">{e.language}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6B7A72]">
                    {SEVERITIES.find((s) => s.id === e.severity)?.label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 border-t border-[#D8DED9] pt-4">
            <span className="mt-[1px] font-mono text-base font-bold leading-none text-[#92400E]">
              ⚠
            </span>
            <p className="text-[13px] leading-relaxed text-[#3B4741]">
              Cross-contact is a serious risk. Please use clean utensils and
              separate prep surfaces. If unsure, ask the chef.
            </p>
          </div>
        </div>
      </article>

      <div className="no-print flex gap-3">
        <button
          onClick={() => window.print()}
          className="flex-1 rounded-[10px] bg-brand px-4 py-2 text-sm font-medium text-on-brand transition-colors hover:bg-brand-bright"
        >
          Print card
        </button>
        <button
          onClick={shareCard}
          className="flex-1 rounded-[10px] border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
        >
          Share card
        </button>
      </div>
      {note ? <p className="no-print text-xs text-ink-muted">{note}</p> : null}
    </section>
  );
}
