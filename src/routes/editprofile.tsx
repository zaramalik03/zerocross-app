import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import {
  ALLERGEN_GROUPS,
  DIETS,
  DIET_LEVELS,
  EMPTY_PROFILE,
  FDA_ALLERGENS,
  SEVERITIES,
  type AllergenProfile,
  type DietLevel,
  type SeverityId,
} from "@/lib/allergen-profile";

export const Route = createFileRoute("/editprofile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Edit Profile — ZeroCross" },
      {
        name: "description",
        content:
          "Select your allergens, severities and diet rules. Every ZeroCross score derives from this profile.",
      },
    ],
  }),
  component: EditProfile,
});

const STEPS = [
  { n: 1, label: "Allergens" },
  { n: 2, label: "Diet" },
];

function EditProfile() {
  const navigate = useNavigate();
  const { profile: saved, save, loading, isGuest } = useProfile();
  const [draft, setDraft] = useState<AllergenProfile>(EMPTY_PROFILE);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) setDraft(saved);
  }, [loading, saved]);

  const toggleAllergen = (id: string) =>
    setDraft((prev) => {
      const next = { ...prev.allergens };
      if (next[id]) delete next[id];
      else next[id] = "severe";
      return { ...prev, allergens: next };
    });

  const setSeverity = (id: string, severity: SeverityId) =>
    setDraft((prev) => ({
      ...prev,
      allergens: { ...prev.allergens, [id]: severity },
    }));

  const toggleDiet = (id: string) =>
    setDraft((prev) => {
      const next = { ...prev.diets };
      if (next[id]) delete next[id];
      else next[id] = "flexible";
      return { ...prev, diets: next };
    });

  const setLevel = (id: string, level: DietLevel) =>
    setDraft((prev) => ({ ...prev, diets: { ...prev.diets, [id]: level } }));

  async function finish() {
    setError(null);
    if (Object.keys(draft.allergens).length === 0) {
      setStep(1);
      setError("Select at least one allergen — every score depends on it.");
      return;
    }
    setSaving(true);
    try {
      await save(draft);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save your profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface text-ink antialiased">
      <header className="sticky top-0 z-40 border-b border-hairline bg-surface/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col space-y-4 justify-between gap-4 px-6 py-3">
          <Link
            to="/"
            className="text-2xl font-semibold tracking-tight text-brand-deep text-center"
          >
            ZeroCross
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        {error && (
          <p
            role="alert"
            className="rounded-[10px] border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {error}
          </p>
        )}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {STEPS.map((s) => (
              <button
                key={s.n}
                onClick={() => setStep(s.n)}
                className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                  step === s.n
                    ? "bg-ink text-surface"
                    : "bg-surface-raised text-ink-muted hover:text-ink"
                }`}
              >
                {s.n}. {s.label}
              </button>
            ))}
          </div>
        </div>

        {step === 1 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Select Your Allergies
              </h1>
              <p className="text-pretty text-sm text-ink-muted">
                Tap each one that applies, then set how severe the reaction is.
              </p>
            </div>

            {ALLERGEN_GROUPS.map((group) => (
              <div key={group} className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                  {group}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {FDA_ALLERGENS.filter((a) => a.group === group).map(
                    (allergen) => {
                      const severity = draft.allergens[allergen.id];
                      const selected = Boolean(severity);
                      return (
                        <div
                          key={allergen.id}
                          className={`rounded-[14px] p-4 ring-1 transition-all ${
                            selected
                              ? "bg-honey-soft ring-2 ring-honey"
                              : "bg-panel ring-hairline hover:ring-ink-faint"
                          }`}
                        >
                          <button
                            onClick={() => toggleAllergen(allergen.id)}
                            aria-pressed={selected}
                            className="w-full text-left"
                          >
                            <span className="flex items-start justify-between gap-3">
                              <span className="text-base font-medium">
                                {allergen.label}
                              </span>
                              <span
                                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                                  selected
                                    ? "bg-honey text-honey-ink"
                                    : "bg-surface-raised text-ink-faint"
                                }`}
                              >
                                {selected ? "✓" : "+"}
                              </span>
                            </span>
                            <span className="mt-1 block text-pretty text-xs text-ink-muted">
                              {allergen.description}
                            </span>
                          </button>

                          {selected && (
                            <fieldset className="mt-3 space-y-1.5 border-t border-honey/30 pt-3">
                              <legend className="sr-only">
                                Severity for {allergen.label}
                              </legend>
                              {SEVERITIES.map((level) => (
                                <label
                                  key={level.id}
                                  className="flex cursor-pointer items-start gap-2 text-xs"
                                >
                                  <input
                                    type="radio"
                                    name={`severity-${allergen.id}`}
                                    checked={severity === level.id}
                                    onChange={() =>
                                      setSeverity(allergen.id, level.id)
                                    }
                                    className="mt-0.5 size-3.5 accent-[var(--honey-ink)]"
                                  />
                                  <span>
                                    <span
                                      className={
                                        level.id === "anaphylactic"
                                          ? "font-semibold text-danger"
                                          : "font-medium text-ink"
                                      }
                                    >
                                      {level.label}
                                    </span>
                                    <span
                                      className={`ml-1.5 ${
                                        level.id === "anaphylactic"
                                          ? "text-danger/80"
                                          : "text-ink-faint"
                                      }`}
                                    >
                                      {level.note}
                                    </span>
                                  </span>
                                </label>
                              ))}
                            </fieldset>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {step === 2 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Diet preferences
              </h1>
              <p className="text-sm text-ink-muted">
                Optional. Skip if none apply.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {DIETS.map((diet) => {
                const active = Boolean(draft.diets[diet.id]);
                return (
                  <button
                    key={diet.id}
                    onClick={() => toggleDiet(diet.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${
                      active
                        ? "bg-honey-soft text-honey-ink ring-honey"
                        : "bg-panel text-ink-muted ring-hairline hover:text-ink"
                    }`}
                  >
                    {diet.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {DIETS.filter((d) => draft.diets[d.id]).map((diet) => (
                <div
                  key={diet.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] bg-panel px-4 py-3 ring-1 ring-hairline"
                >
                  <span className="text-sm font-medium">{diet.label}</span>
                  <div className="flex gap-4">
                    {DIET_LEVELS.map((level) => (
                      <label
                        key={level.id}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <input
                          type="radio"
                          name={`level-${diet.id}`}
                          checked={draft.diets[diet.id] === level.id}
                          onChange={() => setLevel(diet.id, level.id)}
                          className="size-3.5 accent-[var(--honey-ink)]"
                        />
                        {level.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-hairline pt-6">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="rounded-[10px] px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
          >
            Back
          </button>
          {step < 2 ? (
            <button
              onClick={() => {
                if (step === 1 && Object.keys(draft.allergens).length === 0) {
                  setError(
                    "Select at least one allergen — every score depends on it.",
                  );
                  return;
                }
                setError(null);
                setStep((s) => s + 1);
              }}
              className="rounded-[10px] bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-bright"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-[10px] bg-brand px-5 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-bright disabled:opacity-60"
            >
              {saving && (
                <span className="size-3.5 animate-spin rounded-full border-2 border-on-brand/40 border-t-on-brand" />
              )}
              {saving ? "Saving profile…" : "Finish and see my matches"}
            </button>
          )}
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
          <Link to="/onboarding" className="text-ink-muted hover:text-ink">
            Edit profile
          </Link>
        </div>
      </nav>
    </div>
  );
}
