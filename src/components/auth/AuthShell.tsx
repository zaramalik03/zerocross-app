import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface text-ink antialiased">
      <header className="border-b border-hairline bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-brand-deep"
          >
            ZeroCross
          </Link>
        </div>
      </header>
      <main className="mx-auto flex max-w-md flex-col gap-8 px-6 py-16">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-pretty text-sm text-ink-muted">{subtitle}</p>
        </div>
        {children}
        {footer}
      </main>
    </div>
  );
}

export function Field({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-[10px] border border-hairline bg-panel px-3 py-2.5 text-sm text-ink outline-none ring-brand/30 transition placeholder:text-ink-faint focus:border-brand focus:ring-4"
      />
      {hint && <span className="block text-[11px] text-ink-faint">{hint}</span>}
    </label>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-[10px] border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger"
    >
      {message}
    </p>
  );
}

export function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-4 py-2.5 text-sm font-medium text-on-brand transition-colors hover:bg-brand-bright disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && (
        <span className="size-3.5 animate-spin rounded-full border-2 border-on-brand/40 border-t-on-brand" />
      )}
      {children}
    </button>
  );
}
