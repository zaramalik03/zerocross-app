import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthShell,
  Field,
  FormError,
  SubmitButton,
} from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your ZeroCross password" },
      {
        name: "description",
        content: "Send yourself a secure link to set a new ZeroCross password.",
      },
      { property: "og:title", content: "Reset your ZeroCross password" },
      {
        property: "og:description",
        content: "Send yourself a secure link to set a new ZeroCross password.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/reset-password` },
      );
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setSent(true);
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
      title="Forgot password"
      subtitle="We'll email a secure link so you can set a new password."
      footer={
        <p className="text-sm text-ink-muted">
          <Link
            to="/auth/signin"
            className="font-medium text-tier-1-ink hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      {sent ? (
        <p className="rounded-[10px] border border-brand/30 bg-brand-soft px-3 py-2 text-sm text-brand-deep">
          If that email has an account, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={handleReset} className="space-y-4" noValidate>
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
          <SubmitButton loading={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
