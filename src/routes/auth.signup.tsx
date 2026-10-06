import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthShell,
  Field,
  FormError,
  SubmitButton,
} from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create your ZeroCross allergen profile" },
      {
        name: "description",
        content:
          "Create a ZeroCross account to save your allergen matrix, severities and diet rules across every device.",
      },
      {
        property: "og:title",
        content: "Create your ZeroCross allergen profile",
      },
      {
        property: "og:description",
        content:
          "Save your allergen matrix once — ZeroCross pre-applies it to every place, product and score.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError("Enter the full name we should put on your chef card.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { display_name: fullName.trim() },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      const user = data.user;
      if (user) {
        const { error: rowError } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            display_name: fullName.trim(),
            email: email.trim(),
          },
          { onConflict: "id" },
        );
        if (rowError && rowError.code !== "23505") {
          setError(rowError.message);
          return;
        }
      }

      navigate({ to: "/onboarding" });
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
      title="Create your account"
      subtitle="One allergen profile, applied automatically to every place, product and score."
      footer={
        <p className="text-sm text-ink-muted">
          Already have an account?{" "}
          <Link
            to="/auth/signin"
            className="font-medium text-tier-1-ink hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSignUp} className="space-y-4" noValidate>
        <FormError message={error} />
        <Field
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          placeholder="Maya Lindqvist"
        />
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
          autoComplete="new-password"
          hint="Minimum 6 characters."
          required
        />
        <SubmitButton loading={loading}>
          {loading ? "Creating account…" : "Create account"}
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
