import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZeroCross — Allergen-Free Food Discovery You Can Trust" },
      {
        name: "description",
        content:
          "The safest food recommendations for people living with severe food allergies. Set your allergen matrix once and discover safe foods tailored to your exact profile.",
      },
      {
        property: "og:title",
        content: "ZeroCross — Allergen-Free Food Discovery You Can Trust",
      },
      {
        property: "og:description",
        content:
          "Set your allergen matrix once — we pre-apply it everywhere. Discover safe foods tailored to your exact allergen profile.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-surface text-ink antialiased selection:bg-accent">
      <header className="border-b border-hairline bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="text-xl font-semibold tracking-tight text-brand-deep">
            ZeroCross
          </div>
        </div>
      </header>
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12 text-center pb-20">
        <section className="max-w-3xl space-y-6">
          <h1 className="text-balance font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            Built for severe food allergies, not filters.
            <span className="text-ink-faint"> Set up your profile today</span>
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Link
              to="/auth/signup"
              className="rounded-[20px] bg-brand px-45 py-3 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-bright"
            >
              Create Your Account
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center">
            <Link
              to="/auth/signin"
              className="rounded-[20px] bg-surface-raised px-35 py-3 text-sm font-semibold text-ink ring-1 ring-hairline transition-colors hover:bg-surface-raised/50"
            >
              Already Have an Account? Login
            </Link>
          </div>
        </section>

        <section className="mt-20 w-full max-w-4xl rounded-[14px] bg-panel p-8 ring-1 ring-hairline">
          <p className="text-sm font-medium">
            Set your allergen matrix once — we pre-apply it everywhere.
          </p>
          <p className="mt-2 text-xs text-ink-muted">
            Discover safe foods tailored to your exact allergen profile.
          </p>
          <p className="mt-4 text-pretty text-xs text-ink-muted">
            Recommendations are based on publicly available information. This is
            not medical advice. Always verify safety in person with staff,
            labels, and packaging before eating or buying.
          </p>
        </section>
      </main>
    </div>
  );
}
