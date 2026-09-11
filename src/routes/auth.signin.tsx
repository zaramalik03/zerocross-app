import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthShell,
  Field,
  FormError,
  SubmitButton,
} from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";

type SignInSearch = { confirm?: string };

export const Route = createFileRoute("/auth/signin")({
  validateSearch: (search: Record<string, unknown>): SignInSearch =>
    typeof search["confirm"] === "string" ? { confirm: search["confirm"] } : {},
  head: () => ({
    meta: [
      { title: "Sign in to ZeroCross" },
      {
        name: "description",
        content:
          "Sign in to load your saved allergen matrix, severities and diet rules on this device.",
      },
      { property: "og:title", content: "Sign in to ZeroCross" },
      {
        property: "og:description",
        content:
          "Your allergen profile, synced and pre-applied to every search.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        setError("Sign in failed. Try again.");
        return;
      }

      const { data: row } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", userId)
        .maybeSingle();

      navigate({ to: row?.onboarding_complete ? "/dashboard" : "/onboarding" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Load your allergen matrix and every score recalculates for you."
      footer={
        <p className="text-sm text-ink-muted">
          New to ZeroCross?{" "}
          <Link
            to="/auth/signup"
            className="font-medium text-tier-1-ink hover:underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSignIn} className="space-y-4" noValidate>
        <FormError message={error} />
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <div className="flex justify-end">
          <Link
            to="/auth/forgot-password"
            className="text-xs font-medium text-ink-muted hover:text-ink"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton loading={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
