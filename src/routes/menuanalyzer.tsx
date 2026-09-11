import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/menuanalyzer")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Menu Analyzer — ZeroCross" },
      {
        name: "description",
        content:
          "Classic recipes rebuilt around your allergen profile, with verified grocery swaps for all purpose flour, milk, and cheese.",
      },
      { property: "og:title", content: "Menu Analyzer — ZeroCross" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuAnalyzerPage,
});

function MenuAnalyzerPage() {
  const SELECT =
    "mt-2 w-full rounded-[8px] border border-hairline bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand";
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
      <div className="flex flex-col gap-4">Analyze Any Ingredients</div>
      <nav className="fixed inset-x-0 sticky bottom-0 z-30 border-b border-hairline bg-surface/85 backdrop-blur-md">
        <div className="flex max-w-2xl items-center justify-between gap-2 px-3 pt-2 py-3 mx-auto">
          <Link to="/places" className="text-ink-muted hover:text-ink">
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
